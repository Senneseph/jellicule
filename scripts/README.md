# Release Scripts

This directory contains scripts for managing releases, versioning, and dependency management.

## Scripts

### prepare-release.ps1

Prepares the repository for a 1.0.0 release by:
1. Checking and pinning all dependencies
2. Creating a comprehensive CHANGELOG.md from all commit messages
3. Squashing all commits into a single 'Initial release 1.0.0' commit
4. Setting up version 1.0.0 and creating a git tag

Usage:
```powershell
# Dry run (shows what would happen without making changes)
.\scripts\prepare-release.ps1

# Execute the release preparation
.\scripts\prepare-release.ps1 -Execute
```

### auto-version.ps1

Automatically increments the version number in all relevant files and creates a git tag.

Usage:
```powershell
# Increment patch version (1.0.0 -> 1.0.1)
.\scripts\auto-version.ps1 -VersionType patch

# Increment minor version (1.0.0 -> 1.1.0)
.\scripts\auto-version.ps1 -VersionType minor

# Increment major version (1.0.0 -> 2.0.0)
.\scripts\auto-version.ps1 -VersionType major

# Dry run (shows what would happen without making changes)
.\scripts\auto-version.ps1 -VersionType patch -DryRun
```

### pin-dependencies.ps1

Checks for and fixes unpinned dependencies in package.json, requirements.txt, docker-compose.yaml, and Dockerfile.

Usage:
```powershell
# Check for unpinned dependencies
.\scripts\pin-dependencies.ps1

# Fix unpinned dependencies
.\scripts\pin-dependencies.ps1 -Fix
```

### prepare-changelog.ps1

Extracts all commit messages and prepares a CHANGELOG.md file.

Usage:
```powershell
.\scripts\prepare-changelog.ps1
```

### squash-commits.ps1

Squashes all commits into a single 'Initial release 1.0.0' commit.

Usage:
```powershell
# Dry run (shows what would happen without making changes)
.\scripts\squash-commits.ps1

# Execute the squash
.\scripts\squash-commits.ps1 -Execute
```

### rewrite-history.ps1

Rewrites git history by replacing README.md with README.md.new and squashing all commits.

Usage:
```powershell
# Dry run (shows what would happen without making changes)
.\scripts\rewrite-history.ps1

# Execute the history rewrite
.\scripts\rewrite-history.ps1 -Execute
```

## Workflow

The typical workflow for a release is:

1. Prepare for the initial 1.0.0 release:
   ```powershell
   .\scripts\prepare-release.ps1 -Execute
   ```

2. Push the tag:
   ```powershell
   git push --tags
   ```

3. For subsequent releases, use the auto-version script:
   ```powershell
   .\scripts\auto-version.ps1 -VersionType patch
   git push && git push --tags
   ```

## Notes

- These scripts are designed to be run from the root of the repository.
- The scripts require PowerShell and Git to be installed.
- The pin-dependencies.ps1 script requires npm, pip, and/or docker to be installed, depending on which dependencies you're checking.
