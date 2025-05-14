# PowerShell script to start the InstaReM API service
Write-Host "Starting Money Transfer Comparison service with InstaReM API..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node -v
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan
} catch {
    Write-Host "Error: Node.js is not installed or not in PATH. Please install Node.js." -ForegroundColor Red
    exit 1
}

# Start the server
Write-Host "Starting server..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C to stop the server." -ForegroundColor Yellow

try {
    node server.js
} catch {
    Write-Host "Error starting server: $_" -ForegroundColor Red
    exit 1
} 