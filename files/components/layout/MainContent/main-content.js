import { BaseComponent } from '../../base-component.js';

export class MainContent extends BaseComponent {
  constructor() {
    super();
    this._handleActivitySelected = this._handleActivitySelected.bind(this);
  }

  static get observedAttributes() {
    return ['context', 'theme'];
  }

  get context() {
    return this.getAttribute('context') || '';
  }

  set context(value) {
    this.setAttribute('context', value);
  }

  render() {
    const customStyles = `
      :host {
        display: block;
        padding: 16px;
        background-color: var(--jc-bg);
        color: var(--jc-text);
        overflow: auto;
        height: 100%;
        box-sizing: border-box;
        position: relative;
      }

      /* Retro terminal effect */
      :host::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
        background-size: 100% 4px;
        pointer-events: none;
        z-index: 0;
        opacity: 0.05;
      }

      .context-info {
        margin-bottom: 16px;
        padding: 12px;
        background: var(--jc-chrome);
        border: 1px solid var(--jc-border);
        border-radius: 4px;
        font-family: monospace;
        position: relative;
        z-index: 1;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }

      .content-area {
        position: relative;
        z-index: 1;
      }

      /* Retro terminal cursor effect */
      .context-info::after {
        content: '|';
        animation: blink 1s step-end infinite;
        color: var(--jc-primary);
      }

      @keyframes blink {
        0%, 100% { opacity: 1; }
        50% { opacity: 0; }
      }
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(this.applyStyles(customStyles));

    const contextInfo = document.createElement('div');
    contextInfo.className = 'context-info';
    contextInfo.textContent = `> ${this.context || 'Welcome to j e l l i c u l e'}`;

    const contentArea = document.createElement('div');
    contentArea.className = 'content-area';
    contentArea.appendChild(document.createElement('slot'));

    this.shadowRoot.appendChild(contextInfo);
    this.shadowRoot.appendChild(contentArea);
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('activity-selected', this._handleActivitySelected);
  }

  disconnectedCallback() {
    document.removeEventListener('activity-selected', this._handleActivitySelected);
  }

  _handleActivitySelected(event) {
    // Update context based on selected activity
    const activity = event.detail.activity;
    if (activity) {
      const label = activity.getAttribute('label') || activity.textContent.trim();
      this.context = `Selected: ${label}`;
    }
  }
}

// For standalone use: customElements.define('main-content', MainContent);
