/**
 * Base component class that all j e l l i c u l e components will extend
 */
export class BaseComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  /**
   * Get the theme preference
   * @returns {string} 'light' or 'dark'
   */
  getTheme() {
    return document.documentElement.getAttribute('data-theme') || 'light';
  }

  /**
   * Apply common styles to the component
   * @param {string} customStyles - Component-specific styles
   * @returns {HTMLStyleElement} The style element
   */
  applyStyles(customStyles = '') {
    const style = document.createElement('style');
    style.textContent = `
      /* Common variables */
      :host {
        --jc-primary: #f5d76e;
        --jc-secondary: #4a235a;
        --jc-bg-light: #f8f9fa;
        --jc-bg-dark: #121212;
        --jc-text-light: #212529;
        --jc-text-dark: #f8f9fa;
        --jc-grid: #20c20e;
        --jc-chrome: linear-gradient(135deg, #c0c0c0, #f0f0f0, #c0c0c0);
        
        /* Theme-specific variables */
        --jc-bg: var(--jc-bg-light);
        --jc-text: var(--jc-text-light);
        --jc-border: rgba(0, 0, 0, 0.125);
        
        /* Font settings */
        font-family: monospace;
        box-sizing: border-box;
      }
      
      /* Dark theme */
      :host([theme="dark"]) {
        --jc-bg: var(--jc-bg-dark);
        --jc-text: var(--jc-text-dark);
        --jc-border: rgba(255, 255, 255, 0.125);
      }
      
      /* Wireframe grid background */
      .wireframe-bg {
        background-color: var(--jc-bg);
        background-image: 
          linear-gradient(var(--jc-grid) 1px, transparent 1px),
          linear-gradient(90deg, var(--jc-grid) 1px, transparent 1px);
        background-size: 20px 20px;
        background-position: -1px -1px;
        opacity: 0.1;
      }
      
      /* Chrome effect */
      .chrome {
        background: var(--jc-chrome);
        border: 1px solid var(--jc-border);
        border-radius: 4px;
      }
      
      ${customStyles}
    `;
    return style;
  }

  /**
   * Render the component
   * This method should be overridden by subclasses
   */
  render() {
    // To be implemented by subclasses
  }

  /**
   * Called when the element is added to the DOM
   */
  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
    }
  }

  /**
   * Called when an attribute is changed
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
    }
  }

  /**
   * Dispatch a custom event
   * @param {string} name - Event name
   * @param {object} detail - Event details
   */
  dispatchCustomEvent(name, detail = {}) {
    this.dispatchEvent(new CustomEvent(name, {
      bubbles: true,
      composed: true,
      detail
    }));
  }
}
