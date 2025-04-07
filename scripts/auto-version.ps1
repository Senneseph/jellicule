# PowerShell script for auto-versioning

param (
    [string]$VersionType = "patch", # Options: major, minor, patch
    [switch]$DryRun = $false
)

# Function to parse semantic version
function Parse-SemVer {
    param (
        [string]$Version
    )
    
    if ($Version -match '(\d+)\.(\d+)\.(\d+)') {
        return @{
            Major = [int]$matches[1]
            Minor = [int]$matches[2]
            Patch = [int]$matches[3]
        }
    }
    
    # Default to 1.0.0 if no version found
    return @{
        Major = 1
        Minor = 0
        Patch = 0
    }
}

# Function to increment version
function Increment-Version {
    param (
        [hashtable]$Version,
        [string]$Type
    )
    
    switch ($Type) {
        "major" {
            $Version.Major++
            $Version.Minor = 0
            $Version.Patch = 0
        }
        "minor" {
            $Version.Minor++
            $Version.Patch = 0
        }
        "patch" {
            $Version.Patch++
        }
    }
    
    return "$($Version.Major).$($Version.Minor).$($Version.Patch)"
}

# Function to update version in a file
function Update-VersionInFile {
    param (
        [string]$FilePath,
        [string]$NewVersion,
        [string]$Pattern,
        [string]$Replacement,
        [switch]$DryRun
    )
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "File not found: $FilePath" -ForegroundColor Yellow
        return
    }
    
    $content = Get-Content $FilePath -Raw
    $newContent = $content -replace $Pattern, $Replacement
    
    if ($content -ne $newContent) {
        if (-not $DryRun) {
            $newContent | Set-Content $FilePath -NoNewline
            Write-Host "Updated version in $FilePath to $NewVersion" -ForegroundColor Green
        } else {
            Write-Host "Would update version in $FilePath to $NewVersion" -ForegroundColor Cyan
        }
    } else {
        Write-Host "No version pattern found in $FilePath" -ForegroundColor Yellow
    }
}

# Get current version from package.json if it exists
$currentVersion = "1.0.0"
if (Test-Path "package.json") {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    if ($packageJson.version) {
        $currentVersion = $packageJson.version
    }
} elseif (Test-Path "VERSION") {
    $currentVersion = Get-Content "VERSION" -Raw
} elseif (Test-Path "components/version.txt") {
    $currentVersion = Get-Content "components/version.txt" -Raw
}

$currentVersion = $currentVersion.Trim()
$parsedVersion = Parse-SemVer -Version $currentVersion
$newVersion = Increment-Version -Version $parsedVersion -Type $VersionType

Write-Host "Current version: $currentVersion" -ForegroundColor Blue
Write-Host "New version: $newVersion" -ForegroundColor Green

if ($DryRun) {
    Write-Host "Dry run mode - no files will be modified" -ForegroundColor Yellow
}

# Update version in various files
$filesToUpdate = @(
    @{
        Path = "package.json"
        Pattern = '"version"\s*:\s*"[^"]*"'
        Replacement = '"version": "' + $newVersion + '"'
    },
    @{
        Path = "VERSION"
        Pattern = '.*'
        Replacement = $newVersion
    },
    @{
        Path = "components/version.txt"
        Pattern = '.*'
        Replacement = $newVersion
    },
    @{
        Path = "docker-compose.yaml"
        Pattern = 'version:\s*[''"]?[^''"\n]*[''"]?'
        Replacement = 'version: "' + $newVersion + '"'
    },
    @{
        Path = "Dockerfile"
        Pattern = 'LABEL\s+version="[^"]*"'
        Replacement = 'LABEL version="' + $newVersion + '"'
    },
    @{
        Path = "CHANGELOG.md"
        Pattern = '## \[Unreleased\]'
        Replacement = '## [Unreleased]' + "`n`n## [$newVersion] - " + (Get-Date -Format "yyyy-MM-dd")
    }
)

foreach ($file in $filesToUpdate) {
    Update-VersionInFile -FilePath $file.Path -NewVersion $newVersion -Pattern $file.Pattern -Replacement $file.Replacement -DryRun:$DryRun
}

# Create or update VERSION file if it doesn't exist
if (-not (Test-Path "VERSION") -and -not $DryRun) {
    $newVersion | Out-File -FilePath "VERSION" -NoNewline
    Write-Host "Created VERSION file with version $newVersion" -ForegroundColor Green
}

# Update git tag if not in dry run mode
if (-not $DryRun) {
    # Write version to VERSION file
    $newVersion | Out-File -FilePath "VERSION" -NoNewline
    
    # Git commands
    Write-Host "Committing version change..." -ForegroundColor Blue
    git add .
    git commit -m "chore: bump version to $newVersion"
    
    Write-Host "Creating git tag v$newVersion..." -ForegroundColor Blue
    git tag -a "v$newVersion" -m "Version $newVersion"
    
    Write-Host "To push changes and tags, run:" -ForegroundColor Yellow
    Write-Host "git push && git push --tags" -ForegroundColor Yellow
} else {
    Write-Host "Would create git commit and tag v$newVersion" -ForegroundColor Cyan
}

Write-Host "Version update complete!" -ForegroundColor Green
