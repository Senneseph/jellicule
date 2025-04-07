# PowerShell script to generate PNG icons from SVG for jcule PWA

# Check if Inkscape is installed
$inkscapePath = "C:\Program Files\Inkscape\bin\inkscape.exe"
if (-not (Test-Path $inkscapePath)) {
    Write-Host "Inkscape not found at $inkscapePath. Please install Inkscape or update the path." -ForegroundColor Red
    exit 1
}

# Create the icons directory if it doesn't exist
$iconsDir = "pwa-service/icons"
if (-not (Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir | Out-Null
    Write-Host "Created directory: $iconsDir" -ForegroundColor Green
}

# Define icon sizes
$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

# Source SVG file
$svgFile = "$iconsDir/jcule-icon.svg"
if (-not (Test-Path $svgFile)) {
    Write-Host "SVG file not found at $svgFile" -ForegroundColor Red
    exit 1
}

# Generate favicon.ico (32x32)
Write-Host "Generating favicon.ico..." -ForegroundColor Cyan
& $inkscapePath --export-filename="$iconsDir/favicon.ico" --export-width=32 --export-height=32 $svgFile
if ($LASTEXITCODE -eq 0) {
    Write-Host "Generated: $iconsDir/favicon.ico" -ForegroundColor Green
} else {
    Write-Host "Failed to generate favicon.ico" -ForegroundColor Red
}

# Generate PNG icons for each size
foreach ($size in $sizes) {
    $iconPath = "$iconsDir/icon-${size}x${size}.png"
    
    Write-Host "Generating icon-${size}x${size}.png..." -ForegroundColor Cyan
    & $inkscapePath --export-filename=$iconPath --export-width=$size --export-height=$size $svgFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Generated: $iconPath" -ForegroundColor Green
    } else {
        Write-Host "Failed to generate $iconPath" -ForegroundColor Red
    }
}

Write-Host "All icons generated successfully!" -ForegroundColor Green
Write-Host "You can now open your PWA in the browser and it should be installable." -ForegroundColor Cyan
