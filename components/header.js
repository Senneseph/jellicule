class Header extends HTMLElement {
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
          background-color: #f0f0f0;
          border-bottom: 1px solid #ddd;
          padding: 10px;
          align-items: center;
          justify-content: space-between;
        }
        .title {
          font-weight: bold;
          font-size: 1.2em;
        }
        .actions {
          display: flex;
          gap: 10px;
        }
      </style>
      <div class="title">
        <slot name="title">Header</slot>
      </div>
      <div class="actions">
        <slot name="actions"></slot>
      </div>
    `;
  }

  connectedCallback() {
    // Initialize any event listeners or additional setup
  }
}

customElements.define('header', Header);
