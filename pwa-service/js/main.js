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

  // Add network status event listeners
  window.addEventListener('online', () => {
    console.log('App is online');
    // You can add online-specific functionality here
  });

  window.addEventListener('offline', () => {
    console.log('App is offline');
    // You can add offline-specific functionality here

    // Show offline notification
    const notification = document.createElement('div');
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.left = '20px';
    notification.style.padding = '10px 20px';
    notification.style.backgroundColor = '#f44336';
    notification.style.color = 'white';
    notification.style.borderRadius = '4px';
    notification.style.zIndex = '9999';
    notification.textContent = 'You are offline. Some features may be limited.';

    document.body.appendChild(notification);

    // Remove notification when back online
    window.addEventListener('online', () => {
      document.body.removeChild(notification);
    }, { once: true });
  });
});
