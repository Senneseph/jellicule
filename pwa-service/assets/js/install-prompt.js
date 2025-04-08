/**
 * Install Prompt Functionality
 * Handles the "Add to Home Screen" prompt for PWA installation
 */

// Create install button
const addBtn = document.createElement('button');
addBtn.style.display = 'none';
addBtn.textContent = 'Install Jellicule UI';
addBtn.style.position = 'fixed';
addBtn.style.bottom = '20px';
addBtn.style.right = '20px';
addBtn.style.padding = '10px 20px';
addBtn.style.backgroundColor = '#2196F3';
addBtn.style.color = 'white';
addBtn.style.border = 'none';
addBtn.style.borderRadius = '4px';
addBtn.style.zIndex = '9999';
addBtn.style.cursor = 'pointer';

// Store the deferred prompt
let deferredPrompt;

/**
 * Initialize the install prompt functionality
 */
export const initInstallPrompt = () => {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later
        deferredPrompt = e;
        // Update UI to notify the user they can add to home screen
        addBtn.style.display = 'block';

        addBtn.addEventListener('click', () => {
            // Hide our user interface that shows our A2HS button
            addBtn.style.display = 'none';
            // Show the prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
            });
        });
    });

    // Add the button to the body
    document.body.appendChild(addBtn);
};
