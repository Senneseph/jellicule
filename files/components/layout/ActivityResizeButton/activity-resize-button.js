import { BaseComponent } from '../../base-component.js';

export class ActivityResizeButton extends BaseComponent {
  constructor() {
    super();
    this._handleMouseDown = this._handleMouseDown.bind(this);
  }

  static get observedAttributes() {
    return ['theme'];
  }

  render() {
    const customStyles = `
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 4px;
        cursor: col-resize;
        background: var(--jc-chrome);
        border: 1px solid var(--jc-border);
        user-select: none;
        position: relative;
        z-index: 10;
      }

      :host(:hover) {
        background-color: var(--jc-primary);
      }

      :host(:active) {
        background-color: var(--jc-secondary);
      }

      .resize-icon {
        width: 12px;
        height: 12px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      .resize-line {
        height: 2px;
        background-color: var(--jc-text);
        width: 100%;
        border-radius: 1px;
      }

      /* Orientation-specific styles */
      :host-context(activity-bar[orientation="left"]), :host-context(jc-activity-bar[orientation="left"]),
      :host-context(activity-bar[orientation="right"]), :host-context(jc-activity-bar[orientation="right"]) {
        cursor: col-resize;
        width: 8px;
        height: 40px;
      }

      :host-context(activity-bar[orientation="top"]), :host-context(jc-activity-bar[orientation="top"]),
      :host-context(activity-bar[orientation="bottom"]), :host-context(jc-activity-bar[orientation="bottom"]) {
        cursor: row-resize;
        height: 8px;
        width: 40px;
      }

      :host-context(activity-bar[orientation="top"]) .resize-icon, :host-context(jc-activity-bar[orientation="top"]) .resize-icon,
      :host-context(activity-bar[orientation="bottom"]) .resize-icon, :host-context(jc-activity-bar[orientation="bottom"]) .resize-icon {
        flex-direction: row;
        width: 24px;
        height: 12px;
      }

      :host-context(activity-bar[orientation="top"]) .resize-line, :host-context(jc-activity-bar[orientation="top"]) .resize-line,
      :host-context(activity-bar[orientation="bottom"]) .resize-line, :host-context(jc-activity-bar[orientation="bottom"]) .resize-line {
        width: 2px;
        height: 100%;
      }

      /* Retro glow effect on hover */
      :host(:hover) .resize-line {
        box-shadow: 0 0 3px var(--jc-primary);
      }
    `;

    this.shadowRoot.innerHTML = '';
    this.shadowRoot.appendChild(this.applyStyles(customStyles));

    const resizeIcon = document.createElement('div');
    resizeIcon.className = 'resize-icon';

    for (let i = 0; i < 3; i++) {
      const resizeLine = document.createElement('div');
      resizeLine.className = 'resize-line';
      resizeIcon.appendChild(resizeLine);
    }

    this.shadowRoot.appendChild(resizeIcon);
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('mousedown', this._handleMouseDown);
    this.addEventListener('touchstart', this._handleTouchStart);
  }

  disconnectedCallback() {
    this.removeEventListener('mousedown', this._handleMouseDown);
    this.removeEventListener('touchstart', this._handleTouchStart);
  }

  _handleMouseDown(event) {
    event.preventDefault();

    const activityBar = this.closest('activity-bar, jc-activity-bar');
    if (!activityBar) return;

    const orientation = activityBar.getAttribute('orientation') || 'west';
    const isHorizontal = ['west', 'east', 'left', 'right'].includes(orientation);

    const startPos = isHorizontal ? event.clientX : event.clientY;
    const startSize = isHorizontal ? activityBar.offsetWidth : activityBar.offsetHeight;

    const handleMouseMove = (moveEvent) => {
      moveEvent.preventDefault();

      const currentPos = isHorizontal ? moveEvent.clientX : moveEvent.clientY;
      const diff = currentPos - startPos;

      // Calculate new size based on orientation
      let newSize;
      if (['east', 'right', 'south', 'bottom'].includes(orientation)) {
        newSize = startSize - diff;
      } else {
        newSize = startSize + diff;
      }

      if (newSize > 40 && newSize < 400) {
        if (isHorizontal) {
          activityBar.style.width = `${newSize}px`;
        } else {
          activityBar.style.height = `${newSize}px`;
        }

        // Toggle expanded state based on size
        const expandedThreshold = isHorizontal ? 100 : 80;
        if (newSize > expandedThreshold) {
          activityBar.setAttribute('data-expanded', 'true');
        } else {
          activityBar.removeAttribute('data-expanded');
        }

        // Dispatch resize event with expanded state
        this.dispatchCustomEvent('activity-bar-resized', {
          orientation,
          size: newSize,
          expanded: newSize > expandedThreshold
        });

        // Update toggle button states in the viewport
        const viewport = activityBar.closest('activity-viewport, jc-activity-viewport');
        if (viewport) {
          const event = new CustomEvent('activity-bar-state-changed', {
            bubbles: true,
            composed: true,
            detail: {
              orientation,
              expanded: newSize > expandedThreshold
            }
          });
          viewport.dispatchEvent(event);
        }
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }

  _handleTouchStart(event) {
    event.preventDefault();

    const activityBar = this.closest('activity-bar, jc-activity-bar');
    if (!activityBar) return;

    const orientation = activityBar.getAttribute('orientation') || 'west';
    const isHorizontal = ['west', 'east', 'left', 'right'].includes(orientation);

    const touch = event.touches[0];
    const startPos = isHorizontal ? touch.clientX : touch.clientY;
    const startSize = isHorizontal ? activityBar.offsetWidth : activityBar.offsetHeight;

    const handleTouchMove = (moveEvent) => {
      moveEvent.preventDefault();

      const touch = moveEvent.touches[0];
      const currentPos = isHorizontal ? touch.clientX : touch.clientY;
      const diff = currentPos - startPos;

      // Calculate new size based on orientation
      let newSize;
      if (['east', 'right', 'south', 'bottom'].includes(orientation)) {
        newSize = startSize - diff;
      } else {
        newSize = startSize + diff;
      }

      if (newSize > 40 && newSize < 400) {
        if (isHorizontal) {
          activityBar.style.width = `${newSize}px`;
        } else {
          activityBar.style.height = `${newSize}px`;
        }

        // Toggle expanded state based on size
        const expandedThreshold = isHorizontal ? 100 : 80;
        if (newSize > expandedThreshold) {
          activityBar.setAttribute('data-expanded', 'true');
        } else {
          activityBar.removeAttribute('data-expanded');
        }

        // Dispatch resize event with expanded state
        this.dispatchCustomEvent('activity-bar-resized', {
          orientation,
          size: newSize,
          expanded: newSize > expandedThreshold
        });

        // Update toggle button states in the viewport
        const viewport = activityBar.closest('activity-viewport, jc-activity-viewport');
        if (viewport) {
          const event = new CustomEvent('activity-bar-state-changed', {
            bubbles: true,
            composed: true,
            detail: {
              orientation,
              expanded: newSize > expandedThreshold
            }
          });
          viewport.dispatchEvent(event);
        }
      }
    };

    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }
}

// For standalone use: customElements.define('activity-resize-button', ActivityResizeButton);
