# PowerShell script to extract git commit messages and prepare CHANGELOG.md

# Create scripts directory if it doesn't exist
if (-not (Test-Path "scripts")) {
    New-Item -ItemType Directory -Path "scripts" | Out-Null
}

# Get all commit messages
$commits = git log --pretty=format:"%h - %an, %ar : %s%n%b" | Out-String

# Split commits into an array
$commitArray = $commits -split "(?=\w{7} - )"

# Prepare CHANGELOG content
$changelogContent = @"
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - $(Get-Date -Format "yyyy-MM-dd")

### Added
"@

# Process each commit
foreach ($commit in $commitArray) {
    if ($commit.Trim() -ne "") {
        # Extract commit hash, author, and message
        if ($commit -match "(\w{7}) - (.*?), (.*?) : (.*)") {
            $hash = $matches[1]
            $author = $matches[2]
            $time = $matches[3]
            $message = $matches[4]
            
            # Clean up the message
            $message = $message.Trim()
            
            # Categorize the commit based on the message
            $category = "Added"
            if ($message -match "^fix|^bug|error|issue|resolve") {
                $category = "Fixed"
            }
            elseif ($message -match "^change|^modify|^update|^refactor|^improve") {
                $category = "Changed"
            }
            elseif ($message -match "^remove|^delete|^deprecate") {
                $category = "Removed"
            }
            elseif ($message -match "^security") {
                $category = "Security"
            }
            
            # Add to the appropriate section
            if (-not ($changelogContent -match "### $category")) {
                $changelogContent += "`n`n### $category"
            }
            
            # Add the commit message to the changelog
            $changelogContent += "`n- $message [$hash]"
        }
    }
}

# Add links section
$changelogContent += @"

[1.0.0]: https://github.com/jellicule/jellicule/releases/tag/v1.0.0
"@

# Write to CHANGELOG.md
$changelogContent | Out-File -FilePath "CHANGELOG.md" -Encoding utf8

Write-Host "CHANGELOG.md has been prepared for version 1.0.0"
Write-Host "Now you can squash all commits with:"
Write-Host "git reset --soft <first-commit-hash>"
Write-Host "git commit -m 'Initial release 1.0.0'"
Write-Host "git push --force"
