# PowerShell script to populate Trustpilot ratings cache for all providers
$providers = @(
    "torfx",
    "wise",
    "westernunion",
    "moneygram",
    "worldremit",
    "remitly",
    "xe",
    "currencyfair",
    "transferwise",
    "paypal",
    "skrill",
    "revolut",
    "monzo",
    "starling",
    "hsbc",
    "barclays",
    "lloyds",
    "halifax",
    "natwest",
    "rbs",
    "santander",
    "nationwide",
    "ofx",
    "profee",
    "chase",
    "firstdirect",
    "metrobank",
    "virginmoney",
    "tsb",
    "coopbank",
    "yorkshirebank",
    "clydesdalebank",
    "bankofscotland",
    "ulsterbank",
    "bankofireland",
    "aib",
    "permanenttsb",
    "kbc",
    "boi",
    "ptsb",
    "ulster",
    "metrobank",
    "firstdirect",
    "chase"
)

Write-Host "Starting to populate Trustpilot ratings cache..."
Write-Host "This will take a few minutes as we need to respect rate limits..."

# First, test the server connection
try {
    $testResponse = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method Get -ErrorAction Stop
    Write-Host "Server is running and responding" -ForegroundColor Green
} catch {
    Write-Host "Error: Server is not running or not responding. Please start the server first." -ForegroundColor Red
    Write-Host "Run 'npm start' in your project directory"
    exit 1
}

foreach ($provider in $providers) {
    Write-Host "`nUpdating rating for ${provider}..."
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/trustpilot-ratings/update/${provider}" -Method Post -ErrorAction Stop
        if ($response.success) {
            Write-Host "Successfully cached rating for ${provider}: $(${response}.data.value)" -ForegroundColor Green
        } else {
            Write-Host "Failed to cache rating for ${provider}: $(${response}.message)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Error updating ${provider}: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Add a small delay between requests to avoid overwhelming the server
    Write-Host "Waiting 2 seconds before next request..."
    Start-Sleep -Seconds 2
}

Write-Host "`nCache population complete!"
Write-Host "Testing a GET request to verify cache is working..."

try {
    $testGet = Invoke-RestMethod -Uri "http://localhost:3000/api/trustpilot-ratings/torfx" -Method Get -ErrorAction Stop
    Write-Host "GET request successful! Cache is working." -ForegroundColor Green
    Write-Host "Cached rating for torfx: $(${testGet}.data.value)" -ForegroundColor Green
} catch {
    Write-Host "Error testing GET request: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please check if the server is running and MongoDB is connected"
} 