/**
 * Build script for j e l l i c u l e components
 * 
 * This script bundles all components into a single file for distribution.
 */

const fs = require('fs');
const path = require('path');

// Create dist directory if it doesn't exist
const distDir = path.join(__dirname, '..', 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Bundle all components
const outputFile = path.join(distDir, 'jellicule.min.js');

// Start with the base component
const baseComponentPath = path.join(__dirname, 'components', 'base-component.js');
let bundleContent = fs.readFileSync(baseComponentPath, 'utf8');

// Add all component files
const componentsDir = path.join(__dirname, 'components');
const componentTypes = ['layout', 'interface', 'forms', 'text'];

componentTypes.forEach(type => {
  const typeDir = path.join(componentsDir, type);
  if (fs.existsSync(typeDir)) {
    const components = fs.readdirSync(typeDir);
    components.forEach(component => {
      const componentDir = path.join(typeDir, component);
      if (fs.statSync(componentDir).isDirectory()) {
        const jsFile = fs.readdirSync(componentDir).find(file => file.endsWith('.js'));
        if (jsFile) {
          const componentPath = path.join(componentDir, jsFile);
          let componentContent = fs.readFileSync(componentPath, 'utf8');
          
          // Remove imports from component content
          componentContent = componentContent.replace(/import.*?from.*?;/g, '');
          
          // Add to bundle
          bundleContent += '\n\n' + componentContent;
        }
      }
    });
  }
});

// Add component registry
const registryPath = path.join(componentsDir, 'component-registry.js');
let registryContent = fs.readFileSync(registryPath, 'utf8');

// Remove imports from registry content
registryContent = registryContent.replace(/import.*?from.*?;/g, '');

// Add to bundle
bundleContent += '\n\n' + registryContent;

// Write bundle to file
fs.writeFileSync(outputFile, bundleContent);

console.log(`Bundle created at ${outputFile}`);

// Create a minified version (simple minification)
let minifiedContent = bundleContent
  .replace(/\/\*\*[\s\S]*?\*\//g, '') // Remove multiline comments
  .replace(/\/\/.*$/gm, '') // Remove single line comments
  .replace(/\s+/g, ' ') // Replace multiple spaces with a single space
  .replace(/\s*{\s*/g, '{') // Remove spaces around braces
  .replace(/\s*}\s*/g, '}') // Remove spaces around braces
  .replace(/\s*:\s*/g, ':') // Remove spaces around colons
  .replace(/\s*;\s*/g, ';') // Remove spaces around semicolons
  .replace(/\s*,\s*/g, ',') // Remove spaces around commas
  .trim();

const minOutputFile = path.join(distDir, 'jellicule.min.js');
fs.writeFileSync(minOutputFile, minifiedContent);

console.log(`Minified bundle created at ${minOutputFile}`);

// Copy to pwa-service/dist
const pwaDistDir = path.join(__dirname, '..', 'pwa-service', 'dist');
if (!fs.existsSync(pwaDistDir)) {
  fs.mkdirSync(pwaDistDir, { recursive: true });
}

fs.copyFileSync(minOutputFile, path.join(pwaDistDir, 'jellicule.min.js'));
console.log(`Copied to ${path.join(pwaDistDir, 'jellicule.min.js')}`);

// Create a CSS file with variables
const cssContent = `
/* j e l l i c u l e CSS Variables */
:root {
  /* Colors */
  --jc-primary: #f5d76e;
  --jc-secondary: #4a235a;
  --jc-bg-light: #f8f9fa;
  --jc-bg-dark: #121212;
  --jc-text-light: #212529;
  --jc-text-dark: #f8f9fa;
  --jc-grid: #20c20e;
  
  /* Theme-specific variables */
  --jc-bg: var(--jc-bg-light);
  --jc-text: var(--jc-text-light);
  --jc-border: rgba(0, 0, 0, 0.125);
  
  /* Chrome effect */
  --jc-chrome: linear-gradient(135deg, #c0c0c0, #f0f0f0, #c0c0c0);
}

/* Dark theme */
[data-theme="dark"] {
  --jc-bg: var(--jc-bg-dark);
  --jc-text: var(--jc-text-dark);
  --jc-border: rgba(255, 255, 255, 0.125);
}

/* Global styles */
body {
  margin: 0;
  padding: 0;
  font-family: monospace;
  background-color: var(--jc-bg);
  color: var(--jc-text);
}

/* Utility classes */
.wireframe-bg {
  background-color: var(--jc-bg);
  background-image: 
    linear-gradient(var(--jc-grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--jc-grid) 1px, transparent 1px);
  background-size: 20px 20px;
  background-position: -1px -1px;
  opacity: 0.1;
}

.chrome {
  background: var(--jc-chrome);
  border: 1px solid var(--jc-border);
  border-radius: 4px;
}
`;

const cssOutputFile = path.join(distDir, 'jellicule.css');
fs.writeFileSync(cssOutputFile, cssContent);
console.log(`CSS file created at ${cssOutputFile}`);

// Copy to pwa-service/styles
const pwaStylesDir = path.join(__dirname, '..', 'pwa-service', 'styles');
if (!fs.existsSync(pwaStylesDir)) {
  fs.mkdirSync(pwaStylesDir, { recursive: true });
}

fs.copyFileSync(cssOutputFile, path.join(pwaStylesDir, 'jellicule.css'));
console.log(`Copied to ${path.join(pwaStylesDir, 'jellicule.css')}`);

console.log('Build completed successfully!');
