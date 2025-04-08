import { BaseComponent } from '../../base-component.js';

export class ActivityViewport extends BaseComponent {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['theme'];
  }

  render() {
    const customStyles = `
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
        background-color: var(--jc-bg);
        color: var(--jc-text);
        position: relative;
      }

      /* Grid background for retro effect */
      :host::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 0;
        pointer-events: none;
        opacity: 0.05;
        background-image:
          linear-gradient(rgba(32, 194, 14, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(32, 194, 14, 0.3) 1px, transparent 1px);
        background-size: 20px 20px;
        background-position: -1px -1px;
      }

      ::slotted(activity-bar[orientation="top"]), ::slotted(jc-activity-bar[orientation="top"]) {
        grid-area: top-bar;
      }
      ::slotted(activity-bar[orientation="right"]), ::slotted(jc-activity-bar[orientation="right"]) {
        grid-area: right-bar;
      }
      ::slotted(activity-bar[orientation="bottom"]), ::slotted(jc-activity-bar[orientation="bottom"]) {
        grid-area: bottom-bar;
      }
      ::slotted(activity-bar[orientation="left"]), ::slotted(jc-activity-bar[orientation="left"]) {
        grid-area: left-bar;
      }
      ::slotted(main-content), ::slotted(jc-main-content) {
        grid-area: main-content;
        z-index: 1;
      }

      /* Hamburger menu for mobile */
      .hamburger-menu {
        position: absolute;
        top: 10px;
        left: 10px;
        width: 30px;
        height: 30px;
        background: var(--jc-chrome);
        border: 1px solid var(--jc-border);
        border-radius: 4px;
        z-index: 100;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        padding: 5px;
      }

      .hamburger-menu span {
        display: block;
        width: 20px;
        height: 2px;
        background-color: var(--jc-secondary);
        margin: 2px 0;
        transition: all 0.3s ease;
      }

      @media (max-width: 768px) {
        :host {
          grid-template-areas:
            "main-content main-content main-content"
            "main-content main-content main-content"
            "main-content main-content main-content";
        }

        ::slotted(activity-bar), ::slotted(jc-activity-bar) {
          position: fixed !important;
          z-index: 99;
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }

        ::slotted(activity-bar[data-expanded="true"]), ::slotted(jc-activity-bar[data-expanded="true"]) {
          transform: translateX(0);
        }
      }
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(this.applyStyles(customStyles));

    // Add hamburger menu for mobile
    const hamburgerMenu = document.createElement('div');
    hamburgerMenu.className = 'hamburger-menu';
    hamburgerMenu.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;
    hamburgerMenu.addEventListener('click', this._toggleActivityBar.bind(this));

    this.shadowRoot.appendChild(hamburgerMenu);
    this.shadowRoot.appendChild(document.createElement('slot'));
  }

  _toggleActivityBar() {
    // Find the top activity bar
    const topBar = this.querySelector('activity-bar[orientation="top"], jc-activity-bar[orientation="top"]');
    if (topBar) {
      const isExpanded = topBar.getAttribute('data-expanded') === 'true';
      topBar.setAttribute('data-expanded', !isExpanded);
    }
  }
}

// For standalone use: customElements.define('activity-viewport', ActivityViewport);
