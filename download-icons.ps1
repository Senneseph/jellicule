# PowerShell script to download jcule PWA icons

# Create the icons directory if it doesn't exist
$iconsDir = "pwa-service/icons"
if (-not (Test-Path $iconsDir)) {
    New-Item -ItemType Directory -Path $iconsDir | Out-Null
    Write-Host "Created directory: $iconsDir"
}

# Define icon sizes
$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

# Base URL for the icon service (using a placeholder icon from placehold.co)
$baseColor = "2196F3"
$textColor = "FFFFFF"

# Download favicon.ico
$faviconUrl = "https://placehold.co/32x32/$baseColor/$textColor.png?text=j"
$faviconPath = "$iconsDir/favicon.ico"
Write-Host "Downloading favicon.ico..."
Invoke-WebRequest -Uri $faviconUrl -OutFile $faviconPath
Write-Host "Downloaded: $faviconPath"

# Download icons for each size
foreach ($size in $sizes) {
    $iconUrl = "https://placehold.co/${size}x${size}/$baseColor/$textColor.png?text=jcule"
    $iconPath = "$iconsDir/icon-${size}x${size}.png"

    Write-Host "Downloading icon-${size}x${size}.png..."
    Invoke-WebRequest -Uri $iconUrl -OutFile $iconPath
    Write-Host "Downloaded: $iconPath"
}

Write-Host "All icons downloaded successfully!"
Write-Host "You can now open your PWA in the browser and it should be installable."
