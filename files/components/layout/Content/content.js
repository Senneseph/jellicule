export class Content extends HTMLElement {
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

// For standalone use: customElements.define('content', Content);
