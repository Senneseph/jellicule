/**
 * Jellicule UI Components Library
 * Version: 1.0.0
 * Built: 2025-04-07T08:44:39.829Z
 */

(function(global) {
  'use strict';

  // Define the global jellicule object
  global.jellicule = {
    version: '1.0.0',
    components: {}
  };

const ActivityViewport extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: grid;
          grid-template-areas:
            "top-bar top-bar top-bar"
            "left-bar main-content right-bar"
            "bottom-bar bottom-bar bottom-bar";
          grid-template-rows: auto 1fr auto;
          grid-template-columns: auto 1fr auto;
          width: 100%;
          height: 100vh;
          overflow: hidden;
        }
        ::slotted(activity-bar[orientation="top"]), ::slotted(ActivityBar[orientation="top"]) {
          grid-area: top-bar;
        }
        ::slotted(activity-bar[orientation="right"]), ::slotted(ActivityBar[orientation="right"]) {
          grid-area: right-bar;
        }
        ::slotted(activity-bar[orientation="bottom"]), ::slotted(ActivityBar[orientation="bottom"]) {
          grid-area: bottom-bar;
        }
        ::slotted(activity-bar[orientation="left"]), ::slotted(ActivityBar[orientation="left"]) {
          grid-area: left-bar;
        }
        ::slotted(main-content), ::slotted(MainContent) {
          grid-area: main-content;
        }
      </style>
      <slot></slot>
    `;
  }

  connectedCallback() {
    // Initialize any event listeners or additional setup
  }
}

// For standalone use: customElements.define('activity-viewport', ActivityViewport);\n\nconst Activity extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  static get observedAttributes() {
    return ['selected', 'active'];
  }

  get selected() {
    return this.hasAttribute('selected');
  }

  set selected(value) {
    if (value) {
      this.setAttribute('selected', '');
    } else {
      this.removeAttribute('selected');
    }
  }

  get active() {
    return this.hasAttribute('active');
  }

  set active(value) {
    if (value) {
      this.setAttribute('active', '');
    } else {
      this.removeAttribute('active');
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          cursor: pointer;
          user-select: none;
          transition: background-color 0.2s;
        }
        :host(:hover) {
          background-color: #e0e0e0;
        }
        :host([selected]) {
          background-color: #d0d0d0;
        }
        :host([active]) {
          font-weight: bold;
        }
      </style>
      <slot></slot>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if ((name === 'selected' || name === 'active') && oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.addEventListener('click', this._handleClick.bind(this));
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._handleClick.bind(this));
  }

  _handleClick() {
    // Find all sibling activities and deselect them
    const parent = this.parentElement;
    if (parent) {
      const activities = Array.from(parent.querySelectorAll('activity'));
      activities.forEach(activity => {
        activity.selected = false;
      });
    }
    
    // Select this activity
    this.selected = true;
    
    // Dispatch a custom event
    this.dispatchEvent(new CustomEvent('activity-selected', {
      bubbles: true,
      composed: true,
      detail: { activity: this }
    }));
  }
}

// For standalone use: customElements.define('activity', Activity);\n\nclass ActivityResizeButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          cursor: col-resize;
          background-color: #e8e8e8;
          border-right: 1px solid #ccc;
          user-select: none;
        }
        :host(:hover) {
          background-color: #d0d0d0;
        }
        .resize-icon {
          width: 12px;
          height: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .resize-line {
          height: 2px;
          background-color: #666;
          width: 100%;
        }
      </style>
      <div class="resize-icon">
        <div class="resize-line"></div>
        <div class="resize-line"></div>
        <div class="resize-line"></div>
      </div>
    `;
  }

  connectedCallback() {
    this.addEventListener('mousedown', this._handleMouseDown.bind(this));
  }

  disconnectedCallback() {
    this.removeEventListener('mousedown', this._handleMouseDown.bind(this));
  }

  _handleMouseDown(event) {
    event.preventDefault();
    
    const activityBar = this.closest('activity-bar');
    if (!activityBar) return;
    
    const orientation = activityBar.orientation;
    const isHorizontal = orientation === 'left' || orientation === 'right';
    
    const startPos = isHorizontal ? event.clientX : event.clientY;
    const startSize = isHorizontal ? activityBar.offsetWidth : activityBar.offsetHeight;
    
    const handleMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      
      const currentPos = isHorizontal ? moveEvent.clientX : moveEvent.clientY;
      const diff = currentPos - startPos;
      
      const newSize = orientation === 'right' || orientation === 'bottom'
        ? startSize - diff
        : startSize + diff;
      
      if (newSize > 30) {
        if (isHorizontal) {
          activityBar.style.width = `${newSize}px`;
        } else {
          activityBar.style.height = `${newSize}px`;
        }
      }
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }
}

customElements.define('activity-resize-button', ActivityResizeButton);\n\nconst MainContent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  static get observedAttributes() {
    return ['context'];
  }

  get context() {
    return this.getAttribute('context') || '';
  }

  set context(value) {
    this.setAttribute('context', value);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 16px;
          background-color: #fff;
          overflow: auto;
          height: 100%;
          box-sizing: border-box;
        }
        .context-info {
          margin-bottom: 16px;
          padding: 8px;
          background-color: #f5f5f5;
          border-radius: 4px;
          font-family: monospace;
        }
      </style>
      <div class="context-info">Context: ${this.context}</div>
      <slot></slot>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'context' && oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    // Listen for activity-selected events
    document.addEventListener('activity-selected', this._handleActivitySelected.bind(this));
  }

  disconnectedCallback() {
    document.removeEventListener('activity-selected', this._handleActivitySelected.bind(this));
  }

  _handleActivitySelected(event) {
    // Update context based on selected activity
    const activity = event.detail.activity;
    if (activity) {
      this.context = `Selected: ${activity.textContent.trim()}`;
    }
  }
}

// For standalone use: customElements.define('main-content', MainContent);\n\nconst Content extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 20px;
          background-color: #fff;
          overflow: auto;
          height: 100%;
          box-sizing: border-box;
        }
        .content-container {
          max-width: 1200px;
          margin: 0 auto;
        }
      </style>
      <div class="content-container">
        <slot></slot>
      </div>
    `;
  }

  connectedCallback() {
    // Initialize any event listeners or additional setup
  }
}

// For standalone use: customElements.define('content', Content);\n\nconst ActivityBar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  static get observedAttributes() {
    return ['orientation'];
  }

  get orientation() {
    return this.getAttribute('orientation') || 'left';
  }

  set orientation(value) {
    this.setAttribute('orientation', value);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          background-color: #f0f0f0;
          border: 1px solid #ddd;
        }
        :host([orientation="top"]), :host([orientation="bottom"]) {
          flex-direction: row;
          width: 100%;
          height: 40px;
        }
        :host([orientation="left"]), :host([orientation="right"]) {
          flex-direction: column;
          height: 100%;
          width: 40px;
        }
        .activity-container {
          display: flex;
          flex-direction: inherit;
          flex: 1;
        }
      </style>
      <div class="activity-container">
        <slot></slot>
      </div>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'orientation' && oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    // Initialize any event listeners or additional setup
  }
}

// For standalone use: customElements.define('activity-bar', ActivityBar);\n\nconst ActivityResizeButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          cursor: col-resize;
          background-color: #e8e8e8;
          border-right: 1px solid #ccc;
          user-select: none;
        }
        :host(:hover) {
          background-color: #d0d0d0;
        }
        .resize-icon {
          width: 12px;
          height: 12px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .resize-line {
          height: 2px;
          background-color: #666;
          width: 100%;
        }
      </style>
      <div class="resize-icon">
        <div class="resize-line"></div>
        <div class="resize-line"></div>
        <div class="resize-line"></div>
      </div>
    `;
  }

  connectedCallback() {
    this.addEventListener('mousedown', this._handleMouseDown.bind(this));
  }

  disconnectedCallback() {
    this.removeEventListener('mousedown', this._handleMouseDown.bind(this));
  }

  _handleMouseDown(event) {
    event.preventDefault();
    
    const activityBar = this.closest('activity-bar');
    if (!activityBar) return;
    
    const orientation = activityBar.orientation;
    const isHorizontal = orientation === 'left' || orientation === 'right';
    
    const startPos = isHorizontal ? event.clientX : event.clientY;
    const startSize = isHorizontal ? activityBar.offsetWidth : activityBar.offsetHeight;
    
    const handleMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      
      const currentPos = isHorizontal ? moveEvent.clientX : moveEvent.clientY;
      const diff = currentPos - startPos;
      
      const newSize = orientation === 'right' || orientation === 'bottom'
        ? startSize - diff
        : startSize + diff;
      
      if (newSize > 30) {
        if (isHorizontal) {
          activityBar.style.width = `${newSize}px`;
        } else {
          activityBar.style.height = `${newSize}px`;
        }
      }
    };
    
    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }
}

// For standalone use: customElements.define('activity-resize-button', ActivityResizeButton);\n\n
  // Register all components
  customElements.define('ActivityViewport', ActivityViewportElement);
  customElements.define('ActivityBar', ActivityBarElement);
  customElements.define('Activity', ActivityElement);
  customElements.define('ActivityResizeButton', ActivityResizebuttonElement);
  customElements.define('MainContent', MainContentElement);
  customElements.define('Content', ContentElement);

  // Add components to the jellicule object
  global.jellicule.components = {
    ActivityViewport: ActivityViewportElement,
    ActivityBar: ActivityBarElement,
    Activity: ActivityElement,
    ActivityResizeButton: ActivityResizebuttonElement,
    MainContent: MainContentElement,
    Content: ContentElement
  };

})(typeof window !== 'undefined' ? window : this);
