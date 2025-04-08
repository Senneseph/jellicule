/**
 * Component Registry
 * 
 * This file registers all j e l l i c u l e components with the browser.
 * Import this file once in your application to register all components.
 */

// Layout Components
import { ActivityViewport } from './layout/ActivityViewport/activity-viewport.js';
import { ActivityBar } from './layout/ActivityBar/activity-bar.js';
import { Activity } from './layout/Activity/activity.js';
import { ActivityResizeButton } from './layout/ActivityResizeButton/activity-resize-button.js';
import { MainContent } from './layout/MainContent/main-content.js';
import { Content } from './layout/Content/content.js';

// Interface Components
// TODO: Import interface components when implemented

// Forms Components
// TODO: Import forms components when implemented

// Text Components
// TODO: Import text components when implemented

// Register Layout Components
customElements.define('jc-activity-viewport', ActivityViewport);
customElements.define('jc-activity-bar', ActivityBar);
customElements.define('jc-activity', Activity);
customElements.define('jc-activity-resize-button', ActivityResizeButton);
customElements.define('jc-main-content', MainContent);
customElements.define('jc-content', Content);

// Register Interface Components
// TODO: Register interface components when implemented

// Register Forms Components
// TODO: Register forms components when implemented

// Register Text Components
// TODO: Register text components when implemented

// Also register with original names for backward compatibility
customElements.define('activity-viewport', ActivityViewport);
customElements.define('activity-bar', ActivityBar);
customElements.define('activity', Activity);
customElements.define('activity-resize-button', ActivityResizeButton);
customElements.define('main-content', MainContent);
customElements.define('content', Content);

console.log('j e l l i c u l e components registered');
