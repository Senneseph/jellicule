const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Read all component files
const components = [
  'components/layout/ActivityViewport/activity-viewport.js',
  'components/layout/ActivityBar/activity-bar.js',
  'components/layout/Activity/activity.js',
  'components/layout/ActivityResizeButton/activity-resize-button.js',
  'components/layout/MainContent/main-content.js',
  'components/layout/Content/content.js'
];

// Combine all component files into one
let combinedCode = `/**
 * Jellicule UI Components Library
 * Version: 0.1.0
 * Built: ${new Date().toISOString()}
 */

(function(global) {
  'use strict';

  // Component classes
`;

// Add each component's code
components.forEach(componentPath => {
  const code = fs.readFileSync(componentPath, 'utf8');
  
  // Remove export keyword and standalone customElements.define
  const processedCode = code
    .replace(/export\s+class/, 'const')
    .replace(/\/\/\s*For standalone use.*$/, '')
    .trim();
  
  combinedCode += processedCode + '\n\n';
});

// Add the custom element definitions
combinedCode += `
  // Register custom elements
  customElements.define('jellicule-viewport', ActivityViewport);
  customElements.define('jellicule-activity-bar', ActivityBar);
  customElements.define('jellicule-activity', Activity);
  customElements.define('jellicule-activity-resize-button', ActivityResizeButton);
  customElements.define('jellicule-main-content', MainContent);
  customElements.define('jellicule-content', Content);

  // Export to global scope
  global.jellicule = {
    version: '0.1.0',
    ActivityViewport,
    ActivityBar,
    Activity,
    ActivityResizeButton,
    MainContent,
    Content
  };
})(typeof window !== 'undefined' ? window : this);
`;

// Write the combined code to the dist directory
fs.writeFileSync('dist/jellicule.js', combinedCode);

// Create a minified version (not really minified, just a copy for now)
fs.writeFileSync('dist/jellicule.min.js', combinedCode);

console.log('Build completed successfully!');
console.log('Output files:');
console.log('- dist/jellicule.js');
console.log('- dist/jellicule.min.js');
