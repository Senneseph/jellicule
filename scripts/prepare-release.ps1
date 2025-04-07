# PowerShell script to prepare for a 1.0.0 release

param (
    [switch]$Execute = $false
)

# Create scripts directory if it doesn't exist
if (-not (Test-Path "scripts")) {
    New-Item -ItemType Directory -Path "scripts" | Out-Null
}

# Function to run a step
function Run-Step {
    param (
        [string]$StepName,
        [scriptblock]$ScriptBlock
    )
    
    Write-Host "`n=== $StepName ===" -ForegroundColor Magenta
    & $ScriptBlock
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Step failed: $StepName" -ForegroundColor Red
        exit 1
    }
}

# Check if we're in the root of the repository
if (-not (Test-Path ".git")) {
    Write-Host "Error: This script must be run from the root of the git repository." -ForegroundColor Red
    exit 1
}

# Display warning and confirmation
Write-Host "This script will prepare the repository for a 1.0.0 release by:" -ForegroundColor Yellow
Write-Host "1. Checking and pinning all dependencies" -ForegroundColor Yellow
Write-Host "2. Creating a comprehensive CHANGELOG.md from all commit messages" -ForegroundColor Yellow
Write-Host "3. Squashing all commits into a single 'Initial release 1.0.0' commit" -ForegroundColor Yellow
Write-Host "4. Setting up version 1.0.0 and creating a git tag" -ForegroundColor Yellow

if (-not $Execute) {
    Write-Host "`nThis is a dry run. To execute the release preparation, run with -Execute parameter." -ForegroundColor Yellow
    $confirmation = "n"
} else {
    Write-Host "`nWARNING: This will modify files and rewrite git history." -ForegroundColor Red
    Write-Host "This operation cannot be undone." -ForegroundColor Red
    $confirmation = Read-Host "Are you sure you want to proceed? (y/n)"
}

if ($confirmation -ne "y") {
    Write-Host "Operation cancelled." -ForegroundColor Yellow
    exit
}

# Step 1: Check and pin dependencies
Run-Step -StepName "Checking and pinning dependencies" -ScriptBlock {
    if ($Execute) {
        & .\scripts\pin-dependencies.ps1 -Fix
    } else {
        & .\scripts\pin-dependencies.ps1
    }
}

# Step 2: Create VERSION file if it doesn't exist
Run-Step -StepName "Creating VERSION file" -ScriptBlock {
    if (-not (Test-Path "VERSION")) {
        if ($Execute) {
            "1.0.0" | Out-File -FilePath "VERSION" -NoNewline
            Write-Host "Created VERSION file with version 1.0.0" -ForegroundColor Green
        } else {
            Write-Host "Would create VERSION file with version 1.0.0" -ForegroundColor Cyan
        }
    } else {
        if ($Execute) {
            "1.0.0" | Out-File -FilePath "VERSION" -NoNewline
            Write-Host "Updated VERSION file to version 1.0.0" -ForegroundColor Green
        } else {
            Write-Host "Would update VERSION file to version 1.0.0" -ForegroundColor Cyan
        }
    }
}

# Step 3: Prepare CHANGELOG.md
Run-Step -StepName "Preparing CHANGELOG.md" -ScriptBlock {
    if ($Execute) {
        & .\scripts\prepare-changelog.ps1
    } else {
        Write-Host "Would prepare CHANGELOG.md from commit history" -ForegroundColor Cyan
    }
}

# Step 4: Squash commits
Run-Step -StepName "Squashing commits" -ScriptBlock {
    if ($Execute) {
        & .\scripts\squash-commits.ps1 -Execute
    } else {
        & .\scripts\squash-commits.ps1
    }
}

# Step 5: Create git tag
Run-Step -StepName "Creating git tag" -ScriptBlock {
    if ($Execute) {
        git tag -a "v1.0.0" -m "Version 1.0.0"
        Write-Host "Created git tag v1.0.0" -ForegroundColor Green
    } else {
        Write-Host "Would create git tag v1.0.0" -ForegroundColor Cyan
    }
}

# Final instructions
Write-Host "`n=== Release Preparation Complete ===" -ForegroundColor Green

if ($Execute) {
    Write-Host "The repository has been prepared for a 1.0.0 release." -ForegroundColor Green
    Write-Host "To push the tag, run:" -ForegroundColor Yellow
    Write-Host "git push --tags" -ForegroundColor Cyan
    
    Write-Host "`nFor future version updates, use the auto-version script:" -ForegroundColor Yellow
    Write-Host ".\scripts\auto-version.ps1 -VersionType major|minor|patch" -ForegroundColor Cyan
} else {
    Write-Host "This was a dry run. To execute the release preparation, run:" -ForegroundColor Yellow
    Write-Host ".\scripts\prepare-release.ps1 -Execute" -ForegroundColor Cyan
}
