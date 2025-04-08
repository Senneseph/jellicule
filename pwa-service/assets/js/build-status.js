/**
 * Build Status and WebSocket Connection Management
 * Handles real-time updates and build status display
 */

// Configuration
const MAX_RECONNECT_ATTEMPTS = 3;

// State
let isOfflineMode = false;
let reconnectAttempts = 0;

/**
 * Update the build status display
 * @param {Object} status - The build status object
 * @param {boolean} isOffline - Whether the app is in offline mode
 */
export const updateBuildStatus = (status, isOffline = false) => {
    const buildStatusElement = document.getElementById('build-status');
    if (buildStatusElement) {
        if (isOffline) {
            buildStatusElement.textContent = 'Offline Mode - Local Version';
            buildStatusElement.className = 'build-status offline';
        } else {
            buildStatusElement.textContent = `Build: ${status.status} | Last build: ${status.time} | Version: ${status.version}`;
            buildStatusElement.className = `build-status ${status.status}`;
        }
    }

    if (!isOffline) {
        localStorage.setItem('jelliculeVersion', status.version);
        localStorage.setItem('jelliculeLastStatus', JSON.stringify(status));
    }
};

/**
 * Connect to WebSocket server for real-time updates
 */
export const connectWebSocket = () => {
    // If we're in offline mode and not explicitly trying to reconnect, don't attempt connection
    if (isOfflineMode && reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
        console.log('Running in offline mode, not attempting WebSocket connection');
        return;
    }

    try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.hostname;
        const ws = new WebSocket(`${protocol}//${host}:8080`);

        // Set a connection timeout
        const connectionTimeout = setTimeout(() => {
            console.log('WebSocket connection timeout');
            ws.close();
        }, 5000);

        ws.onopen = () => {
            console.log('WebSocket connected');
            clearTimeout(connectionTimeout);
            reconnectAttempts = 0;
            isOfflineMode = false;
        };

        ws.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);

                if (message.type === 'build-status') {
                    const status = message.data;

                    // Update build status display
                    updateBuildStatus(status);

                    // Check if we need to reload
                    const currentVersion = localStorage.getItem('jelliculeVersion');
                    if (currentVersion && currentVersion !== status.version) {
                        console.log('Components updated, refreshing...');
                        location.reload();
                    }
                }
            } catch (err) {
                console.error('Error processing WebSocket message:', err);
            }
        };

        ws.onclose = () => {
            clearTimeout(connectionTimeout);
            reconnectAttempts++;

            if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
                console.log(`WebSocket disconnected after ${reconnectAttempts} attempts. Switching to offline mode.`);
                isOfflineMode = true;
                updateBuildStatus({}, true);
            } else {
                console.log(`WebSocket disconnected. Reconnecting in 3 seconds... (Attempt ${reconnectAttempts} of ${MAX_RECONNECT_ATTEMPTS})`);
                setTimeout(connectWebSocket, 3000);
            }
        };

        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
            clearTimeout(connectionTimeout);
            ws.close();
        };
    } catch (error) {
        console.error('Error creating WebSocket connection:', error);
        reconnectAttempts++;

        if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
            console.log(`Failed to create WebSocket after ${reconnectAttempts} attempts. Switching to offline mode.`);
            isOfflineMode = true;
            updateBuildStatus({}, true);
        } else {
            setTimeout(connectWebSocket, 3000);
        }
    }
};

/**
 * Initialize build status monitoring
 */
export const initBuildStatus = () => {
    // Check if we're online
    if (!navigator.onLine) {
        console.log('Browser reports offline status. Starting in offline mode.');
        isOfflineMode = true;
        updateBuildStatus({}, true);

        // Try to load cached status
        const cachedStatus = localStorage.getItem('jelliculeLastStatus');
        if (cachedStatus) {
            try {
                updateBuildStatus(JSON.parse(cachedStatus));
            } catch (e) {
                console.error('Error parsing cached status:', e);
            }
        }
        return;
    }

    // Load initial status
    fetch('build-status/status.json')
        .then(response => response.json())
        .then(status => {
            updateBuildStatus(status);
        })
        .catch(err => {
            console.log('Error loading initial status:', err);
            // Try to load cached status
            const cachedStatus = localStorage.getItem('jelliculeLastStatus');
            if (cachedStatus) {
                try {
                    updateBuildStatus(JSON.parse(cachedStatus));
                } catch (e) {
                    console.error('Error parsing cached status:', e);
                    updateBuildStatus({}, true);
                }
            } else {
                updateBuildStatus({}, true);
            }
        });

    // Connect to WebSocket only if we're online
    connectWebSocket();

    // Listen for online/offline events
    window.addEventListener('online', () => {
        console.log('Browser reports online status. Attempting to reconnect.');
        isOfflineMode = false;
        reconnectAttempts = 0;
        connectWebSocket();
    });

    window.addEventListener('offline', () => {
        console.log('Browser reports offline status. Switching to offline mode.');
        isOfflineMode = true;
        updateBuildStatus({}, true);
    });
};
