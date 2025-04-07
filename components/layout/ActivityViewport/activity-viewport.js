class ActivityViewport extends HTMLElement {
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
        ::slotted(activity-bar[orientation="top"]), ::slotted(ActivityBar[orientation="top"]) {
          grid-area: top-bar;
        }
        ::slotted(activity-bar[orientation="right"]), ::slotted(ActivityBar[orientation="right"]) {
          grid-area: right-bar;
        }
        ::slotted(activity-bar[orientation="bottom"]), ::slotted(ActivityBar[orientation="bottom"]) {
          grid-area: bottom-bar;
        }
        ::slotted(activity-bar[orientation="left"]), ::slotted(ActivityBar[orientation="left"]) {
          grid-area: left-bar;
        }
        ::slotted(main-content), ::slotted(MainContent) {
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

customElements.define('activity-viewport', ActivityViewport);
