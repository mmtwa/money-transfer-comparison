const fs = require('fs');
const path = require('path');
const https = require('https');

const flagsDir = path.join(__dirname, 'client', 'public', 'flags');

if (!fs.existsSync(flagsDir)) {
  fs.mkdirSync(flagsDir, { recursive: true });
  console.log('Created flags directory:', flagsDir);
}

const currencyCodes = [
  'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'HKD', 'NZD', 
  'SEK', 'SGD', 'NOK', 'MXN', 'INR', 'BRL', 'RUB', 'ZAR', 'TRY', 'DKK',
  'PLN', 'THB', 'IDR', 'HUF', 'CZK', 'ILS', 'CLP', 'PHP', 'AED', 'COP',
  'SAR', 'MYR', 'RON', 'BGN', 'KRW', 'EGP', 'ARS', 'QAR', 'KWD', 'NGN'
];

function downloadFlag(code) {
  const url = `https://wise.com/web-art/assets/flags/${code.toLowerCase()}.svg`;
  const filePath = path.join(flagsDir, `${code.toLowerCase()}.svg`);
  
  https.get(url, (response) => {
    if (response.statusCode === 200) {
      const file = fs.createWriteStream(filePath);
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${code.toLowerCase()}.svg`);
      });
    } else {
      console.log(`Failed to download ${code}: ${response.statusCode}`);
    }
  }).on('error', (err) => {
    console.error(`Error downloading ${code}: ${err.message}`);
  });
}

for (const code of currencyCodes) {
  downloadFlag(code);
}

console.log('Started downloading flags. This may take a moment...');