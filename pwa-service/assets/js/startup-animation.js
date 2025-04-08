/**
 * jellicule Startup Animation System
 * 
 * Handles the initial startup animation sequence:
 * 1. Black screen
 * 2. Camera lens iris opening
 * 3. Activity bars appear in corners
 * 4. Activity bars expand with shadow trail
 * 5. Main content area glows and fades in
 */

// Animation timing constants
const TIMING = {
  IRIS_DURATION: 300,
  BARS_APPEAR_DURATION: 300,
  BARS_EXPAND_DURATION: 300,
  CONTENT_FADE_DURATION: 300,
  TOTAL_DURATION: 1200
}

// Store animation state
let animationState = {
  started: false,
  completed: false,
  currentPhase: 0
}

/**
 * Initialize the viewport for animation
 */
const prepareViewport = () => {
  // Get the viewport
  const viewport = document.querySelector('jc-activity-viewport')
  if (!viewport) return false
  
  // Add animation classes
  viewport.classList.add('jc-startup-animation')
  
  // Hide activity bars initially
  document.querySelectorAll('jc-activity-bar').forEach(bar => {
    bar.classList.add('jc-startup-hidden')
    
    // Position bars in corners based on orientation
    const orientation = bar.getAttribute('orientation')
    bar.classList.add(`jc-startup-${orientation}`)
  })
  
  // Hide main content initially
  const mainContent = document.querySelector('jc-main-content')
  if (mainContent) {
    mainContent.classList.add('jc-startup-hidden')
  }
  
  return true
}

/**
 * Run the iris opening animation
 */
const animateIrisOpening = () => {
  const viewport = document.querySelector('jc-activity-viewport')
  if (!viewport) return
  
  // Add iris animation class
  viewport.classList.add('jc-iris-animation')
  
  // Remove the class after animation completes
  setTimeout(() => {
    viewport.classList.remove('jc-iris-animation')
    animationState.currentPhase = 1
    animateActivityBarsAppear()
  }, TIMING.IRIS_DURATION)
}

/**
 * Animate activity bars appearing in corners
 */
const animateActivityBarsAppear = () => {
  const activityBars = document.querySelectorAll('jc-activity-bar')
  
  activityBars.forEach(bar => {
    // Remove hidden class to make bars visible
    bar.classList.remove('jc-startup-hidden')
    bar.classList.add('jc-startup-appear')
  })
  
  // Move to next phase after animation completes
  setTimeout(() => {
    activityBars.forEach(bar => {
      bar.classList.remove('jc-startup-appear')
    })
    animationState.currentPhase = 2
    animateActivityBarsExpand()
  }, TIMING.BARS_APPEAR_DURATION)
}

/**
 * Animate activity bars expanding with shadow trail
 */
const animateActivityBarsExpand = () => {
  const activityBars = document.querySelectorAll('jc-activity-bar')
  
  activityBars.forEach(bar => {
    bar.classList.add('jc-startup-expand')
    
    // Add shadow trail effect
    const orientation = bar.getAttribute('orientation')
    bar.classList.add(`jc-shadow-trail-${orientation}`)
  })
  
  // Move to next phase after animation completes
  setTimeout(() => {
    activityBars.forEach(bar => {
      bar.classList.remove('jc-startup-expand')
      
      // Remove positioning classes
      const orientation = bar.getAttribute('orientation')
      bar.classList.remove(`jc-startup-${orientation}`)
      bar.classList.remove(`jc-shadow-trail-${orientation}`)
    })
    animationState.currentPhase = 3
    animateContentFadeIn()
  }, TIMING.BARS_EXPAND_DURATION)
}

/**
 * Animate main content area fading in
 */
const animateContentFadeIn = () => {
  const mainContent = document.querySelector('jc-main-content')
  if (!mainContent) return
  
  // Remove hidden class and add fade-in animation
  mainContent.classList.remove('jc-startup-hidden')
  mainContent.classList.add('jc-startup-fade-in')
  
  // Add glow effect to content
  mainContent.classList.add('jc-startup-glow')
  
  // Complete animation
  setTimeout(() => {
    mainContent.classList.remove('jc-startup-fade-in')
    mainContent.classList.remove('jc-startup-glow')
    
    // Mark animation as completed
    animationState.completed = true
    
    // Remove startup animation class from viewport
    const viewport = document.querySelector('jc-activity-viewport')
    if (viewport) {
      viewport.classList.remove('jc-startup-animation')
    }
    
    // Dispatch animation completed event
    document.dispatchEvent(new CustomEvent('jellicule-startup-animation-completed'))
  }, TIMING.CONTENT_FADE_DURATION)
}

/**
 * Start the startup animation sequence
 */
export const startAnimation = () => {
  if (animationState.started) return
  
  animationState.started = true
  
  // Prepare the viewport for animation
  if (!prepareViewport()) return
  
  // Start with a small delay to ensure DOM is ready
  setTimeout(() => {
    animateIrisOpening()
  }, 100)
}

/**
 * Skip the startup animation
 */
export const skipAnimation = () => {
  if (animationState.completed) return
  
  // Remove all animation classes
  const viewport = document.querySelector('jc-activity-viewport')
  if (viewport) {
    viewport.classList.remove('jc-startup-animation')
    viewport.classList.remove('jc-iris-animation')
  }
  
  document.querySelectorAll('jc-activity-bar').forEach(bar => {
    bar.classList.remove('jc-startup-hidden')
    bar.classList.remove('jc-startup-appear')
    bar.classList.remove('jc-startup-expand')
    
    const orientation = bar.getAttribute('orientation')
    bar.classList.remove(`jc-startup-${orientation}`)
    bar.classList.remove(`jc-shadow-trail-${orientation}`)
  })
  
  const mainContent = document.querySelector('jc-main-content')
  if (mainContent) {
    mainContent.classList.remove('jc-startup-hidden')
    mainContent.classList.remove('jc-startup-fade-in')
    mainContent.classList.remove('jc-startup-glow')
  }
  
  // Mark animation as completed
  animationState.completed = true
  
  // Dispatch animation completed event
  document.dispatchEvent(new CustomEvent('jellicule-startup-animation-completed'))
}
