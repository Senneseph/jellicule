// The jellicule library is loaded via script tag in the HTML

// Import utility modules
import { initBuildStatus } from './build-status.js';
import { initNetworkStatus } from './offline-notification.js';
import { initTheme, setupThemeToggle } from './theme-toggle.js';
import { initInstallPrompt } from './install-prompt.js';
import { registerServiceWorker } from './service-worker-registration.js';
import { initAnimationSystem } from './animation-system.js';

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

  // Define legacy custom elements for backward compatibility
  class ViewportElement extends HTMLElement {
    constructor() {
      super();
      const viewport = document.createElement('jc-activity-viewport');

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
      const activityBar = document.createElement('jc-activity-bar');

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
      const activity = document.createElement('jc-activity');

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
      const resizeButton = document.createElement('jc-activity-resize-button');

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
      const mainContent = document.createElement('jc-main-content');

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

  // Define the legacy custom elements
  customElements.define('Viewport', ViewportElement);
  customElements.define('ActivityBar', ActivityBarElement);
  customElements.define('Activity', ActivityElement);
  customElements.define('ActivityResizeButton', ActivityResizebuttonElement);
  customElements.define('MainContent', MainContentElement);

  // Initialize modules
  initTheme();
  setupThemeToggle();
  initBuildStatus();
  initNetworkStatus();
  initInstallPrompt();
  registerServiceWorker();

  // Initialize animation system
  initAnimationSystem().then(refreshRate => {
    console.log(`Animation system initialized with ${refreshRate}Hz refresh rate`);
  });
});
