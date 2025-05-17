# Fix syntax errors in JSX components
# This script addresses two types of issues:
# 1. Fix JSX syntax errors with extra opening bracket
# 2. Fix variable names with kebab-case

# File list with JSX syntax errors (extra opening bracket before SEO component)
$jsxErrorFiles = @(
    "src/pages/guides/criteria/CostOptimizing.js",
    "src/pages/guides/criteria/Security.js",
    "src/pages/guides/criteria/Service.js",
    "src/pages/guides/frequency/OccasionalTransfers.js",
    "src/pages/guides/frequency/OneTimeTransfers.js",
    "src/pages/guides/frequency/PeriodicTransfers.js",
    "src/pages/guides/frequency/RegularTransfers.js",
    "src/pages/guides/method/DigitalNative.js",
    "src/pages/guides/send-money-to-philippines.js",
    "src/pages/guides/send-money-to-poland.js"
)

# File list with variable name errors (kebab-case instead of camelCase)
$variableNameErrorFiles = @(
    "src/pages/guides/send-money-to-canada.js",
    "src/pages/guides/send-money-to-china.js",
    "src/pages/guides/send-money-to-mexico.js",
    "src/pages/guides/send-money-to-morocco.js",
    "src/pages/guides/send-money-to-nigeria.js",
    "src/pages/guides/send-money-to-pakistan.js",
    "src/pages/guides/send-money-to-romania.js",
    "src/pages/guides/send-money-to-vietnam.js"
)

# Fix JSX syntax errors
foreach ($file in $jsxErrorFiles) {
    Write-Host "Fixing JSX syntax in $file..."
    $content = Get-Content -Path $file -Raw
    
    # Replace incorrect JSX structure with correct one
    $fixedContent = $content -replace '<\s*<SEO', '  <>
      <SEO' -replace '/>GuideDetail', '/>
      <GuideDetail' -replace '</GuideDetail>', '</GuideDetail>
    </>'
    
    # Save the fixed content
    Set-Content -Path $file -Value $fixedContent
    Write-Host "Fixed JSX syntax in $file"
}

# Fix variable name errors
foreach ($file in $variableNameErrorFiles) {
    Write-Host "Fixing variable name in $file..."
    $content = Get-Content -Path $file -Raw
    
    # Extract the base filename without extension
    $basename = [System.IO.Path]::GetFileNameWithoutExtension($file)
    
    # Convert kebab-case to CamelCase for component name
    $componentName = ($basename -split '-' | ForEach-Object { (Get-Culture).TextInfo.ToTitleCase($_) }) -join ''
    
    # Replace incorrect variable declaration with correct one
    $fixedContent = $content -replace "const $basename = \(\)", "const $componentName = ()" -replace "export default $basename;", "export default $componentName;"
    
    # Save the fixed content
    Set-Content -Path $file -Value $fixedContent
    Write-Host "Fixed variable name in $file"
}

Write-Host "All syntax errors fixed successfully!" 