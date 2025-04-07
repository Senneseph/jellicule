// Import all web components
import '../../components/layout/ActivityViewport/activity-viewport.js';
import '../../components/layout/ActivityBar/activity-bar.js';
import '../../components/layout/Activity/activity.js';
import '../../components/layout/ActivityResizebutton/activity-resizebutton.js';
import '../../components/layout/MainContent/main-content.js';
import '../../components/layout/Header/header.js';
import '../../components/layout/Sidebar/sidebar.js';
import '../../components/layout/Footer/footer.js';
import '../../components/layout/Content/content.js';

// Initialize any global functionality
document.addEventListener('DOMContentLoaded', () => {
  console.log('Jellicule UI components loaded');

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
      const resizeButton = document.createElement('activity-resizebutton');

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
  customElements.define('ActivityResizebutton', ActivityResizebuttonElement);
  customElements.define('MainContent', MainContentElement);
});
