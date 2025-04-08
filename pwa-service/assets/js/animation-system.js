/**
 * jellicule Animation System
 * 
 * This module provides utilities for efficient, consistent animations that:
 * 1. Detect and adapt to the viewport's refresh rate
 * 2. Complete within 0.3s maximum duration
 * 3. Scale animation steps proportionally to refresh rate
 * 4. Consider element dimensions for proportional movements
 */

// Default values
const DEFAULT_REFRESH_RATE = 60; // Hz
const MAX_ANIMATION_DURATION = 300; // ms (0.3s)

// State
let detectedRefreshRate = null;
let animationSettings = {
  refreshRate: DEFAULT_REFRESH_RATE,
  maxDuration: MAX_ANIMATION_DURATION,
  transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' // Material Design standard easing
};

/**
 * Detect the viewport's refresh rate
 * @returns {Promise<number>} The detected refresh rate in Hz
 */
export const detectRefreshRate = () => {
  return new Promise((resolve) => {
    if (detectedRefreshRate) {
      resolve(detectedRefreshRate);
      return;
    }

    // Use requestAnimationFrame to measure refresh rate
    let frameCount = 0;
    const startTime = performance.now();
    const countFrames = (timestamp) => {
      frameCount++;
      
      // Measure for 500ms to get a good sample
      if (timestamp - startTime < 500) {
        requestAnimationFrame(countFrames);
      } else {
        // Calculate frames per second
        const elapsedTime = timestamp - startTime;
        const fps = Math.round((frameCount * 1000) / elapsedTime);
        
        // Common refresh rates: 60, 90, 120, 144, 240
        // Round to nearest common rate
        const commonRates = [60, 90, 120, 144, 240];
        let closestRate = commonRates.reduce((prev, curr) => 
          Math.abs(curr - fps) < Math.abs(prev - fps) ? curr : prev
        );
        
        // Store the detected rate
        detectedRefreshRate = closestRate;
        
        // Update animation settings
        updateAnimationSettings(closestRate);
        
        resolve(closestRate);
      }
    };
    
    requestAnimationFrame(countFrames);
  });
};

/**
 * Update animation settings based on refresh rate
 * @param {number} refreshRate - The detected refresh rate in Hz
 */
export const updateAnimationSettings = (refreshRate) => {
  animationSettings.refreshRate = refreshRate;
  
  // Update CSS variables for animations
  document.documentElement.style.setProperty('--jc-refresh-rate', `${refreshRate}Hz`);
  document.documentElement.style.setProperty('--jc-animation-duration', `${MAX_ANIMATION_DURATION}ms`);
  
  // Calculate transition step duration based on refresh rate
  // This ensures animations have the same perceived speed regardless of refresh rate
  const transitionStepDuration = MAX_ANIMATION_DURATION / (refreshRate / 10);
  document.documentElement.style.setProperty('--jc-transition-step', `${transitionStepDuration}ms`);
  
  console.log(`Animation system initialized with ${refreshRate}Hz refresh rate`);
};

/**
 * Calculate the optimal number of animation steps based on distance and refresh rate
 * @param {number} distance - The distance to animate in pixels
 * @returns {number} The optimal number of animation steps
 */
export const calculateAnimationSteps = (distance) => {
  const rate = animationSettings.refreshRate;
  // Base number of steps on refresh rate and distance
  // More steps for higher refresh rates and longer distances
  const baseSteps = Math.min(Math.ceil(rate * (MAX_ANIMATION_DURATION / 1000)), 30);
  
  // Scale steps based on distance (more steps for longer distances)
  const distanceFactor = Math.min(Math.log10(distance) * 2, 3);
  
  return Math.max(Math.ceil(baseSteps * distanceFactor), 5);
};

/**
 * Calculate animation duration based on distance and element dimensions
 * @param {number} distance - The distance to animate in pixels
 * @param {number} elementSize - The relevant dimension of the element (width or height)
 * @returns {number} The optimal animation duration in ms (capped at MAX_ANIMATION_DURATION)
 */
export const calculateAnimationDuration = (distance, elementSize) => {
  // Base duration on the proportion of distance to element size
  const proportion = distance / elementSize;
  
  // Scale duration based on proportion (larger proportions = longer durations)
  // but never exceed MAX_ANIMATION_DURATION
  return Math.min(MAX_ANIMATION_DURATION * proportion, MAX_ANIMATION_DURATION);
};

/**
 * Get CSS transition string for an element based on its dimensions and the property being animated
 * @param {HTMLElement} element - The element being animated
 * @param {string} property - The CSS property being animated (e.g., 'width', 'height', 'transform')
 * @param {number} distance - The distance to animate in pixels
 * @returns {string} The CSS transition value
 */
export const getOptimalTransition = (element, property, distance) => {
  const elementSize = property === 'height' || property.includes('top') || property.includes('bottom') 
    ? element.offsetHeight 
    : element.offsetWidth;
  
  const duration = calculateAnimationDuration(distance, elementSize);
  
  return `${property} ${duration}ms ${animationSettings.transitionTimingFunction}`;
};

/**
 * Apply animation settings to an element
 * @param {HTMLElement} element - The element to animate
 * @param {Object} options - Animation options
 * @param {string} options.property - The CSS property to animate
 * @param {number} options.distance - The distance to animate in pixels
 * @param {Function} options.onComplete - Callback function when animation completes
 */
export const animateElement = (element, { property, distance, onComplete }) => {
  // Get optimal transition
  const transition = getOptimalTransition(element, property, distance);
  
  // Store original transition
  const originalTransition = element.style.transition;
  
  // Set new transition
  element.style.transition = transition;
  
  // Add transition end listener
  const handleTransitionEnd = (e) => {
    if (e.propertyName === property) {
      // Remove listener
      element.removeEventListener('transitionend', handleTransitionEnd);
      
      // Restore original transition
      element.style.transition = originalTransition;
      
      // Call onComplete callback
      if (onComplete && typeof onComplete === 'function') {
        onComplete();
      }
    }
  };
  
  element.addEventListener('transitionend', handleTransitionEnd);
  
  // Force reflow to ensure transition applies
  element.offsetHeight;
  
  // Animation will be triggered by changing the property value after this function
};

/**
 * Initialize the animation system
 */
export const initAnimationSystem = async () => {
  // Detect refresh rate
  const refreshRate = await detectRefreshRate();
  
  // Add animation system info to console
  console.info(`jellicule animation system initialized with ${refreshRate}Hz refresh rate`);
  
  return refreshRate;
};
