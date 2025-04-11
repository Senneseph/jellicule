// js/loader.js

// --- Initialization Queue Pattern ---

// Use window scope to ensure tasks array and registrar are accessible globally
// between script files (in non-module environments).
window._initializationTasks = window._initializationTasks || [];

/**
 * Registers a function (task) to be executed after the DOM is fully loaded.
 * @param {function} taskFunction The function to execute.
 */
function registerOnInit(taskFunction) {
    if (typeof taskFunction === 'function') {
        window._initializationTasks.push(taskFunction);
    } else {
        console.error('Loader: Attempted to register a non-function task:', taskFunction);
    }
}

/**
 * Executes all registered initialization tasks.
 * This is intended to be called by the DOMContentLoaded listener.
 */
function runInitializationTasks() {
    // console.log('Loader: DOM ready. Running initialization tasks...');
    // Use a copy or loop carefully if tasks could register more tasks.
    // Simple shift is fine if tasks don't modify the queue during execution.
    while (window._initializationTasks && window._initializationTasks.length > 0) {
        const task = window._initializationTasks.shift(); // Get and remove task
        try {
            task(); // Execute the task
        } catch (error) {
            console.error('Loader: Error executing initialization task:', error, task.name);
        }
    }
    // console.log('Loader: Initialization tasks complete.');
}

// --- Trigger ---
// The core "wait for load" mechanism.
// console.log('Loader: Adding DOMContentLoaded listener.');
document.addEventListener('DOMContentLoaded', runInitializationTasks);