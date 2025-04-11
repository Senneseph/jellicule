// js/app.js

/**
 * Contains the specific UI setup logic for the theme/layout demo.
 */
function setupUIDemoInteractions() {
    // console.log('App: Setting up UI interactions...');

    // --- Get Elements ---
    const styleThemeTextarea = document.getElementById('ui.style.theme');
    const stylePointStyleTag = document.getElementById('ui.style.point');
    const applyStyleButton = document.getElementById('ui.style.apply');
    const defaultStyleButton = document.getElementById('ui.style.default');

    const layoutDesignTextarea = document.getElementById('ui.layout.design');
    const viewportPointDiv = document.getElementById('ui.viewport.point');
    const applyLayoutButton = document.getElementById('ui.layout.apply');
    const defaultLayoutButton = document.getElementById('ui.layout.default');

    // --- Add Event Listeners ---
    // Defensive checks to ensure elements exist before adding listeners
    console.info('App: Setting up UI Theme interactions...');
    if (applyStyleButton && styleThemeTextarea && stylePointStyleTag) {
        applyStyleButton.addEventListener('click', () => {
            console.info('clicked apply style button');
            stylePointStyleTag.innerHTML = styleThemeTextarea.value;
        });
    } else {
        console.error('App: Could not find all elements needed for style application.');
    }

    console.info('App: Setting up UI Layout interactions...');
    if (applyLayoutButton && layoutDesignTextarea && viewportPointDiv) {
        applyLayoutButton.addEventListener('click', () => {
            viewportPointDiv.innerHTML = layoutDesignTextarea.value;
        });
    } else {
        console.error('App: Could not find all elements needed for layout application.');
    }

    // Default buttons (placeholder logic)
    console.info('App: styling default buttons...');
    if (defaultStyleButton) {
        defaultStyleButton.addEventListener('click', () => stylePointStyleTag.innerHTML = '');
    }
    if (defaultLayoutButton) {
        defaultLayoutButton.addEventListener('click', () => console.log('App: Set Default Design clicked - logic needed.'));
    }
    // console.log('App: UI interactions setup complete.');
}

if (typeof registerOnInit === 'function') {
    // console.log('App: Registering setupUIDemoInteractions...');
    registerOnInit(setupUIDemoInteractions);
} else {
    console.error('App: registerOnInit function not found. Ensure loader.js is included and loaded BEFORE app.js.');
    // As a less ideal fallback, you might try running directly on DOMContentLoaded here,
    // but it defeats the purpose of the loader script.
    // document.addEventListener('DOMContentLoaded', setupUIDemoInteractions);
}
