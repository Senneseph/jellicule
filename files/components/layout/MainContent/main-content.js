export class MainContent extends HTMLElement {
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

// For standalone use: customElements.define('main-content', MainContent);
