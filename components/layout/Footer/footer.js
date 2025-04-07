class Footer extends HTMLElement {
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
          border-top: 1px solid #ddd;
          padding: 10px;
          align-items: center;
          justify-content: space-between;
        }
        .copyright {
          font-size: 0.9em;
          color: #666;
        }
        .links {
          display: flex;
          gap: 15px;
        }
      </style>
      <div class="copyright">
        <slot name="copyright">&copy; 2025 Jellicule</slot>
      </div>
      <div class="links">
        <slot name="links"></slot>
      </div>
    `;
  }

  connectedCallback() {
    // Initialize any event listeners or additional setup
  }
}

customElements.define('footer', Footer);
