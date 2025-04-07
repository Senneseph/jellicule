export class ActivityResizeButton extends HTMLElement {
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
          align-items: center;
          justify-content: center;
          padding: 4px;
          cursor: col-resize;
          background-color: #e8e8e8;
          border-right: 1px solid #ccc;
          user-select: none;
        }
        :host(:hover) {
          background-color: #d0d0d0;
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
          background-color: #666;
          width: 100%;
        }
      </style>
      <div class="resize-icon">
        <div class="resize-line"></div>
        <div class="resize-line"></div>
        <div class="resize-line"></div>
      </div>
    `;
  }

  connectedCallback() {
    this.addEventListener('mousedown', this._handleMouseDown.bind(this));
  }

  disconnectedCallback() {
    this.removeEventListener('mousedown', this._handleMouseDown.bind(this));
  }

  _handleMouseDown(event) {
    event.preventDefault();
    
    const activityBar = this.closest('activity-bar');
    if (!activityBar) return;
    
    const orientation = activityBar.orientation;
    const isHorizontal = orientation === 'left' || orientation === 'right';
    
    const startPos = isHorizontal ? event.clientX : event.clientY;
    const startSize = isHorizontal ? activityBar.offsetWidth : activityBar.offsetHeight;
    
    const handleMouseMove = (moveEvent) => {
      moveEvent.preventDefault();
      
      const currentPos = isHorizontal ? moveEvent.clientX : moveEvent.clientY;
      const diff = currentPos - startPos;
      
      const newSize = orientation === 'right' || orientation === 'bottom'
        ? startSize - diff
        : startSize + diff;
      
      if (newSize > 30) {
        if (isHorizontal) {
          activityBar.style.width = `${newSize}px`;
        } else {
          activityBar.style.height = `${newSize}px`;
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
}

// For standalone use: customElements.define('activity-resize-button', ActivityResizeButton);
