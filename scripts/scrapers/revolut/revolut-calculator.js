/*  revolut-calculator.js
    ────────────────────────────────────────────────────────────
    Simple quote grabber for any Revolut corridor using their
    public remittance routes endpoint (v2).
    Requires **Node 18+** (built‑in fetch).  No external deps.

    USAGE  (square = optional) ────────────────────────────────
      node revolut-calculator.js \
           <amount> <sourceCurrency> <destCurrency> \
           [sourceCountry] [destCountry]

      amount          – Number you want to **send** (anchor = SEND).
      sourceCurrency  – Three‑letter ISO‑4217 (GBP, USD …).
      destCurrency    – Three‑letter ISO‑4217 (EUR, INR …).
      sourceCountry   – ISO‑3166‑2 code of the sender country; if omitted
                        we try to guess from the currency (GBP→GB, USD→US …).
      destCountry     – ISO‑3166‑2 of the receiver country; if omitted we
                        try a best‑effort guess (EUR→FR, INR→IN …).

    EXAMPLES ─────────────────────────────────────────────────
      node revolut-calculator.js 100  GBP EUR            # GB→FR
      node revolut-calculator.js 750  USD MXN USA MEX    # explicit countries
      node revolut-calculator.js 5000 AUD INR            # AU→IN

    OUTPUT  ────────────────────────────────────────────────
      • Plain‑text lines for humans
      • console.table for quick inspection
      • "JSON_OUTPUT: …" single‑line JSON for downstream parsing
*/

console.log(`Revolut Calculator starting with arguments: ${process.argv.slice(2).join(', ')}`);

/* ─ helpers ─────────────────────────────────────────────── */
const qs = o => new URLSearchParams(o).toString();
const asJSON = r => r.json();

const isoGuess2 = cur => ({
  AUD: 'AU', CAD: 'CA', EUR: 'FR',
  GBP: 'GB', INR: 'IN', MXN: 'MX',
  NZD: 'NZ', SGD: 'SG', USD: 'US',
  HKD: 'HK'
}[cur.toUpperCase()] || 'GB');      // safe fallback to GB

/* ─ args ─────────────────────────────────────────────────── */
const [
  ,,
  amtArg, srcCurArg, dstCurArg,
  srcCtryArg, dstCtryArg
] = process.argv;

if (!amtArg || !srcCurArg || !dstCurArg) {
  console.error('Usage: node revolut-calculator.js <amount> <sourceCur> <destCur> [sourceCountry] [destCountry]');
  process.exit(1);
}

const amount        = Number(amtArg);
const sourceCur     = srcCurArg.toUpperCase();
const destCur       = dstCurArg.toUpperCase();
const sourceCountry = (srcCtryArg || isoGuess2(sourceCur)).toUpperCase();
const destCountry   = (dstCtryArg || isoGuess2(destCur)).toUpperCase();

/* ─ main ─────────────────────────────────────────────────── */
(async () => {
  try {
    console.log(`Fetching quote for ${amount} ${sourceCur} (from ${sourceCountry}) → ${destCur} (to ${destCountry})`);

    /* 1️⃣  Build Revolut /remittance/routes query */
    // Revolut expects amounts in the smallest unit of currency (e.g., pennies for GBP)
    // Convert the amount accordingly
    const revolutAmount = amount * 100;
    
    const params = {
      amount: revolutAmount,
      isRecipientAmount: 'false',
      recipientCountry: destCountry,
      recipientCurrency: destCur,
      senderCountry: sourceCountry,
      senderCurrency: sourceCur
    };

    const url = `https://www.revolut.com/api/remittance/routes?${qs(params)}`;
    console.log(`GET ${url}`);

    const headers = {
      'accept': 'application/json',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'origin': 'https://www.revolut.com',
      'referer': 'https://www.revolut.com/',
      'user-agent': 'Mozilla/5.0 (Node.js script)',
      'x-api-version': 'v2'
    };

    /* 2️⃣  Fetch */
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching routes`);

    const body = await asJSON(res);
    const { rate, routes } = body;
    if (!rate || !Array.isArray(routes)) throw new Error('Malformed response (missing rate or routes)');

    // Extract the timestamp from the rate data
    const timestamp = rate.timestamp || Date.now();
    console.log(`Rate timestamp from API: ${timestamp}`);

    /* 3️⃣  Filter to find BANK routes with STANDARD plans */
    // First find all BANK routes
    const bankRoutes = routes.filter(r => r.id === 'BANK');
    
    if (!bankRoutes.length) {
      console.log('No BANK routes found, failing - only BANK routes are supported');
      throw new Error('No BANK routes found for this currency pair');
    } else {
      console.log(`Found ${bankRoutes.length} BANK routes`);
      
      // For each BANK route, find all STANDARD plans
      const standardPlans = bankRoutes.flatMap(r => 
        r.plans.filter(p => p.id === 'STANDARD').map(p => ({ route: r, plan: p }))
      );
      
      if (!standardPlans.length) {
        console.log('No STANDARD plans found in BANK routes, failing');
        throw new Error('No STANDARD plans found for BANK transfer');
      } else {
        console.log(`Found ${standardPlans.length} STANDARD plans in BANK routes`);
        
        // Find the best STANDARD plan (lowest fee)
        const bestStandardPlan = standardPlans.reduce((min, curr) =>
          (curr.plan.fees?.total ?? Infinity) < (min.plan.fees?.total ?? Infinity) ? curr : min, standardPlans[0]);
        
        processResult(rate, bestStandardPlan.route, bestStandardPlan.plan, timestamp);
      }
    }
    
    function processResult(rate, route, plan, timestamp) {
      // Revolut returns amounts in smallest currency units (pennies, cents)
      // Convert to standard currency units for display and calculations
      const rawExchangeRate = rate.rate || 'n/a';
      
      // Extract values from the plan data structure
      const senderAmount = plan.totalSenderAmount?.amount ?? 0;
      const senderCurrency = plan.totalSenderAmount?.currency || sourceCur;
      const recipientAmount = plan.totalRecipientAmount?.amount ?? 0;
      const recipientCurrency = plan.totalRecipientAmount?.currency || destCur;
      const totalFee = plan.fees?.total ?? 0;
      const feeCurrency = plan.fees?.currency || sourceCur;
      
      // Convert from minor units (pennies/cents) to major units (pounds/euros)
      const senderAmountDecimal = senderAmount / 100;
      const recipientAmountDecimal = recipientAmount / 100;
      const totalFeeDecimal = totalFee / 100;
      
      // Calculate the effective exchange rate based on actual amounts
      const effectiveRate = senderAmountDecimal > 0 ? 
        recipientAmountDecimal / (senderAmountDecimal - totalFeeDecimal) : 
        rawExchangeRate;
      
      /* 4️⃣  Output */
      console.log(`Revolut Quote Result (Route: ${route.name || route.id}, Plan: ${plan.id}):`);
      console.log(`- Exchange rate:       ${effectiveRate}`);
      console.log(`- Total fee:           ${totalFeeDecimal} ${feeCurrency}`);
      console.log(`- Amount charged:      ${senderAmountDecimal} ${senderCurrency}`);
      console.log(`- Amount received:     ${recipientAmountDecimal} ${recipientCurrency}`);
      console.log(`- Route ID:            ${route.id}`);
      console.log(`- Plan ID:             ${plan.id}`);
      console.log(`- Timestamp:           ${timestamp}`);
      
      // Additional info for BANK routes
      if (route.id === 'BANK') {
        console.log(`- Transfer Type:       ${route.transferType || 'N/A'}`);
        console.log(`- Estimated Delivery:  ${route.estimate || 'N/A'}`);
      }
      
      // Table view
      console.table({
        'Route':           route.id,
        'Plan':            plan.id,
        'Exchange rate':   effectiveRate,
        'Total fee':       `${totalFeeDecimal} ${feeCurrency}`,
        'Amount charged':  `${senderAmountDecimal} ${senderCurrency}`,
        'Amount received': `${recipientAmountDecimal} ${recipientCurrency}`,
        'Transfer Type':   route.transferType || 'N/A',
        'Est. Delivery':   route.estimate || 'N/A',
        'Timestamp':       timestamp
      });
      
      // Machine‑readable JSON on one line
      console.log('JSON_OUTPUT:', JSON.stringify({
        route:            route.id,
        plan:             plan.id,
        exchange_rate:    effectiveRate,
        total_fee:        totalFeeDecimal,
        fee_currency:     feeCurrency,
        amount_charged:   senderAmountDecimal,
        amount_received:  recipientAmountDecimal,
        transfer_type:    route.transferType || null,
        estimate:         route.estimate || null,
        timestamp:        timestamp
      }));
    }

  } catch (err) {
    console.error('❌', err.message || err);
    process.exit(1);
  }
})(); 