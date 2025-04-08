// Import all web components
import '../../components/layout/ActivityViewport/activity-viewport.js';
import '../../components/layout/ActivityBar/activity-bar.js';
import '../../components/layout/Activity/activity.js';
import '../../components/layout/ActivityResizeButton/activity-resize-button.js';
import '../../components/layout/MainContent/main-content.js';
import '../../components/layout/Content/content.js';

// Initialize any global functionality
document.addEventListener('DOMContentLoaded', () => {
  console.log('Jellicule UI PWA initialized');

  // Check if the app is running as an installed PWA
  const isInstalledPWA = window.matchMedia('(display-mode: standalone)').matches ||
                         window.navigator.standalone ||
                         document.referrer.includes('android-app://');

  if (isInstalledPWA) {
    console.log('Running as installed PWA');
    // Add PWA-specific functionality here
  }

  // Define custom elements directly
  class ViewportElement extends HTMLElement {
    constructor() {
      super();
      const viewport = document.createElement('activity-viewport');

      // Copy attributes
      Array.from(this.attributes).forEach(attr => {
        viewport.setAttribute(attr.name, attr.value);
      });

      // Copy children
      while (this.firstChild) {
        viewport.appendChild(this.firstChild);
      }

      // Replace this element with the viewport
      this.parentNode.replaceChild(viewport, this);
    }
  }

  class ActivityBarElement extends HTMLElement {
    constructor() {
      super();
      const activityBar = document.createElement('activity-bar');

      // Copy attributes
      Array.from(this.attributes).forEach(attr => {
        activityBar.setAttribute(attr.name, attr.value);
      });

      // Copy children
      while (this.firstChild) {
        activityBar.appendChild(this.firstChild);
      }

      // Replace this element with the activity bar
      this.parentNode.replaceChild(activityBar, this);
    }
  }

  class ActivityElement extends HTMLElement {
    constructor() {
      super();
      const activity = document.createElement('activity');

      // Copy attributes
      Array.from(this.attributes).forEach(attr => {
        activity.setAttribute(attr.name, attr.value);
      });

      // Copy children
      while (this.firstChild) {
        activity.appendChild(this.firstChild);
      }

      // Replace this element with the activity
      this.parentNode.replaceChild(activity, this);
    }
  }

  class ActivityResizebuttonElement extends HTMLElement {
    constructor() {
      super();
      const resizeButton = document.createElement('activity-resize-button');

      // Copy attributes
      Array.from(this.attributes).forEach(attr => {
        resizeButton.setAttribute(attr.name, attr.value);
      });

      // Copy children
      while (this.firstChild) {
        resizeButton.appendChild(this.firstChild);
      }

      // Replace this element with the resize button
      this.parentNode.replaceChild(resizeButton, this);
    }
  }

  class MainContentElement extends HTMLElement {
    constructor() {
      super();
      const mainContent = document.createElement('main-content');

      // Copy attributes
      Array.from(this.attributes).forEach(attr => {
        mainContent.setAttribute(attr.name, attr.value);
      });

      // Copy children
      while (this.firstChild) {
        mainContent.appendChild(this.firstChild);
      }

      // Replace this element with the main content
      this.parentNode.replaceChild(mainContent, this);
    }
  }

  // Define the custom elements
  customElements.define('Viewport', ViewportElement);
  customElements.define('ActivityBar', ActivityBarElement);
  customElements.define('Activity', ActivityElement);
  customElements.define('ActivityResizeButton', ActivityResizebuttonElement);
  customElements.define('MainContent', MainContentElement);

  // Create offline notification element
  let offlineNotification = null;

  // Function to show offline notification
  const showOfflineNotification = () => {
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

  // Function to hide offline notification
  const hideOfflineNotification = () => {
    if (offlineNotification && offlineNotification.parentNode) {
      offlineNotification.parentNode.removeChild(offlineNotification);
      offlineNotification = null;
    }
  };

  // Add network status event listeners
  window.addEventListener('online', () => {
    console.log('App is online');
    hideOfflineNotification();

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
  });

  window.addEventListener('offline', () => {
    console.log('App is offline');
    showOfflineNotification();

    // Store current state in localStorage for offline use
    try {
      // You can add code here to store any important state
      // that might be needed when offline
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
});
