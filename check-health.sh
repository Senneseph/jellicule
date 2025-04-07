#!/bin/bash

# Bash script to check the health of Jellicule services

echo -e "\033[36mChecking health of Jellicule services...\033[0m"

# Get the health status from the health check service
if command -v curl &> /dev/null; then
    response=$(curl -s http://localhost:8081/health)
else
    response=$(wget -qO- http://localhost:8081/health)
fi

if [ $? -eq 0 ]; then
    status=$(echo $response | grep -o '"status":"[^"]*"' | cut -d'"' -f4)
    time=$(echo $response | grep -o '"time":"[^"]*"' | cut -d'"' -f4)
    version=$(echo $response | grep -o '"version":"[^"]*"' | cut -d'"' -f4)
    message=$(echo $response | grep -o '"message":"[^"]*"' | cut -d'"' -f4)
    
    echo -e "\033[36mHealth Check Status:\033[0m"
    if [ "$status" = "success" ]; then
        echo -e "  Status: \033[32m$status\033[0m"
    else
        echo -e "  Status: \033[31m$status\033[0m"
    fi
    echo -e "  Time: \033[90m$time\033[0m"
    echo -e "  Version: \033[90m$version\033[0m"
    
    if [ ! -z "$message" ]; then
        if [ "$status" = "success" ]; then
            echo -e "  Message: \033[32m$message\033[0m"
        else
            echo -e "  Message: \033[31m$message\033[0m"
        fi
    fi
    
    echo ""
else
    echo -e "\033[31mError connecting to health check service\033[0m"
    echo -e "\033[33mMake sure the services are running with 'docker-compose up -d'\033[0m"
    echo ""
fi

# Get Docker container health status
echo -e "\033[36mDocker Container Health:\033[0m"

containers=$(docker ps --format "{{.Names}},{{.Status}}" | grep jellicule)

if [ ! -z "$containers" ]; then
    echo "$containers" | while read container; do
        name=$(echo $container | cut -d',' -f1)
        status=$(echo $container | cut -d',' -f2)
        
        if [[ $status == *"healthy"* ]]; then
            echo -e "  $name : \033[32m$status\033[0m"
        elif [[ $status == *"unhealthy"* ]]; then
            echo -e "  $name : \033[31m$status\033[0m"
        elif [[ $status == *"starting"* ]]; then
            echo -e "  $name : \033[33m$status\033[0m"
        else
            echo -e "  $name : $status"
        fi
    done
else
    echo -e "  \033[33mNo Jellicule containers found\033[0m"
fi

echo ""
echo -e "\033[36mFor more details, visit http://localhost:8081/\033[0m"
