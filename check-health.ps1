# PowerShell script to check the health of Jellicule services

Write-Host "Checking health of Jellicule services..." -ForegroundColor Cyan

# Get the health status from the health check service
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8081/health" -UseBasicParsing
    $status = $response.Content | ConvertFrom-Json
    
    Write-Host "Health Check Status:" -ForegroundColor Cyan
    Write-Host "  Status: $($status.status)" -ForegroundColor $(if ($status.status -eq "success") { "Green" } else { "Red" })
    Write-Host "  Time: $($status.time)" -ForegroundColor Gray
    Write-Host "  Version: $($status.version)" -ForegroundColor Gray
    
    if ($status.message) {
        Write-Host "  Message: $($status.message)" -ForegroundColor $(if ($status.status -eq "success") { "Green" } else { "Red" })
    }
    
    Write-Host ""
} catch {
    Write-Host "Error connecting to health check service: $_" -ForegroundColor Red
    Write-Host "Make sure the services are running with 'docker-compose up -d'" -ForegroundColor Yellow
    Write-Host ""
}

# Get Docker container health status
try {
    Write-Host "Docker Container Health:" -ForegroundColor Cyan
    
    $containers = docker ps --format "{{.Names}},{{.Status}}" | Where-Object { $_ -like "*jellicule*" }
    
    if ($containers) {
        foreach ($container in $containers) {
            $parts = $container -split ","
            $name = $parts[0]
            $status = $parts[1]
            
            $color = "White"
            if ($status -like "*healthy*") {
                $color = "Green"
            } elseif ($status -like "*unhealthy*") {
                $color = "Red"
            } elseif ($status -like "*starting*") {
                $color = "Yellow"
            }
            
            Write-Host "  $name : $status" -ForegroundColor $color
        }
    } else {
        Write-Host "  No Jellicule containers found" -ForegroundColor Yellow
    }
} catch {
    Write-Host "Error checking Docker container health: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "For more details, visit http://localhost:8081/" -ForegroundColor Cyan
