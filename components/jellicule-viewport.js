class JelliculeViewport extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
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
        }
        ::slotted(jellicule-activity-bar[orientation="top"]) {
          grid-area: top-bar;
        }
        ::slotted(jellicule-activity-bar[orientation="right"]) {
          grid-area: right-bar;
        }
        ::slotted(jellicule-activity-bar[orientation="bottom"]) {
          grid-area: bottom-bar;
        }
        ::slotted(jellicule-activity-bar[orientation="left"]) {
          grid-area: left-bar;
        }
        ::slotted(jellicule-main-content) {
          grid-area: main-content;
        }
      </style>
      <slot></slot>
    `;
  }

  connectedCallback() {
    // Initialize any event listeners or additional setup
  }
}

customElements.define('jellicule-viewport', JelliculeViewport);
