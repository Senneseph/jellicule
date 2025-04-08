/**
 * Offline Notification Management
 * Handles displaying notifications when the app goes offline or comes back online
 */

// State
let offlineNotification = null;

/**
 * Show offline notification
 */
export const showOfflineNotification = () => {
    // Don't show multiple notifications
    if (offlineNotification) return;

    // Create notification element
    offlineNotification = document.createElement('div');
    offlineNotification.id = 'offline-notification';
    offlineNotification.style.position = 'fixed';
    offlineNotification.style.bottom = '20px';
    offlineNotification.style.left = '20px';
    offlineNotification.style.padding = '10px 20px';
    offlineNotification.style.backgroundColor = '#FF9800';
    offlineNotification.style.color = 'white';
    offlineNotification.style.borderRadius = '4px';
    offlineNotification.style.zIndex = '9999';
    offlineNotification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    offlineNotification.style.display = 'flex';
    offlineNotification.style.alignItems = 'center';
    offlineNotification.style.justifyContent = 'space-between';

    // Add content
    const textSpan = document.createElement('span');
    textSpan.textContent = 'You are offline. The app is running in local mode.';
    offlineNotification.appendChild(textSpan);

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.textContent = '×';
    closeButton.style.background = 'none';
    closeButton.style.border = 'none';
    closeButton.style.color = 'white';
    closeButton.style.fontSize = '20px';
    closeButton.style.marginLeft = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.padding = '0 5px';
    closeButton.addEventListener('click', () => {
        if (offlineNotification && offlineNotification.parentNode) {
            offlineNotification.parentNode.removeChild(offlineNotification);
            offlineNotification = null;
        }
    });
    offlineNotification.appendChild(closeButton);

    document.body.appendChild(offlineNotification);
};

/**
 * Hide offline notification
 */
export const hideOfflineNotification = () => {
    if (offlineNotification && offlineNotification.parentNode) {
        offlineNotification.parentNode.removeChild(offlineNotification);
        offlineNotification = null;
    }
};

/**
 * Show online notification
 */
export const showOnlineNotification = () => {
    // Show online notification
    const onlineNotification = document.createElement('div');
    onlineNotification.style.position = 'fixed';
    onlineNotification.style.bottom = '20px';
    onlineNotification.style.left = '20px';
    onlineNotification.style.padding = '10px 20px';
    onlineNotification.style.backgroundColor = '#4CAF50';
    onlineNotification.style.color = 'white';
    onlineNotification.style.borderRadius = '4px';
    onlineNotification.style.zIndex = '9999';
    onlineNotification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    onlineNotification.textContent = 'You are back online.';

    document.body.appendChild(onlineNotification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        if (onlineNotification.parentNode) {
            onlineNotification.parentNode.removeChild(onlineNotification);
        }
    }, 3000);
};

/**
 * Initialize network status monitoring
 */
export const initNetworkStatus = () => {
    // Add network status event listeners
    window.addEventListener('online', () => {
        console.log('App is online');
        hideOfflineNotification();
        showOnlineNotification();
    });

    window.addEventListener('offline', () => {
        console.log('App is offline');
        showOfflineNotification();

        // Store current state in localStorage for offline use
        try {
            localStorage.setItem('jelliculeOfflineTimestamp', new Date().toISOString());
        } catch (e) {
            console.error('Error storing offline data:', e);
        }
    });

    // Check initial network state
    if (!navigator.onLine) {
        console.log('App started offline');
        showOfflineNotification();
    }
};
