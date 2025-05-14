/*  remitly-calculator.js
    ────────────────────────────────────────────────────────────
    Simple quote grabber for any Remitly corridor using their
    public calculator API (v3).
    Requires **Node 18+** (built‑in fetch).  No external deps.

    USAGE  (square = optional) ────────────────────────────────
      node remitly-calculator.js \
           <amount> <sourceCurrency> <destCurrency> \
           [sourceCountry] [destCountry]

      amount          – Number you want to **send** (anchor=SEND).
      sourceCurrency  – Three‑letter ISO‑4217 (GBP, USD …).
      destCurrency    – Three‑letter ISO‑4217 (EUR, INR …).
      sourceCountry   – ISO‑3166‑3 code of the sender country; if omitted
                        we try to guess from the currency (GBP→GBR, USD→USA …).
      destCountry     – ISO‑3166‑3 of the receiver country; if omitted we
                        try a best‑effort guess (EUR→FRA, INR→IND …).

    EXAMPLES ─────────────────────────────────────────────────
      node remitly-calculator.js 100  GBP EUR            # GB→FR
      node remitly-calculator.js 750  USD MXN USA MEX    # explicit countries
      node remitly-calculator.js 5000 AUD INR            # AU→IN

    OUTPUT  ────────────────────────────────────────────────
      • Plain‑text lines for humans
      • console.table for quick inspection
      • "JSON_OUTPUT: …" single‑line JSON for downstream parsing
*/

console.log(`Remitly Calculator starting with arguments: ${process.argv.slice(2).join(', ')}`);

/* ─ helpers ─────────────────────────────────────────────── */
const qs = o => new URLSearchParams(o).toString();
const asJSON = r => r.json();

const isoGuess3 = cur => ({
  AUD: 'AUS', CAD: 'CAN', EUR: 'FRA',
  GBP: 'GBR', INR: 'IND', MXN: 'MEX',
  NZD: 'NZL', SGD: 'SGP', USD: 'USA'
}[cur.toUpperCase()] || 'GBR');      // safe fallback

/* ─ args ─────────────────────────────────────────────────── */
const [
  ,,
  amtArg, srcCurArg, dstCurArg,
  srcCtryArg, dstCtryArg
] = process.argv;

if (!amtArg || !srcCurArg || !dstCurArg) {
  console.error('Usage: node remitly-calculator.js <amount> <sourceCur> <destCur> [sourceCountry] [destCountry]');
  process.exit(1);
}

const amount        = Number(amtArg);
const sourceCur     = srcCurArg.toUpperCase();
const destCur       = dstCurArg.toUpperCase();
const sourceCountry = (srcCtryArg || isoGuess3(sourceCur)).toUpperCase();
const destCountry   = (dstCtryArg || isoGuess3(destCur)).toUpperCase();

/* ─ main ─────────────────────────────────────────────────── */
(async () => {
  try {
    console.log(`Fetching quote for ${amount} ${sourceCur} (from ${sourceCountry}) → ${destCur} (to ${destCountry})`);

    /* 1️⃣  Build Remitly /calculator/estimate query */
    const conduit = `${sourceCountry}:${sourceCur}-${destCountry}:${destCur}`; // eg. GBR:GBP-FRA:EUR

    const params = {
      conduit,                 // required path of corridor
      anchor: 'SEND',          // we quote on send amount
      amount,                  // amount to send
      purpose: 'OTHER',        // default purpose
      customer_segment: 'UNRECOGNIZED',
      strict_promo: 'false'
    };

    const url = `https://api.remitly.io/v3/calculator/estimate?${qs(params)}`;
    console.log(`GET ${url}`);

    const headers = {
      'accept': 'application/json',
      'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
      'origin': 'https://www.remitly.com',
      'referer': 'https://www.remitly.com/'
    };

    /* 2️⃣  Fetch */
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching estimate`);

    const body = await asJSON(res);
    const est  = body.estimate;
    if (!est) throw new Error('Malformed response (no estimate field)');

    /* 3️⃣  Extract fields */
    const xRate        = est.exchange_rate?.promotional_exchange_rate
                       || est.exchange_rate?.base_rate
                       || 'n/a';
    const totalFee     = est.fee?.total_fee_amount ?? '0.00';
    const receiveAmt   = est.receive_amount ?? '0.00';
    const chargeAmt    = est.total_charge_amount ?? amount;
    const fxMargin     = (xRate && est.exchange_rate?.base_rate) ?
                         ( (xRate - est.exchange_rate.base_rate).toFixed(6) ) :
                         'n/a';

    /* 4️⃣  Output */
    console.log(`Remitly Quote Result:`);
    console.log(`- Exchange rate:       ${xRate}`);
    console.log(`- Total fee:           ${totalFee}`);
    console.log(`- Amount charged:      ${chargeAmt}`);
    console.log(`- Amount received:     ${receiveAmt}`);
    if (fxMargin !== 'n/a') console.log(`- Promo vs base delta: ${fxMargin}`);

    // Table view
    console.table({
      'Exchange rate':   xRate,
      'Total fee':       totalFee,
      'Amount charged':  chargeAmt,
      'Amount received': receiveAmt,
      ...(fxMargin !== 'n/a' ? { 'Promo‑Base Δ': fxMargin } : {})
    });

    // Machine‑readable JSON on one line
    console.log('JSON_OUTPUT:', JSON.stringify({
      exchange_rate:   xRate,
      total_fee:       totalFee,
      amount_charged:  chargeAmt,
      amount_received: receiveAmt,
      promo_base_delta: fxMargin
    }));

  } catch (err) {
    console.error('❌', err.message || err);
    process.exit(1);
  }
})(); 