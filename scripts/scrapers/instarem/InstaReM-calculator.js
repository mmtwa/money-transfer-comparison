/*  instarem‑calculator.js
    ────────────────────────────────────────────────────────────
    One‑file quote grabber for any InstaReM corridor.
    Requires Node 18+ (global fetch).  No Puppeteer, no deps.

    USAGE  (square = optional) ────────────────────────────────
      node instarem‑calculator.js \
           <amount> <sourceCurrency> <destCurrency> \
           [countryCode] [payMethodId]

      countryCode   – ISO‑2 of the **sender's** country; if omitted we try
                      to guess from the source currency (USD→US, AUD→AU …).
      payMethodId   – InstaReM "bank account id".  If omitted we fetch the
                      /payment‑method list and pick a non‑PG (bank‑transfer)
                      option, falling back to the first one.

    EXAMPLES ─────────────────────────────────────────────────
      node instarem‑calculator.js 1000 USD AUD        # sender in US
      node instarem‑calculator.js 700  GBP EUR        # sender in GB
      node instarem‑calculator.js 500  SGD INR SG 162 # force Debit‑Card
*/

// Log startup for debugging
console.log(`InstaReM Calculator starting with arguments: ${process.argv.slice(2).join(', ')}`);

const isoGuess = cur => ({
  AUD: 'AU', CAD: 'CA', EUR: 'IE',
  GBP: 'GB', INR: 'IN', NZD: 'NZ',
  SGD: 'SG', USD: 'US',
}[cur.toUpperCase()] || 'GB');         // safe default

/* ─ helpers ──────────────────────────────────────────────── */
const qs = obj => new URLSearchParams(obj).toString();
const asJSON = r => r.json();

/* ─ args ─────────────────────────────────────────────────── */
const [
  ,,
  amtArg, srcCurArg, dstCurArg,
  ctryArg, payIdArg
] = process.argv;

if (!amtArg || !srcCurArg || !dstCurArg) {
  console.error('Usage: node instarem‑calculator.js <amount> <sourceCur> <destCur> [countryCode] [payMethodId]');
  process.exit(1);
}
const amount      = Number(amtArg);
const sourceCur   = srcCurArg.toUpperCase();
const destCur     = dstCurArg.toUpperCase();
const countryCode = (ctryArg || isoGuess(sourceCur)).toUpperCase();
const payIdCLI    = payIdArg && Number(payIdArg);

/* ─ main ─────────────────────────────────────────────────── */
(async () => {
  try {
    console.log(`Fetching data for ${amount} ${sourceCur} to ${destCur} (country: ${countryCode}, payment method ID: ${payIdCLI || 'auto'})`);
    
    /* 1️⃣  payment‑method list (needed only if user did not pass id) */
    let payId = payIdCLI;
    if (!payId) {
      const listURL = 'https://www.instarem.com/api/v1/public/payment-method/fee?' +
                      qs({ source_currency: sourceCur,
                           destination_currency: destCur,
                           country_code: countryCode,
                           source_amount: amount });
      console.log(`Fetching payment methods from: ${listURL}`);
      const list = await fetch(listURL).then(asJSON);

      if (!list.success || !Array.isArray(list.data) || !list.data.length) {
        throw new Error('No payment methods returned for that corridor.');
      }
      /* pick first NON‑PG ("Bank Transfer" type) if possible */
      const bankXfer = list.data.find(m => m.is_pg === false) || list.data[0];
      payId = bankXfer.value;           // the id InstaReM wants
      console.log(`Selected payment method ID: ${payId} (${bankXfer.name || 'Unknown'})`);
    }

    /* 2️⃣  /transaction/computed‑value  */
    const compURL = 'https://www.instarem.com/api/v1/public/transaction/computed-value?' +
                    qs({
                      source_currency:            sourceCur,
                      destination_currency:       destCur,
                      country_code:               countryCode,
                      instarem_bank_account_id:   payId,
                      source_amount:              amount
                    });
    console.log(`Fetching computed value from: ${compURL}`);
    const comp = await fetch(compURL).then(asJSON);
    if (!comp.success) throw new Error('computed‑value call failed');
    const q = comp.data;

    /* 3️⃣  /payout‑method   (for ETA) */
    const payOutURL = 'https://www.instarem.com/api/v1/public/payout-method?' +
                      qs({ source_currency: sourceCur, destination_currency: destCur });
    console.log(`Fetching payout method from: ${payOutURL}`);
    const payout = await fetch(payOutURL).then(asJSON).then(j => j.data?.[0] ?? null);

    /* 4️⃣  pull the info */
    const exchangeRate  = q.instarem_fx_rate ?? q.fx_rate;
    const totalFee      = ((q.payment_method_fee_amount ?? 0)
                          + (q.transaction_fee_amount ?? 0)
                          + (q.payout_method_fee_amount ?? 0))
                          .toFixed(2);
    const receiveAmount = q.destination_amount;
    
    /* New: Determine delivery estimate based on rail type */
    let eta = payout?.estimated_transfer_time || 'n/a';
    let railType = null;
    
    // Extract rail type (LOCAL, SWIFT, etc.) from the response data
    if (q.payout_type) {
      railType = q.payout_type;
    } else if (payout?.payout_type) {
      railType = payout.payout_type;
    } else if (q.payout_method_type) {
      railType = q.payout_method_type;
    }
    
    console.log(`Detected rail type: ${railType || 'Unknown'}`);
    
    // Apply rail-based estimate as per documentation
    if (railType) {
      if (railType.toUpperCase() === 'LOCAL') {
        eta = 'Instant (< 60 seconds)';
      } else if (railType.toUpperCase() === 'SWIFT') {
        eta = '1-2 business days';
      } else if (railType.toUpperCase() === 'CASH_PAYOUT') {
        eta = 'Within 4 hours';
      }
    }
    
    // Check for Visa Fast Funds if relevant
    const hasVisaFastFunds = q.has_visa_fast_funds || payout?.has_visa_fast_funds;
    if (railType && railType.includes('VISA') || railType && railType.includes('CARD')) {
      if (hasVisaFastFunds) {
        eta = 'Instant (Visa Fast Funds)';
      } else {
        eta = 'Within 2 days (Card)';
      }
    }
    
    // Check for service_time in the additional_info
    if (q.additional_info && q.additional_info.service_time) {
      // service_time is usually an ISO date when provided
      console.log(`Service time from API: ${q.additional_info.service_time}`);
      
      // Only override if we actually have a value
      if (q.additional_info.service_time && q.additional_info.service_time !== '') {
        try {
          // Attempt to parse as ISO date
          const serviceDate = new Date(q.additional_info.service_time);
          
          // If valid date, use it as the estimate
          if (!isNaN(serviceDate.getTime())) {
            const now = new Date();
            const diffMs = serviceDate.getTime() - now.getTime();
            const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
            
            if (diffHours <= 1) {
              eta = 'Less than 1 hour';
            } else if (diffHours < 24) {
              eta = `Within ${diffHours} hours`;
            } else {
              const days = Math.ceil(diffHours / 24);
              eta = `Approximately ${days} day${days > 1 ? 's' : ''}`;
            }
          }
        } catch (e) {
          console.log(`Error parsing service_time: ${e.message}`);
          // Keep existing eta if parsing fails
        }
      }
    }

    /* 5️⃣  show results in multiple formats for reliable parsing */
    // Plain text output
    console.log(`InstaReM Quote Result:`);
    console.log(`- Exchange rate: ${exchangeRate}`);
    console.log(`- Total fee: ${totalFee}`);
    console.log(`- Delivery ETA: ${eta}`);
    console.log(`- Amount received: ${receiveAmount}`);
    
    // Table format
    console.table({
      'Exchange rate':     exchangeRate,
      'Total fee':         totalFee,
      'Delivery ETA':      eta,
      'Amount received':   receiveAmount
    });
    
    // JSON format for easier parsing
    console.log("JSON_OUTPUT:", JSON.stringify({
      'Exchange rate': exchangeRate,
      'Total fee':     totalFee,
      'Delivery ETA':  eta,
      'Amount received': receiveAmount,
      'Rail type': railType || 'Unknown'
    }));
    
  } catch (err) {
    console.error('❌', err.message || err);
    process.exit(1);
  }
})();
