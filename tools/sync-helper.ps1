# D'NINJA — Image Sync Helper
# Scans images/ subfolders and generates catalog-data.js
# Just save images to the right folder and run Sync-Images.bat!

$ErrorActionPreference = 'Stop'

# Set console to handle UTF8 symbols
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$toolsDir  = Split-Path -Parent $MyInvocation.MyCommand.Path
$rootDir   = Split-Path -Parent $toolsDir
$imagesDir = Join-Path $rootDir 'images'
$outFile   = Join-Path $rootDir 'assets\js\catalog-data.js'

if (-not (Test-Path $imagesDir)) {
    Write-Host '  ERROR: images/ folder not found!' -ForegroundColor Red
    Pause
    exit 1
}

# Scan for image files
$files = Get-ChildItem -Path $imagesDir -File -Recurse -Include *.jpg,*.jpeg,*.png,*.gif,*.webp | Sort-Object FullName

$data  = @{}
$total = 0

foreach ($f in $files) {
    # Skip cover images and guide files
    if ($f.Name -match '-cover\.(png|jpg|jpeg|webp)$' -or $f.Name -match 'guide') {
        continue
    }

    $folder      = $f.Directory.Name
    $baseName    = $f.BaseName

    # Convert filename to Title Case display name
    # e.g. "my-cool-logo" → "My Cool Logo"
    $spacedName  = $baseName -replace '[-_]', ' '
    $displayName = (Get-Culture).TextInfo.ToTitleCase($spacedName.ToLower())

    if (-not $data.ContainsKey($folder)) {
        $data[$folder] = @()
    }

    # Relative path from root
    $relPath = 'images/' + $folder + '/' + $f.Name
    $obj = [ordered]@{
        src  = $relPath
        name = $displayName
    }
    $data[$folder] += $obj
    $total++
}

# Generate JSON output
if ($data.Count -eq 0) {
    $json = '{}'
} else {
    $json = $data | ConvertTo-Json -Depth 5 -Compress
}

$jsContent = 'window.CATALOG_DATA = ' + $json + ';'
Set-Content -Path $outFile -Value $jsContent -Encoding UTF8

# Print summary
Write-Host "`n  -------------------------------------" -ForegroundColor Gray
Write-Host "  D'NINJA CATALOG SYNC" -ForegroundColor Cyan
Write-Host "  -------------------------------------" -ForegroundColor Gray

foreach ($key in ($data.Keys | Sort-Object)) {
    $count = $data[$key].Count
    Write-Host "  [+] $($key.PadRight(18)) : $count images" -ForegroundColor Green
}

Write-Host "  -------------------------------------" -ForegroundColor Gray
Write-Host "  TOTAL SYNCED: $total images" -ForegroundColor White
Write-Host "  OUTPUT: assets/js/catalog-data.js" -ForegroundColor DarkGray
Write-Host "`n  SUCCESS: Your website is now up to date!" -ForegroundColor Green
Write-Host ""
