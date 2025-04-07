export class ActivityBar extends HTMLElement {
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

// For standalone use: customElements.define('activity-bar', ActivityBar);
