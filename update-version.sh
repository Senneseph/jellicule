#!/bin/bash

# Update the version.txt file with the current timestamp
echo "$(date +%s)" > components/version.txt
echo "Updated version.txt with timestamp: $(cat components/version.txt)"
