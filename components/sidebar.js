class Sidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  static get observedAttributes() {
    return ['position'];
  }

  get position() {
    return this.getAttribute('position') || 'left';
  }

  set position(value) {
    this.setAttribute('position', value);
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          flex-direction: column;
          background-color: #f5f5f5;
          border-right: 1px solid #ddd;
          width: 250px;
          height: 100%;
          overflow-y: auto;
        }
        :host([position="right"]) {
          border-right: none;
          border-left: 1px solid #ddd;
        }
        .sidebar-header {
          padding: 10px;
          border-bottom: 1px solid #ddd;
          font-weight: bold;
        }
        .sidebar-content {
          flex: 1;
          overflow-y: auto;
        }
      </style>
      <div class="sidebar-header">
        <slot name="header">Sidebar</slot>
      </div>
      <div class="sidebar-content">
        <slot></slot>
      </div>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'position' && oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    // Initialize any event listeners or additional setup
  }
}

customElements.define('sidebar', Sidebar);
