# D'NINJA — Image Sync Helper
# Scans images/ subfolders and generates catalog-data.js
# Just save images to the right folder and run Sync-Images.bat!

$ErrorActionPreference = 'Stop'

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
    # e.g. "wedding_card_design" → "Wedding Card Design"
    $spacedName  = $baseName -replace '[-_]', ' '
    $displayName = (Get-Culture).TextInfo.ToTitleCase($spacedName.ToLower())

    if (-not $data.ContainsKey($folder)) {
        $data[$folder] = @()
    }

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
Write-Host ''
Write-Host '  ─────────────────────────────────────' -ForegroundColor DarkGray

foreach ($key in ($data.Keys | Sort-Object)) {
    $count = $data[$key].Count
    Write-Host ('  ✓ {0,-20} {1} images' -f $key, $count) -ForegroundColor Green
}

Write-Host '  ─────────────────────────────────────' -ForegroundColor DarkGray
Write-Host ('  TOTAL: {0} images synced' -f $total) -ForegroundColor Cyan
Write-Host ''
Write-Host '  ✅ Sync Complete! Website updated.' -ForegroundColor Green
Write-Host ''
