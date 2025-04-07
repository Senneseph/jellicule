// Use ES modules with Bun
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join, basename } from 'path';

try {
  // Create dist directories if they don't exist
  if (!existsSync('dist')) {
    mkdirSync('dist', { recursive: true });
  }

  // Create example/dist directory if it doesn't exist
  if (!existsSync('example/dist')) {
    mkdirSync('example/dist', { recursive: true });
  }

  // Create example/build-status directory if it doesn't exist
  if (!existsSync('example/build-status')) {
    mkdirSync('example/build-status', { recursive: true });
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

  // Verify all component files exist
  components.forEach(componentPath => {
    if (!existsSync(componentPath)) {
      throw new Error(`Component file not found: ${componentPath}`);
    }
  });

  // Get version from version.txt or create it
  let version = '0.1.0';
  try {
    if (existsSync('components/version.txt')) {
      version = readFileSync('components/version.txt', 'utf8').trim();
    } else {
      writeFileSync('components/version.txt', version);
    }
  } catch (err) {
    console.warn('Warning: Could not read or write version.txt', err);
  }

  // Combine all component files into one
  let combinedCode = `/**
 * Jellicule UI Components Library
 * Version: ${version}
 * Built: ${new Date().toISOString()}
 */

(function(global) {
  'use strict';

  // Component classes
`;

  // Add each component's code
  components.forEach(componentPath => {
    try {
      const code = readFileSync(componentPath, 'utf8');

      // Remove export keyword and standalone customElements.define
      const processedCode = code
        .replace(/export\s+class/, 'const')
        .replace(/\/\/\s*For standalone use.*$/, '')
        .trim();

      combinedCode += processedCode + '\n\n';
    } catch (err) {
      throw new Error(`Error processing component ${componentPath}: ${err.message}`);
    }
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
    version: '${version}',
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
  writeFileSync('dist/jellicule.js', combinedCode);

  // Create a minified version (not really minified, just a copy for now)
  writeFileSync('dist/jellicule.min.js', combinedCode);

  // Create a JSON file with build information
  const buildInfo = {
    version: version,
    buildTime: new Date().toISOString(),
    components: components.map(c => basename(c))
  };
  writeFileSync('dist/build-info.json', JSON.stringify(buildInfo, null, 2));

  // Create build status for the WebSocket server
  const buildStatus = {
    status: 'success',
    time: new Date().toISOString(),
    version: version
  };

  // Ensure the build-status directory exists
  const statusDir = join(import.meta.dirname, '..', 'example', 'build-status');
  if (!existsSync(statusDir)) {
    mkdirSync(statusDir, { recursive: true });
  }

  // Write the status file
  writeFileSync(join(statusDir, 'status.json'), JSON.stringify(buildStatus, null, 2));

  // Notify the WebSocket server
  console.log(JSON.stringify({
    type: 'build-status',
    data: buildStatus
  }));

  console.log('Build completed successfully!');
  console.log(`Version: ${version}`);
  console.log('Output files:');
  console.log('- dist/jellicule.js');
  console.log('- dist/jellicule.min.js');
  console.log('- dist/build-info.json');

  // Exit with success code
  process.exit(0);
} catch (error) {
  console.error('Build failed!');
  console.error(error.message);

  // Create error files for debugging
  try {
    // Create dist directory if it doesn't exist
    if (!existsSync('dist')) {
      mkdirSync('dist', { recursive: true });
    }

    // Create example/build-status directory if it doesn't exist
    if (!existsSync('example/build-status')) {
      mkdirSync('example/build-status', { recursive: true });
    }
    writeFileSync('dist/build-error.txt', `Build failed at ${new Date().toISOString()}\n\nError: ${error.message}\n\nStack: ${error.stack}`);

    // Create a minimal working library with error information
    const errorLibrary = `/**
 * Jellicule UI Components Library - ERROR BUILD
 * Build failed at: ${new Date().toISOString()}
 * Error: ${error.message.replace(/\n/g, ' ').replace(/'/g, "\'")}
 */

(function(global) {
  'use strict';

  console.error('Jellicule library build failed:', ${JSON.stringify(error.message)});

  global.jellicule = {
    version: 'error',
    buildError: ${JSON.stringify(error.message)}
  };
})(typeof window !== 'undefined' ? window : this);
`;

    writeFileSync('dist/jellicule.js', errorLibrary);
    writeFileSync('dist/jellicule.min.js', errorLibrary);

    // Create build status for the WebSocket server
    const buildStatus = {
      status: 'failed',
      time: new Date().toISOString(),
      version: 'error',
      error: error.message
    };

    // Ensure the build-status directory exists
    const statusDir = join(import.meta.dirname, '..', 'example', 'build-status');
    if (!existsSync(statusDir)) {
      mkdirSync(statusDir, { recursive: true });
    }

    // Write the status file
    writeFileSync(join(statusDir, 'status.json'), JSON.stringify(buildStatus, null, 2));

    // Notify the WebSocket server
    console.log(JSON.stringify({
      type: 'build-status',
      data: buildStatus
    }));
  } catch (writeError) {
    console.error('Failed to write error files:', writeError);
  }

  // Exit with error code
  process.exit(1);
}
