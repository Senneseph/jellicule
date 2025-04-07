# PowerShell script to check and pin dependencies

param (
    [switch]$Fix = $false
)

# Function to check if a string contains a version range
function Is-VersionRange {
    param (
        [string]$Version
    )
    
    return $Version -match '[\^~><=]' -or $Version -match '\d+\.\d+\.\d+\s*-\s*\d+\.\d+\.\d+'
}

# Function to get the exact version of a package
function Get-ExactVersion {
    param (
        [string]$Package,
        [string]$Version
    )
    
    # For npm packages
    if (Test-Path "node_modules") {
        try {
            $exactVersion = npm list $Package --json | ConvertFrom-Json
            if ($exactVersion.dependencies.$Package) {
                return $exactVersion.dependencies.$Package.version
            }
        } catch {
            Write-Host "Error getting exact version for npm package $Package" -ForegroundColor Yellow
        }
    }
    
    # For Python packages
    if (Get-Command "pip" -ErrorAction SilentlyContinue) {
        try {
            $pipOutput = pip show $Package 2>$null
            if ($pipOutput -match "Version:\s*(.*)") {
                return $matches[1]
            }
        } catch {
            Write-Host "Error getting exact version for Python package $Package" -ForegroundColor Yellow
        }
    }
    
    # For Docker images
    if (Get-Command "docker" -ErrorAction SilentlyContinue) {
        try {
            $dockerOutput = docker images --format "{{.Repository}}:{{.Tag}}" | Where-Object { $_ -match "^$Package" }
            if ($dockerOutput) {
                return $dockerOutput.Split(':')[1]
            }
        } catch {
            Write-Host "Error getting exact version for Docker image $Package" -ForegroundColor Yellow
        }
    }
    
    # If we can't determine the exact version, remove the range indicators
    return $Version -replace '[\^~><=]', ''
}

# Check and fix package.json
if (Test-Path "package.json") {
    Write-Host "Checking package.json..." -ForegroundColor Blue
    
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    $modified = $false
    
    # Check dependencies
    if ($packageJson.dependencies) {
        $dependencies = $packageJson.dependencies.PSObject.Properties | ForEach-Object {
            $name = $_.Name
            $version = $_.Value
            
            if (Is-VersionRange -Version $version) {
                Write-Host "  Unpinned dependency: $name $version" -ForegroundColor Yellow
                
                if ($Fix) {
                    $exactVersion = Get-ExactVersion -Package $name -Version $version
                    Write-Host "  Pinning to: $exactVersion" -ForegroundColor Green
                    $modified = $true
                    return @{
                        Name = $name
                        Version = $exactVersion
                    }
                }
            }
            
            return @{
                Name = $name
                Version = $version
            }
        }
        
        # Update package.json if modified
        if ($modified -and $Fix) {
            $newDependencies = [PSCustomObject]@{}
            foreach ($dep in $dependencies) {
                $newDependencies | Add-Member -NotePropertyName $dep.Name -NotePropertyValue $dep.Version
            }
            
            $packageJson.dependencies = $newDependencies
            $packageJson | ConvertTo-Json -Depth 10 | Set-Content "package.json"
            Write-Host "Updated package.json with pinned dependencies" -ForegroundColor Green
        }
    }
}

# Check and fix requirements.txt
if (Test-Path "requirements.txt") {
    Write-Host "Checking requirements.txt..." -ForegroundColor Blue
    
    $requirements = Get-Content "requirements.txt"
    $newRequirements = @()
    $modified = $false
    
    foreach ($line in $requirements) {
        if ($line -match "^([a-zA-Z0-9_.-]+)(.*)") {
            $package = $matches[1]
            $version = $matches[2]
            
            if (Is-VersionRange -Version $version) {
                Write-Host "  Unpinned dependency: $package$version" -ForegroundColor Yellow
                
                if ($Fix) {
                    $exactVersion = Get-ExactVersion -Package $package -Version $version
                    $newLine = "$package==$exactVersion"
                    Write-Host "  Pinning to: $newLine" -ForegroundColor Green
                    $newRequirements += $newLine
                    $modified = $true
                } else {
                    $newRequirements += $line
                }
            } else {
                $newRequirements += $line
            }
        } else {
            $newRequirements += $line
        }
    }
    
    # Update requirements.txt if modified
    if ($modified -and $Fix) {
        $newRequirements | Set-Content "requirements.txt"
        Write-Host "Updated requirements.txt with pinned dependencies" -ForegroundColor Green
    }
}

# Check and fix docker-compose.yaml
if (Test-Path "docker-compose.yaml" -or Test-Path "docker-compose.yml") {
    $dockerComposeFile = if (Test-Path "docker-compose.yaml") { "docker-compose.yaml" } else { "docker-compose.yml" }
    Write-Host "Checking $dockerComposeFile..." -ForegroundColor Blue
    
    $dockerCompose = Get-Content $dockerComposeFile -Raw
    $modified = $false
    
    # Find image references
    $imageMatches = [regex]::Matches($dockerCompose, "image:\s*([a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+):?([a-zA-Z0-9_.-]*)")
    
    foreach ($match in $imageMatches) {
        $image = $match.Groups[1].Value
        $tag = $match.Groups[2].Value
        
        if ($tag -eq "" -or $tag -eq "latest") {
            Write-Host "  Unpinned Docker image: $image:$tag" -ForegroundColor Yellow
            
            if ($Fix) {
                # Try to find a specific version
                try {
                    $latestTag = docker pull $image | Select-String -Pattern "Status: Downloaded newer image for $image:(.*)" | ForEach-Object { $_.Matches.Groups[1].Value }
                    
                    if (-not $latestTag) {
                        $latestTag = "latest"
                    }
                    
                    if ($latestTag -ne "latest") {
                        $newImageRef = "image: $image:$latestTag"
                        $dockerCompose = $dockerCompose -replace [regex]::Escape($match.Value), $newImageRef
                        Write-Host "  Pinning to: $image:$latestTag" -ForegroundColor Green
                        $modified = $true
                    } else {
                        Write-Host "  Could not determine specific version for $image" -ForegroundColor Yellow
                    }
                } catch {
                    Write-Host "  Error pulling Docker image $image" -ForegroundColor Red
                }
            }
        }
    }
    
    # Update docker-compose.yaml if modified
    if ($modified -and $Fix) {
        $dockerCompose | Set-Content $dockerComposeFile
        Write-Host "Updated $dockerComposeFile with pinned dependencies" -ForegroundColor Green
    }
}

# Check and fix Dockerfile
if (Test-Path "Dockerfile") {
    Write-Host "Checking Dockerfile..." -ForegroundColor Blue
    
    $dockerfile = Get-Content "Dockerfile" -Raw
    $modified = $false
    
    # Find FROM statements
    $fromMatches = [regex]::Matches($dockerfile, "FROM\s+([a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+):?([a-zA-Z0-9_.-]*)")
    
    foreach ($match in $fromMatches) {
        $image = $match.Groups[1].Value
        $tag = $match.Groups[2].Value
        
        if ($tag -eq "" -or $tag -eq "latest") {
            Write-Host "  Unpinned Docker base image: $image:$tag" -ForegroundColor Yellow
            
            if ($Fix) {
                # Try to find a specific version
                try {
                    $latestTag = docker pull $image | Select-String -Pattern "Status: Downloaded newer image for $image:(.*)" | ForEach-Object { $_.Matches.Groups[1].Value }
                    
                    if (-not $latestTag) {
                        $latestTag = "latest"
                    }
                    
                    if ($latestTag -ne "latest") {
                        $newFromStatement = "FROM $image:$latestTag"
                        $dockerfile = $dockerfile -replace [regex]::Escape($match.Value), $newFromStatement
                        Write-Host "  Pinning to: $image:$latestTag" -ForegroundColor Green
                        $modified = $true
                    } else {
                        Write-Host "  Could not determine specific version for $image" -ForegroundColor Yellow
                    }
                } catch {
                    Write-Host "  Error pulling Docker image $image" -ForegroundColor Red
                }
            }
        }
    }
    
    # Update Dockerfile if modified
    if ($modified -and $Fix) {
        $dockerfile | Set-Content "Dockerfile"
        Write-Host "Updated Dockerfile with pinned dependencies" -ForegroundColor Green
    }
}

if (-not $Fix) {
    Write-Host "`nTo fix unpinned dependencies, run this script with the -Fix parameter:" -ForegroundColor Yellow
    Write-Host ".\scripts\pin-dependencies.ps1 -Fix" -ForegroundColor Yellow
} else {
    Write-Host "`nAll dependencies have been pinned!" -ForegroundColor Green
}
