import { BaseComponent } from '../../base-component.js';

export class ActivityBar extends BaseComponent {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['orientation', 'theme', 'data-expanded'];
  }

  get orientation() {
    // Map legacy orientation values to cardinal directions
    const orientationMap = {
      'top': 'north',
      'right': 'east',
      'bottom': 'south',
      'left': 'west'
    };

    const value = this.getAttribute('orientation') || 'west';
    return orientationMap[value] || value;
  }

  set orientation(value) {
    // Allow both legacy and cardinal direction values
    this.setAttribute('orientation', value);
  }

  /**
   * Get the legacy orientation value (for backward compatibility)
   * @returns {string} The legacy orientation value
   */
  get legacyOrientation() {
    const cardinalMap = {
      'north': 'top',
      'east': 'right',
      'south': 'bottom',
      'west': 'left'
    };

    return cardinalMap[this.orientation] || this.orientation;
  }

  render() {
    const customStyles = `
      :host {
        display: flex;
        background: var(--jc-chrome);
        border: 1px solid var(--jc-border);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        position: relative;
        overflow: hidden;
        transition: width 0.3s ease, height 0.3s ease, transform 0.3s ease;
      }

      /* Retro scanlines effect */
      :host::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
        background-size: 100% 4px;
        pointer-events: none;
        z-index: 2;
        opacity: 0.15;
      }

      /* Horizontal bars (North/South) */
      :host([orientation="north"]), :host([orientation="top"]),
      :host([orientation="south"]), :host([orientation="bottom"]) {
        flex-direction: row;
        width: 100%;
        height: 48px;
      }

      /* Vertical bars (East/West) */
      :host([orientation="west"]), :host([orientation="left"]),
      :host([orientation="east"]), :host([orientation="right"]) {
        flex-direction: column;
        height: 100%;
        width: 48px;
      }

      /* Expanded state - Vertical bars */
      :host([data-expanded="true"][orientation="west"]), :host([data-expanded="true"][orientation="left"]),
      :host([data-expanded="true"][orientation="east"]), :host([data-expanded="true"][orientation="right"]) {
        width: 200px;
      }

      /* Expanded state - Horizontal bars */
      :host([data-expanded="true"][orientation="north"]), :host([data-expanded="true"][orientation="top"]),
      :host([data-expanded="true"][orientation="south"]), :host([data-expanded="true"][orientation="bottom"]) {
        height: 200px;
      }

      /* Visual indicator for expanded state */
      :host([data-expanded="true"]) {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      }

      /* Visual indicator for available activity bars */
      :host::before {
        content: '';
        position: absolute;
        background-color: var(--jc-primary);
        opacity: 0.5;
        transition: opacity 0.3s ease;
      }

      /* West indicator */
      :host([orientation="west"])::before, :host([orientation="left"])::before {
        top: 0;
        left: 0;
        width: 3px;
        height: 100%;
      }

      /* East indicator */
      :host([orientation="east"])::before, :host([orientation="right"])::before {
        top: 0;
        right: 0;
        width: 3px;
        height: 100%;
      }

      /* North indicator */
      :host([orientation="north"])::before, :host([orientation="top"])::before {
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
      }

      /* South indicator */
      :host([orientation="south"])::before, :host([orientation="bottom"])::before {
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
      }

      :host(:hover)::before {
        opacity: 1;
      }

      .activity-container {
        display: flex;
        flex-direction: inherit;
        flex: 1;
        padding: 4px;
        z-index: 1;
      }

      /* Transition for smooth expansion/collapse */
      :host {
        transition: width 0.3s ease, height 0.3s ease;
      }

      /* Mobile styles */
      @media (max-width: 768px) {
        :host([orientation="top"]) {
          position: fixed;
          top: 0;
          left: 0;
          width: 80%;
          height: 100%;
          flex-direction: column;
          z-index: 99;
        }
      }
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(this.applyStyles(customStyles));

    const container = document.createElement('div');
    container.className = 'activity-container';
    container.appendChild(document.createElement('slot'));

    this.shadowRoot.appendChild(container);
  }
}

// For standalone use: customElements.define('activity-bar', ActivityBar);
