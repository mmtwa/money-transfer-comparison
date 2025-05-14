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
    const eta           = payout?.estimated_transfer_time || 'n/a';

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
      'Amount received': receiveAmount
    }));
    
  } catch (err) {
    console.error('❌', err.message || err);
    process.exit(1);
  }
})();
