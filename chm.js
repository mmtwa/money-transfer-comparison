// Streamlined Money Transfer Scraper (No Screenshots)
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');

/**
 * Configuration object for the scraper
 */
const config = {
  // Base URL to scrape
  baseUrl: 'https://www.compareholidaymoney.com/money-transfers/',
  
  // Output directory for scraped data
  outputDir: path.join(__dirname, 'scraped_data'),
  
  // Cron schedule for automated scraping
  cronSchedule: '0 0 * * *',
  
  // Currency pairs to check with explicit configuration
  currencyPairs: [
    { 
      name: 'UK to Spain',
      fromCountry: 'United Kingdom', 
      toCountry: 'Spain', 
      fromCurrency: 'GBP', 
      toCurrency: 'EUR',
      specificUrl: 'https://www.compareholidaymoney.com/money-transfers/uk-to-spain'
    },
    { 
      name: 'UK to USA',
      fromCountry: 'United Kingdom', 
      toCountry: 'USA', 
      fromCurrency: 'GBP', 
      toCurrency: 'USD',
      specificUrl: 'https://www.compareholidaymoney.com/money-transfers/uk-to-usa'
    },
    { 
      name: 'UK to India',
      fromCountry: 'United Kingdom', 
      toCountry: 'India', 
      fromCurrency: 'GBP', 
      toCurrency: 'INR',
      specificUrl: 'https://www.compareholidaymoney.com/money-transfers/uk-to-india'
    }
  ],
  
  // Amount to transfer
  amount: 1000,
  
  // Payment method (bank transfer, debit card, or credit card)
  paymentMethod: 'bank transfer',
  
  // Use consistent output filename instead of timestamps
  outputFilename: 'providers.json',
  
  // Debug mode
  debug: false,
  
  // Headless mode (set to true for production)
  headless: true,
  
  // Wait timeout in milliseconds
  timeout: 45000,
  
  // User agent to use
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

/**
 * Creates the output directory if it doesn't exist
 */
function ensureOutputDirExists() {
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
    console.log(`Created output directory: ${config.outputDir}`);
  }
}

/**
 * Waits for a specified time
 */
async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Try to scrape using the pre-configured specific URL for this currency pair
 */
async function scrapeDirectUrl(browser, currencyPair) {
  console.log(`\nScraping "${currencyPair.name}" using direct URL: ${currencyPair.specificUrl}`);
  
  const page = await browser.newPage();
  
  // Set a realistic user agent
  await page.setUserAgent(config.userAgent);
  
  // Set viewport for better rendering
  await page.setViewport({ width: 1280, height: 800 });

  try {
    // Navigate directly to the specific URL for this currency pair
    console.log(`Navigating to ${currencyPair.specificUrl}`);
    await page.goto(currencyPair.specificUrl, { 
      waitUntil: 'networkidle2', 
      timeout: config.timeout 
    });
    
    console.log('Page loaded successfully');
    
    // Wait for form to be visible
    await page.waitForSelector('#comparison-form', { 
      visible: true, 
      timeout: config.timeout 
    }).catch(e => {
      console.log('Form not immediately visible, continuing anyway');
    });
    
    // Check if form is already filled in correctly
    const currentValues = await page.evaluate(() => {
      // Get the currently selected values
      const fromCountry = document.querySelector('#currency-from .active-currency')?.textContent.trim();
      const toCountry = document.querySelector('#currency-to .active-currency')?.textContent.trim();
      const amount = document.querySelector('#currency-send-amount')?.value;
      
      // Check payment method
      let paymentMethod = '';
      if (document.querySelector('#rad-bank-transfer')?.checked) {
        paymentMethod = 'bank transfer';
      } else if (document.querySelector('#rad-debit-card')?.checked) {
        paymentMethod = 'debit card';
      } else if (document.querySelector('#rad-credit-card')?.checked) {
        paymentMethod = 'credit card';
      }
      
      return { fromCountry, toCountry, amount, paymentMethod };
    });
    
    console.log('Current form values:', currentValues);
    
    // Fill in amount if needed
    if (currentValues.amount != config.amount) {
      console.log(`Updating amount to: ${config.amount}`);
      await page.evaluate((amount) => {
        // Clear the input field first
        const amountInput = document.querySelector('#currency-send-amount');
        if (amountInput) {
          amountInput.value = '';
          // Trigger input event
          const clearEvent = new Event('input', { bubbles: true });
          amountInput.dispatchEvent(clearEvent);
          
          // Now set the new value
          amountInput.value = amount;
          // Trigger input event again
          const event = new Event('input', { bubbles: true });
          amountInput.dispatchEvent(event);
          return true;
        }
        return false;
      }, config.amount);
    }
    
    // Set payment method if needed
    if (currentValues.paymentMethod !== config.paymentMethod) {
      console.log(`Updating payment method to: ${config.paymentMethod}`);
      await page.evaluate((paymentMethod) => {
        if (paymentMethod === 'bank transfer') {
          document.querySelector('#rad-bank-transfer')?.click();
        } else if (paymentMethod === 'debit card') {
          document.querySelector('#rad-debit-card')?.click();
        } else if (paymentMethod === 'credit card') {
          document.querySelector('#rad-credit-card')?.click();
        }
      }, config.paymentMethod);
    }
    
    // Click the compare button to refresh results with our parameters
    console.log('Clicking compare rates button...');
    const buttonClicked = await page.evaluate(() => {
      const button = document.querySelector('#compare');
      if (button) {
        button.click();
        return true;
      }
      return false;
    });
    
    if (buttonClicked) {
      console.log('Successfully clicked compare button');
    } else {
      console.log('Could not find or click compare button, will try to use existing results');
    }
    
    // Wait for results to load or refresh
    console.log('Waiting for results to load...');
    await page.waitForFunction(() => {
      const resultsContainer = document.querySelector('#results-container');
      const loadingImg = document.querySelector('#results-container img[src*="loading"]');
      
      // Results are ready when the container exists and the loading image is gone
      return resultsContainer && !loadingImg;
    }, { timeout: config.timeout }).catch(e => {
      console.log('Timeout waiting for loading indicator to disappear, continuing anyway');
    });
    
    // Give extra time for content to fully render
    await wait(3000);
    
    // Extract provider data
    console.log('Extracting provider data from results...');
    
    const providerData = await page.evaluate(() => {
      // Now extract the results
      const results = [];
      
      // Look for comparison table first
      const table = document.querySelector('#comparison-results');
      
      if (table) {
        // Get the caption text to extract amount info
        const caption = table.querySelector('caption');
        let captionText = '';
        if (caption) {
          captionText = caption.textContent.trim();
        }
        
        // Process each provider row
        const rows = Array.from(table.querySelectorAll('tr:not(.expand-row):not(.unavailable)'));
        console.log(`Found ${rows.length} provider rows in table`);
        
        rows.forEach((row, index) => {
          try {
            // Skip rows that don't have enough cells
            const cells = row.querySelectorAll('td');
            if (cells.length < 4) return;
            
            // Extract provider name from the image alt text or the cell content
            const providerCell = cells[0];
            let providerName = '';
            const logoImg = providerCell.querySelector('img.logo');
            if (logoImg && logoImg.alt) {
              providerName = logoImg.alt.trim();
            } else {
              providerName = providerCell.textContent.trim();
            }
            
            // Extract recipient amount
            const amountCell = cells[1];
            let recipientAmount = '';
            const boldAmount = amountCell.querySelector('.bold');
            if (boldAmount) {
              recipientAmount = boldAmount.textContent.trim();
            } else {
              recipientAmount = amountCell.textContent.replace('Recipient gets', '').trim();
            }
            
            // Extract exchange rate
            const rateCell = cells[2];
            let exchangeRate = '';
            const boldRate = rateCell.querySelector('.bold');
            if (boldRate) {
              exchangeRate = boldRate.textContent.trim();
            } else {
              exchangeRate = rateCell.textContent.replace('Exchange rate', '').trim();
            }
            
            // Extract fee
            const feeCell = cells[3];
            let fee = '';
            const boldFee = feeCell.querySelector('.bold');
            if (boldFee) {
              fee = boldFee.textContent.trim();
            } else {
              fee = feeCell.textContent.replace('Transfer fee', '').trim();
            }
            
            // Get any link information
            const linkCell = cells[4];
            const link = linkCell?.querySelector('a')?.href || '';
            
            // Only add if we have a provider name
            if (providerName) {
              results.push({
                index,
                providerName,
                recipientAmount,
                exchangeRate,
                fee,
                link
              });
            }
          } catch (err) {
            console.error(`Error parsing provider row ${index}:`, err);
          }
        });
        
        // Also get unavailable providers
        const unavailableRows = table.querySelectorAll('tr.unavailable');
        console.log(`Found ${unavailableRows.length} unavailable provider rows`);
        
        Array.from(unavailableRows).forEach((row, index) => {
          try {
            const cells = row.querySelectorAll('td');
            if (cells.length < 2) return;
            
            // Extract provider name
            const providerCell = cells[0];
            let providerName = '';
            const logoImg = providerCell.querySelector('img.logo');
            if (logoImg && logoImg.alt) {
              providerName = logoImg.alt.trim();
            } else {
              providerName = providerCell.textContent.trim();
            }
            
            // Extract reason for unavailability
            const reasonCell = cells[1];
            const reason = reasonCell.textContent.trim();
            
            // Add to results with unavailable flag
            if (providerName) {
              results.push({
                index: rows.length + index,
                providerName,
                unavailable: true,
                reason
              });
            }
          } catch (err) {
            console.error(`Error parsing unavailable row ${index}:`, err);
          }
        });
        
        return { 
          results, 
          captionText
        };
      }
      
      // If no table found, try to look for other result formats
      const resultContainer = document.querySelector('#results-container');
      if (resultContainer) {
        // Try to get any text content that might help us understand what's in the container
        const containerText = resultContainer.textContent.trim().substring(0, 500);
        
        // Look for provider cards or other elements that might contain provider data
        const providerElements = resultContainer.querySelectorAll('.provider-item, .provider-card, > div');
        console.log(`Found ${providerElements.length} potential provider elements`);
        
        Array.from(providerElements).forEach((element, index) => {
          try {
            // Extract provider name
            let providerName = '';
            const nameEl = element.querySelector('h3, h4, .provider-name, img[alt]');
            if (nameEl) {
              if (nameEl.alt) {
                providerName = nameEl.alt.trim();
              } else {
                providerName = nameEl.textContent.trim();
              }
            }
            
            // Extract other data using generic selectors
            const dataElements = element.querySelectorAll('p, .data, .value');
            let exchangeRate = '';
            let fee = '';
            let recipientAmount = '';
            
            dataElements.forEach(el => {
              const text = el.textContent.toLowerCase();
              if (text.includes('rate') || text.includes('exchange')) {
                exchangeRate = el.textContent.trim();
              } else if (text.includes('fee') || text.includes('cost')) {
                fee = el.textContent.trim();
              } else if (text.includes('gets') || text.includes('amount') || text.includes('recipient')) {
                recipientAmount = el.textContent.trim();
              }
            });
            
            // Get any link information
            const link = element.querySelector('a')?.href || '';
            
            // Add to results if we have a provider name
            if (providerName) {
              results.push({
                index,
                providerName,
                recipientAmount,
                exchangeRate,
                fee,
                link
              });
            }
          } catch (err) {
            console.error(`Error parsing provider element ${index}:`, err);
          }
        });
        
        return { 
          results, 
          captionText: containerText
        };
      }
      
      return { 
        results: [], 
        captionText: 'No results found'
      };
    });
    
    console.log(`Extracted ${providerData.results.length} providers`);
    
    if (providerData.captionText) {
      console.log(`Caption/content: ${providerData.captionText}`);
    }
    
    // Check if we have enough providers and the data looks reasonable
    const validProviders = providerData.results.filter(p => !p.unavailable);
    
    if (validProviders.length === 0) {
      console.log('No valid providers found, this may indicate a problem with the site or the scraper');
    } else {
      // Check the exchange rates to see if they're reasonable
      const hasReasonableRates = validProviders.some(p => {
        if (!p.exchangeRate) return false;
        
        // Try to extract just the numeric value from the exchange rate
        const rateMatch = p.exchangeRate.match(/(\d+\.\d+)/);
        if (!rateMatch) return false;
        
        const rate = parseFloat(rateMatch[1]);
        
        // For GBP to EUR, we expect rates around 1.16-1.17
        // For GBP to USD, we expect rates around 1.2-1.3
        // For GBP to INR, we expect rates around 100-110
        
        if (currencyPair.toCurrency === 'EUR' && rate >= 1.1 && rate <= 1.2) return true;
        if (currencyPair.toCurrency === 'USD' && rate >= 1.2 && rate <= 1.3) return true;
        if (currencyPair.toCurrency === 'INR' && rate >= 100 && rate <= 110) return true;
        
        return false;
      });
      
      if (!hasReasonableRates) {
        console.log(`Warning: Exchange rates don't appear to be in the expected range for ${currencyPair.fromCurrency} to ${currencyPair.toCurrency}`);
      } else {
        console.log(`Exchange rates look reasonable for ${currencyPair.fromCurrency} to ${currencyPair.toCurrency}`);
      }
    }
    
    // Add metadata to the results
    const enrichedData = providerData.results.map(provider => {
      // Base object with common fields and correct currency information
      const baseObj = {
        providerName: provider.providerName,
        fromCountry: currencyPair.fromCountry,
        toCountry: currencyPair.toCountry,
        sourceCurrency: currencyPair.fromCurrency,
        targetCurrency: currencyPair.toCurrency,
        amount: config.amount,
        paymentMethod: config.paymentMethod,
        scrapedAt: new Date().toISOString()
      };
      
      // Add provider-specific data
      if (provider.unavailable) {
        return {
          ...baseObj,
          unavailable: true,
          reason: provider.reason || 'Unknown reason'
        };
      } else {
        return {
          ...baseObj,
          recipientAmount: provider.recipientAmount || 'N/A',
          exchangeRate: provider.exchangeRate || 'N/A',
          fee: provider.fee || 'N/A',
          link: provider.link || ''
        };
      }
    });
    
    return enrichedData;
    
  } catch (error) {
    console.error(`Error scraping direct URL for ${currencyPair.fromCurrency} → ${currencyPair.toCurrency}:`, error);
    
    return [{
      error: true,
      message: error.message,
      fromCountry: currencyPair.fromCountry,
      toCountry: currencyPair.toCountry,
      sourceCurrency: currencyPair.fromCurrency,
      targetCurrency: currencyPair.toCurrency,
      amount: config.amount,
      paymentMethod: config.paymentMethod,
      scrapedAt: new Date().toISOString()
    }];
  } finally {
    await page.close();
  }
}

/**
 * Main function to scrape provider data for all currency pairs
 */
async function scrapeProviderData() {
  console.log('\n=========================================');
  console.log('STARTING SCRAPER RUN');
  console.log('=========================================');
  console.log(`Time: ${new Date().toLocaleString()}`);
  
  let browser;
  
  try {
    ensureOutputDirExists();
    
    console.log('Launching browser...');
    browser = await puppeteer.launch({
      headless: config.headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1280,800']
    });
    
    const results = {};
    let totalProviders = 0;
    let successfulPairs = 0;
    
    // Try direct URL scraping for each currency pair
    for (const currencyPair of config.currencyPairs) {
      if (currencyPair.specificUrl) {
        const pairKey = `${currencyPair.fromCountry}_to_${currencyPair.toCountry}`;
        results[pairKey] = await scrapeDirectUrl(browser, currencyPair);
        
        // Count providers that aren't error entries
        const validProviders = results[pairKey].filter(p => !p.error);
        totalProviders += validProviders.length;
        
        if (validProviders.length > 0) {
          successfulPairs++;
        }
      }
    }
    
    // Save the aggregated results with a consistent filename
    const filePath = path.join(config.outputDir, config.outputFilename);
    
    fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
    console.log(`\n✅ SUCCESS: Scraped ${totalProviders} providers across ${successfulPairs} currency pairs.`);
    console.log(`Data saved to ${filePath}`);
    
    return results;
    
  } catch (error) {
    console.error('❌ SCRAPING FAILED:');
    console.error(error);
    throw error;
  } finally {
    if (browser) {
      console.log('Closing browser...');
      await browser.close();
    }
    console.log('=========================================');
    console.log('SCRAPER RUN COMPLETED');
    console.log('=========================================\n');
  }
}

/**
 * Sets up a cron job to run the scraper on a schedule
 */
function setupCronJob() {
  console.log(`Setting up cron job with schedule: ${config.cronSchedule}`);
  cron.schedule(config.cronSchedule, async () => {
    try {
      await scrapeProviderData();
      console.log('Scheduled scraping completed successfully');
    } catch (error) {
      console.error('Scheduled scraping failed:', error);
    }
  });
  console.log('Cron job set up successfully');
}

/**
 * Function to run the scraper on demand
 */
async function runScraper() {
  return await scrapeProviderData();
}

// Export functions for use in other modules
module.exports = {
  runScraper,
  setupCronJob,
  config
};

// Immediately invoked function to run scraper if script is executed directly
(async () => {
  if (require.main === module) {
    console.log('Script running in standalone mode');
    try {
      console.log('Starting on-demand scraping...');
      const results = await runScraper();
      
      // Count total providers
      let totalProviders = 0;
      Object.values(results).forEach(providers => {
        totalProviders += providers.filter(p => !p.error).length;
      });
      
      console.log(`Successfully scraped ${totalProviders} providers`);
      
      console.log('Setting up scheduled scraping...');
      setupCronJob();
    } catch (error) {
      console.error('❌ Error in main execution:', error);
      process.exit(1);
    }
  } else {
    console.log('Script loaded as a module');
  }
})();