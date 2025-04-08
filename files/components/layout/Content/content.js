import { BaseComponent } from '../../base-component.js';

export class Content extends BaseComponent {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['theme', 'width'];
  }

  get width() {
    return this.getAttribute('width') || 'default';
  }

  render() {
    const customStyles = `
      :host {
        display: block;
        padding: 20px;
        background-color: var(--jc-bg);
        color: var(--jc-text);
        overflow: auto;
        height: 100%;
        box-sizing: border-box;
        position: relative;
      }

      /* Retro grid background */
      :host::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image:
          linear-gradient(rgba(32, 194, 14, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(32, 194, 14, 0.1) 1px, transparent 1px);
        background-size: 20px 20px;
        background-position: -1px -1px;
        pointer-events: none;
        z-index: 0;
        opacity: 0.1;
      }

      .content-container {
        position: relative;
        z-index: 1;
        margin: 0 auto;
        background: var(--jc-bg);
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      /* Width variations */
      :host([width="narrow"]) .content-container {
        max-width: 800px;
      }

      :host([width="default"]) .content-container {
        max-width: 1200px;
      }

      :host([width="wide"]) .content-container {
        max-width: 1600px;
      }

      :host([width="full"]) .content-container {
        max-width: none;
      }
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(this.applyStyles(customStyles));

    const container = document.createElement('div');
    container.className = 'content-container';
    container.appendChild(document.createElement('slot'));

    this.shadowRoot.appendChild(container);
  }
}

// For standalone use: customElements.define('content', Content);
