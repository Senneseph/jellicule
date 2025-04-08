import { BaseComponent } from '../../base-component.js';

export class ActivityViewport extends BaseComponent {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ['theme'];
  }

  render() {
    const customStyles = `
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
        background-color: var(--jc-bg);
        color: var(--jc-text);
        position: relative;
      }

      /* Grid background for retro effect */
      :host::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 0;
        pointer-events: none;
        opacity: 0.05;
        background-image:
          linear-gradient(rgba(32, 194, 14, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(32, 194, 14, 0.3) 1px, transparent 1px);
        background-size: 20px 20px;
        background-position: -1px -1px;
      }

      ::slotted(activity-bar[orientation="top"]), ::slotted(jc-activity-bar[orientation="top"]) {
        grid-area: top-bar;
      }
      ::slotted(activity-bar[orientation="right"]), ::slotted(jc-activity-bar[orientation="right"]) {
        grid-area: right-bar;
      }
      ::slotted(activity-bar[orientation="bottom"]), ::slotted(jc-activity-bar[orientation="bottom"]) {
        grid-area: bottom-bar;
      }
      ::slotted(activity-bar[orientation="left"]), ::slotted(jc-activity-bar[orientation="left"]) {
        grid-area: left-bar;
      }
      ::slotted(main-content), ::slotted(jc-main-content) {
        grid-area: main-content;
        z-index: 1;
      }

      /* Hamburger menu for mobile */
      /* Navigation controls container */
      .nav-controls {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 100;
        display: flex;
        gap: 5px;
      }

      /* Base styles for all toggles */
      .hamburger-menu, .bar-toggle {
        width: 30px;
        height: 30px;
        background: var(--jc-chrome);
        border: 1px solid var(--jc-border);
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        transition: all 0.2s ease;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .hamburger-menu:hover, .bar-toggle:hover {
        background-color: var(--jc-primary);
        box-shadow: 0 0 5px var(--jc-primary);
      }

      /* Hamburger menu specific styles */
      .hamburger-menu {
        flex-direction: column;
        padding: 5px;
      }

      .hamburger-menu span {
        display: block;
        width: 20px;
        height: 2px;
        background-color: var(--jc-secondary);
        margin: 2px 0;
        transition: all 0.3s ease;
      }

      /* Bar toggle specific styles */
      .bar-toggle {
        font-size: 14px;
        color: var(--jc-secondary);
      }

      /* Position toggles based on orientation */
      .top-toggle {
        position: absolute;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
      }

      .right-toggle {
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translateY(-50%);
      }

      .bottom-toggle {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
      }

      /* Active state for toggles */
      .hamburger-menu.active, .bar-toggle.active {
        background-color: var(--jc-secondary);
        color: var(--jc-primary);
      }

      .hamburger-menu.active span {
        background-color: var(--jc-primary);
      }

      /* Activity bar expansion styles */
      ::slotted(activity-bar), ::slotted(jc-activity-bar) {
        transition: width 0.3s ease, height 0.3s ease;
        overflow: hidden;
      }

      /* Expanded state indicators */
      ::slotted(activity-bar[data-expanded="true"]), ::slotted(jc-activity-bar[data-expanded="true"]) {
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
      }

      /* Hover indicators for activity bars */
      ::slotted(activity-bar:hover), ::slotted(jc-activity-bar:hover) {
        box-shadow: 0 0 5px var(--jc-primary);
      }

      /* Mobile styles */
      @media (max-width: 768px) {
        :host {
          grid-template-areas:
            "main-content main-content main-content"
            "main-content main-content main-content"
            "main-content main-content main-content";
        }

        /* Off-canvas menu for mobile */
        ::slotted(activity-bar), ::slotted(jc-activity-bar) {
          position: fixed !important;
          z-index: 99;
          transition: transform 0.3s ease;
        }

        /* Common styles for all activity bars */
        ::slotted(activity-bar), ::slotted(jc-activity-bar) {
          transition: transform 0.3s ease, width 0.3s ease, height 0.3s ease;
          position: absolute;
        }

        /* Position each activity bar off-screen based on orientation - West/Left */
        ::slotted(activity-bar[orientation="west"]), ::slotted(jc-activity-bar[orientation="west"]),
        ::slotted(activity-bar[orientation="left"]), ::slotted(jc-activity-bar[orientation="left"]) {
          transform: translateX(-100%);
          top: 0;
          left: 0;
          height: 100% !important;
        }

        /* Position each activity bar off-screen based on orientation - East/Right */
        ::slotted(activity-bar[orientation="east"]), ::slotted(jc-activity-bar[orientation="east"]),
        ::slotted(activity-bar[orientation="right"]), ::slotted(jc-activity-bar[orientation="right"]) {
          transform: translateX(100%);
          top: 0;
          right: 0;
          height: 100% !important;
        }

        /* Position each activity bar off-screen based on orientation - North/Top */
        ::slotted(activity-bar[orientation="north"]), ::slotted(jc-activity-bar[orientation="north"]),
        ::slotted(activity-bar[orientation="top"]), ::slotted(jc-activity-bar[orientation="top"]) {
          transform: translateY(-100%);
          top: 0;
          left: 0;
          width: 100% !important;
        }

        /* Position each activity bar off-screen based on orientation - South/Bottom */
        ::slotted(activity-bar[orientation="south"]), ::slotted(jc-activity-bar[orientation="south"]),
        ::slotted(activity-bar[orientation="bottom"]), ::slotted(jc-activity-bar[orientation="bottom"]) {
          transform: translateY(100%);
          bottom: 0;
          left: 0;
          width: 100% !important;
        }

        /* Bring activity bars on-screen when expanded - West/Left */
        ::slotted(activity-bar[orientation="west"][data-expanded="true"]),
        ::slotted(jc-activity-bar[orientation="west"][data-expanded="true"]),
        ::slotted(activity-bar[orientation="left"][data-expanded="true"]),
        ::slotted(jc-activity-bar[orientation="left"][data-expanded="true"]) {
          transform: translateX(0);
        }

        /* Bring activity bars on-screen when expanded - East/Right */
        ::slotted(activity-bar[orientation="east"][data-expanded="true"]),
        ::slotted(jc-activity-bar[orientation="east"][data-expanded="true"]),
        ::slotted(activity-bar[orientation="right"][data-expanded="true"]),
        ::slotted(jc-activity-bar[orientation="right"][data-expanded="true"]) {
          transform: translateX(0);
        }

        /* Bring activity bars on-screen when expanded - North/Top */
        ::slotted(activity-bar[orientation="north"][data-expanded="true"]),
        ::slotted(jc-activity-bar[orientation="north"][data-expanded="true"]),
        ::slotted(activity-bar[orientation="top"][data-expanded="true"]),
        ::slotted(jc-activity-bar[orientation="top"][data-expanded="true"]) {
          transform: translateY(0);
        }

        /* Bring activity bars on-screen when expanded - South/Bottom */
        ::slotted(activity-bar[orientation="south"][data-expanded="true"]),
        ::slotted(jc-activity-bar[orientation="south"][data-expanded="true"]),
        ::slotted(activity-bar[orientation="bottom"][data-expanded="true"]),
        ::slotted(jc-activity-bar[orientation="bottom"][data-expanded="true"]) {
          transform: translateY(0);
        }
      }
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(this.applyStyles(customStyles));

    // Create navigation controls
    const navControls = document.createElement('div');
    navControls.className = 'nav-controls';

    // Add hamburger menu for west activity bar
    const hamburgerMenu = document.createElement('div');
    hamburgerMenu.className = 'hamburger-menu';
    hamburgerMenu.setAttribute('title', 'Toggle West Menu');
    hamburgerMenu.innerHTML = `
      <span></span>
      <span></span>
      <span></span>
    `;
    hamburgerMenu.addEventListener('click', () => this.toggleActivityBarByOrientation('west'));
    navControls.appendChild(hamburgerMenu);

    // Add controls for other activity bars
    const createBarToggle = (orientation, symbol, title) => {
      const toggle = document.createElement('div');
      toggle.className = `bar-toggle ${orientation}-toggle`;
      toggle.setAttribute('title', title);
      toggle.textContent = symbol;
      toggle.addEventListener('click', () => this.toggleActivityBarByOrientation(orientation));
      return toggle;
    };

    // Add toggles for each orientation using cardinal directions
    navControls.appendChild(createBarToggle('north', '▲', 'Toggle North Menu'));
    navControls.appendChild(createBarToggle('east', '▶', 'Toggle East Menu'));
    navControls.appendChild(createBarToggle('south', '▼', 'Toggle South Menu'));

    this.shadowRoot.appendChild(navControls);
    this.shadowRoot.appendChild(document.createElement('slot'));
  }

  _toggleActivityBar(event) {
    // By default, toggle the west activity bar
    const orientation = event?.detail?.orientation || 'west';

    // Support both cardinal and legacy orientations
    const orientations = [orientation];

    // Add legacy orientation if using cardinal direction
    if (['north', 'east', 'south', 'west'].includes(orientation)) {
      const legacyMap = {
        'north': 'top',
        'east': 'right',
        'south': 'bottom',
        'west': 'left'
      };
      orientations.push(legacyMap[orientation]);
    } else if (['top', 'right', 'bottom', 'left'].includes(orientation)) {
      // Add cardinal direction if using legacy orientation
      const cardinalMap = {
        'top': 'north',
        'right': 'east',
        'bottom': 'south',
        'left': 'west'
      };
      orientations.push(cardinalMap[orientation]);
    }

    // Find the activity bar with the specified orientation (try both cardinal and legacy)
    let activityBar = null;
    for (const orient of orientations) {
      activityBar = this.querySelector(`activity-bar[orientation="${orient}"], jc-activity-bar[orientation="${orient}"]`);
      if (activityBar) break;
    }

    if (activityBar) {
      const isExpanded = activityBar.getAttribute('data-expanded') === 'true';
      activityBar.setAttribute('data-expanded', !isExpanded);

      // Dispatch an event to notify that an activity bar was toggled
      this.dispatchCustomEvent('activity-bar-toggled', {
        orientation,
        expanded: !isExpanded
      });
    }
  }

  /**
   * Toggle a specific activity bar by orientation
   * @param {string} orientation - The orientation of the activity bar to toggle ('top', 'right', 'bottom', 'left')
   */
  toggleActivityBarByOrientation(orientation) {
    this._toggleActivityBar({ detail: { orientation } });
  }

  connectedCallback() {
    super.connectedCallback();

    // Listen for activity bar state changes
    this.addEventListener('activity-bar-state-changed', this._handleActivityBarStateChange.bind(this));
    this.addEventListener('activity-bar-toggled', this._handleActivityBarStateChange.bind(this));

    // Check initial state of activity bars
    this._checkActivityBarStates();
  }

  disconnectedCallback() {
    this.removeEventListener('activity-bar-state-changed', this._handleActivityBarStateChange.bind(this));
    this.removeEventListener('activity-bar-toggled', this._handleActivityBarStateChange.bind(this));
  }

  /**
   * Check the initial state of all activity bars
   */
  _checkActivityBarStates() {
    // Check both cardinal and legacy orientations
    const orientations = [
      { cardinal: 'west', legacy: 'left' },
      { cardinal: 'east', legacy: 'right' },
      { cardinal: 'north', legacy: 'top' },
      { cardinal: 'south', legacy: 'bottom' }
    ];

    orientations.forEach(({ cardinal, legacy }) => {
      // Try both cardinal and legacy selectors
      const selector = `
        activity-bar[orientation="${cardinal}"], jc-activity-bar[orientation="${cardinal}"],
        activity-bar[orientation="${legacy}"], jc-activity-bar[orientation="${legacy}"]
      `;

      const activityBar = this.querySelector(selector);
      if (activityBar) {
        const isExpanded = activityBar.getAttribute('data-expanded') === 'true';

        // Update the toggle button state for both cardinal and legacy
        [cardinal, legacy].forEach(orient => {
          const toggleButton = this.shadowRoot.querySelector(`.${orient}-toggle`);
          if (toggleButton && isExpanded) {
            toggleButton.classList.add('active');
          }
        });

        // Update hamburger menu for west/left orientation
        if ((cardinal === 'west' || legacy === 'left') && isExpanded) {
          const hamburgerMenu = this.shadowRoot.querySelector('.hamburger-menu');
          if (hamburgerMenu) {
            hamburgerMenu.classList.add('active');
          }
        }
      }
    });
  }

  /**
   * Handle activity bar state changes
   * @param {CustomEvent} event - The event object
   */
  _handleActivityBarStateChange(event) {
    const { orientation, expanded } = event.detail;

    // Map between cardinal and legacy orientations
    const orientationMap = {
      'north': 'top', 'top': 'north',
      'east': 'right', 'right': 'east',
      'south': 'bottom', 'bottom': 'south',
      'west': 'left', 'left': 'west'
    };

    // Get both cardinal and legacy orientations
    const orientations = [orientation];
    if (orientationMap[orientation]) {
      orientations.push(orientationMap[orientation]);
    }

    // Update the toggle button state for both orientations
    orientations.forEach(orient => {
      const toggleButton = this.shadowRoot.querySelector(`.${orient}-toggle`);
      if (toggleButton) {
        if (expanded) {
          toggleButton.classList.add('active');
        } else {
          toggleButton.classList.remove('active');
        }
      }
    });

    // Update the hamburger menu state for west/left orientation
    if (orientation === 'west' || orientation === 'left') {
      const hamburgerMenu = this.shadowRoot.querySelector('.hamburger-menu');
      if (hamburgerMenu) {
        if (expanded) {
          hamburgerMenu.classList.add('active');
        } else {
          hamburgerMenu.classList.remove('active');
        }
      }
    }
  }
}

// For standalone use: customElements.define('activity-viewport', ActivityViewport);
