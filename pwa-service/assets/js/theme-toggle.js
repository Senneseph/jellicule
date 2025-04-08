/**
 * Theme Toggle Functionality
 * Handles switching between light and dark themes
 */

/**
 * Toggle between light and dark themes
 */
export const toggleTheme = () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('jellicule-theme', newTheme);

    // Update button text
    updateThemeButtonText(newTheme);

    // Dispatch theme change event
    const event = new CustomEvent('jellicule-theme-changed', {
        bubbles: true,
        detail: { theme: newTheme }
    });
    document.dispatchEvent(event);
};

/**
 * Initialize theme based on saved preference or default to dark theme
 */
export const initTheme = () => {
    const savedTheme = localStorage.getItem('jellicule-theme');
    // Set dark theme as default if no preference is saved
    const theme = savedTheme || 'dark';
    document.documentElement.setAttribute('data-theme', theme);

    // Update button text based on current theme
    updateThemeButtonText(theme);
};

/**
 * Update the theme toggle button text based on current theme
 * @param {string} theme - The current theme ('light' or 'dark')
 */
export const updateThemeButtonText = (theme) => {
    const themeToggleButton = document.getElementById('theme-toggle');
    if (themeToggleButton) {
        themeToggleButton.textContent = theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    }
};

/**
 * Set up theme toggle button
 */
export const setupThemeToggle = () => {
    const themeToggleButton = document.getElementById('theme-toggle');
    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    }
};
