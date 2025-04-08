import { BaseComponent } from '../../base-component.js';

export class Activity extends BaseComponent {
  constructor() {
    super();
    this._handleClick = this._handleClick.bind(this);
  }

  static get observedAttributes() {
    return ['selected', 'active', 'theme', 'icon', 'label'];
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

  get icon() {
    return this.getAttribute('icon') || '';
  }

  get label() {
    return this.getAttribute('label') || this.textContent || '';
  }

  render() {
    const customStyles = `
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 8px;
        cursor: pointer;
        user-select: none;
        transition: all 0.2s ease;
        position: relative;
        color: var(--jc-text);
        border-radius: 4px;
        margin: 2px;
      }

      /* Hover effect with retro glow */
      :host(:hover) {
        background-color: var(--jc-primary);
        color: var(--jc-secondary);
        box-shadow: 0 0 5px var(--jc-primary);
      }

      /* Selected state with chrome effect */
      :host([selected]) {
        background: var(--jc-chrome);
        color: var(--jc-secondary);
        font-weight: bold;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      }

      :host([active]) {
        font-weight: bold;
        text-decoration: underline;
      }

      .activity-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
      }

      .icon {
        font-size: 1.5em;
        margin-bottom: 4px;
      }

      .label {
        font-size: 0.8em;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }

      /* Parent orientation affects layout */
      :host-context(activity-bar[orientation="left"]), :host-context(activity-bar[orientation="right"]),
      :host-context(jc-activity-bar[orientation="left"]), :host-context(jc-activity-bar[orientation="right"]) {
        width: 100%;
      }

      :host-context(activity-bar[orientation="top"]), :host-context(activity-bar[orientation="bottom"]),
      :host-context(jc-activity-bar[orientation="top"]), :host-context(jc-activity-bar[orientation="bottom"]) {
        height: 100%;
      }

      /* Expanded state shows labels */
      :host-context(activity-bar[data-expanded="true"]), :host-context(jc-activity-bar[data-expanded="true"]) {
        justify-content: flex-start;
      }

      :host-context(activity-bar[data-expanded="true"]) .activity-content,
      :host-context(jc-activity-bar[data-expanded="true"]) .activity-content {
        flex-direction: row;
      }

      :host-context(activity-bar[data-expanded="true"]) .icon,
      :host-context(jc-activity-bar[data-expanded="true"]) .icon {
        margin-right: 8px;
        margin-bottom: 0;
      }
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(this.applyStyles(customStyles));

    const content = document.createElement('div');
    content.className = 'activity-content';

    // Add icon if specified
    const iconElement = document.createElement('div');
    iconElement.className = 'icon';
    iconElement.textContent = this.icon;
    content.appendChild(iconElement);

    // Add label
    const labelElement = document.createElement('div');
    labelElement.className = 'label';
    labelElement.textContent = this.label;
    content.appendChild(labelElement);

    this.shadowRoot.appendChild(content);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('click', this._handleClick);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this._handleClick);
  }

  _handleClick() {
    // Find all sibling activities and deselect them
    const parent = this.parentElement;
    if (parent) {
      const activities = Array.from(parent.querySelectorAll('activity, jc-activity'));
      activities.forEach(activity => {
        if (activity !== this) {
          activity.selected = false;
        }
      });
    }

    // Select this activity
    this.selected = true;

    // Dispatch a custom event
    this.dispatchCustomEvent('activity-selected', { activity: this });
  }
}

// For standalone use: customElements.define('activity', Activity);
