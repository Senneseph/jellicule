// Import and export components
import { ActivityViewport } from '../components/layout/ActivityViewport/activity-viewport.js';
import { ActivityBar } from '../components/layout/ActivityBar/activity-bar.js';
import { Activity } from '../components/layout/Activity/activity.js';
import { ActivityResizeButton } from '../components/layout/ActivityResizeButton/activity-resize-button.js';
import { MainContent } from '../components/layout/MainContent/main-content.js';
import { Content } from '../components/layout/Content/content.js';

// Re-export components for external use
export { ActivityViewport } from '../components/layout/ActivityViewport/activity-viewport.js';
export { ActivityBar } from '../components/layout/ActivityBar/activity-bar.js';
export { Activity } from '../components/layout/Activity/activity.js';
export { ActivityResizeButton } from '../components/layout/ActivityResizeButton/activity-resize-button.js';
export { MainContent } from '../components/layout/MainContent/main-content.js';
export { Content } from '../components/layout/Content/content.js';

// Initialize custom elements for direct HTML use
customElements.define('jellicule-viewport', ActivityViewport);
customElements.define('jellicule-activity-bar', ActivityBar);
customElements.define('jellicule-activity', Activity);
customElements.define('jellicule-activity-resize-button', ActivityResizeButton);
customElements.define('jellicule-main-content', MainContent);
customElements.define('jellicule-content', Content);

// Version information
export const VERSION = '0.1.0';
