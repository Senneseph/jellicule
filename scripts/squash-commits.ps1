# PowerShell script to squash all commits

param (
    [switch]$Execute = $false
)

# Get the first commit hash
$firstCommit = git rev-list --max-parents=0 HEAD

# Get the current branch
$currentBranch = git rev-parse --abbrev-ref HEAD

# Prepare the changelog first
Write-Host "Preparing CHANGELOG.md from commit history..." -ForegroundColor Blue
& .\scripts\prepare-changelog.ps1

if (-not $Execute) {
    Write-Host "`nThis is a dry run. To execute the squash, run with -Execute parameter." -ForegroundColor Yellow
    Write-Host "The following commands will be executed:" -ForegroundColor Yellow
    Write-Host "git reset --soft $firstCommit" -ForegroundColor Cyan
    Write-Host "git commit -m 'Initial release 1.0.0'" -ForegroundColor Cyan
    Write-Host "git push --force origin $currentBranch" -ForegroundColor Cyan
    exit
}

# Confirm with the user
Write-Host "`nWARNING: This will squash all commits and force push to $currentBranch." -ForegroundColor Red
Write-Host "This operation cannot be undone and will rewrite history." -ForegroundColor Red
$confirmation = Read-Host "Are you sure you want to proceed? (y/n)"

if ($confirmation -ne "y") {
    Write-Host "Operation cancelled." -ForegroundColor Yellow
    exit
}

# Execute the squash
Write-Host "`nSquashing commits..." -ForegroundColor Blue
git reset --soft $firstCommit

# Commit with the new message
Write-Host "Creating new commit..." -ForegroundColor Blue
git commit -m "Initial release 1.0.0"

# Force push
Write-Host "Force pushing to $currentBranch..." -ForegroundColor Blue
git push --force origin $currentBranch

Write-Host "`nAll commits have been squashed into a single 'Initial release 1.0.0' commit." -ForegroundColor Green
Write-Host "CHANGELOG.md has been updated with all previous commit messages." -ForegroundColor Green
Write-Host "The history has been rewritten and force pushed to $currentBranch." -ForegroundColor Green
