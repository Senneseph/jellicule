class JelliculeActivity extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.render();
  }

  static get observedAttributes() {
    return ['selected', 'active'];
  }

  get selected() {
    return this.hasAttribute('selected');
  }

  set selected(value) {
    if (value) {
      this.setAttribute('selected', '');
    } else {
      this.removeAttribute('selected');
    }
  }

  get active() {
    return this.hasAttribute('active');
  }

  set active(value) {
    if (value) {
      this.setAttribute('active', '');
    } else {
      this.removeAttribute('active');
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          cursor: pointer;
          user-select: none;
          transition: background-color 0.2s;
        }
        :host(:hover) {
          background-color: #e0e0e0;
        }
        :host([selected]) {
          background-color: #d0d0d0;
        }
        :host([active]) {
          font-weight: bold;
        }
      </style>
      <slot></slot>
    `;
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if ((name === 'selected' || name === 'active') && oldValue !== newValue) {
      this.render();
    }
  }

  connectedCallback() {
    this.addEventListener('click', this._handleClick.bind(this));
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._handleClick.bind(this));
  }

  _handleClick() {
    // Find all sibling activities and deselect them
    const parent = this.parentElement;
    if (parent) {
      const activities = Array.from(parent.querySelectorAll('jellicule-activity'));
      activities.forEach(activity => {
        activity.selected = false;
      });
    }
    
    // Select this activity
    this.selected = true;
    
    // Dispatch a custom event
    this.dispatchEvent(new CustomEvent('activity-selected', {
      bubbles: true,
      composed: true,
      detail: { activity: this }
    }));
  }
}

customElements.define('jellicule-activity', JelliculeActivity);
