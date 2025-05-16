# PowerShell script to run the Revolut calculator

# Default arguments
$amount = 1000
$fromCurrency = "GBP"
$toCurrency = "EUR"
$sourceCountry = ""
$destCountry = ""

# Check if arguments were provided
if ($args.Count -ge 3) {
    $amount = $args[0]
    $fromCurrency = $args[1]
    $toCurrency = $args[2]
    
    if ($args.Count -ge 4) {
        $sourceCountry = $args[3]
    }
    
    if ($args.Count -ge 5) {
        $destCountry = $args[4]
    }
}

# Build the command arguments
$scriptPath = Join-Path -Path $PSScriptRoot -ChildPath "scripts\scrapers\revolut\revolut-calculator.js"
$cmdArgs = @($scriptPath, $amount, $fromCurrency, $toCurrency)

if ($sourceCountry -ne "") {
    $cmdArgs += $sourceCountry
    
    if ($destCountry -ne "") {
        $cmdArgs += $destCountry
    }
}

# Run the Node.js script
Write-Host "Running Revolut calculator with arguments: $amount $fromCurrency $toCurrency $sourceCountry $destCountry"
node $cmdArgs 