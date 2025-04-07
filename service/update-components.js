const fs = require('fs');
const path = require('path');

// List of component files to update
const componentFiles = [
  'components/layout/ActivityViewport/activity-viewport.js',
  'components/layout/ActivityBar/activity-bar.js',
  'components/layout/Activity/activity.js',
  'components/layout/ActivityResizeButton/activity-resize-button.js',
  'components/layout/MainContent/main-content.js',
  'components/layout/Content/content.js'
];

// Process each component file
componentFiles.forEach(filePath => {
  console.log(`Processing ${filePath}...`);
  
  // Read the file
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Extract the class name
  const classNameMatch = content.match(/class\s+(\w+)\s+extends\s+HTMLElement/);
  if (!classNameMatch) {
    console.error(`Could not find class name in ${filePath}`);
    return;
  }
  
  const className = classNameMatch[1];
  
  // Extract the custom element name
  const customElementMatch = content.match(/customElements\.define\(['"]([^'"]+)['"]/);
  if (!customElementMatch) {
    console.error(`Could not find custom element name in ${filePath}`);
    return;
  }
  
  const customElementName = customElementMatch[1];
  
  // Create the updated content
  const updatedContent = content
    // Remove the customElements.define line
    .replace(/customElements\.define\([^)]+\);/, '')
    // Add export before the class definition
    .replace(/class\s+(\w+)\s+extends\s+HTMLElement/, 'export class $1 extends HTMLElement')
    // Add the customElements.define as a comment for reference
    .trim() + `\n\n// For standalone use: customElements.define('${customElementName}', ${className});\n`;
  
  // Write the updated content back to the file
  fs.writeFileSync(filePath, updatedContent);
  
  console.log(`Updated ${filePath}`);
});

console.log('All component files updated successfully!');
