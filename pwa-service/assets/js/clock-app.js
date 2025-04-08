/**
 * Clock/Watch Application
 * Demonstrates full viewport usage with intuitive UI controls
 */

// Clock state
let clockState = {
  isFullscreen: false,
  showControls: false,
  clockType: 'digital', // 'digital' or 'analog'
  theme: 'dark',
  showSeconds: true,
  format24h: false
}

// Create clock container
const createClockApp = () => {
  const clockApp = document.createElement('div')
  clockApp.className = 'jc-fullview-app jc-clock-app'
  clockApp.id = 'clock-app'
  
  // Create clock display
  const clockDisplay = document.createElement('div')
  clockDisplay.className = 'jc-clock-display'
  
  // Create digital clock
  const digitalClock = document.createElement('div')
  digitalClock.className = 'jc-digital-clock'
  digitalClock.innerHTML = '<span class="jc-time">00:00:00</span><span class="jc-date">Monday, January 1</span>'
  
  // Create analog clock
  const analogClock = document.createElement('div')
  analogClock.className = 'jc-analog-clock'
  analogClock.innerHTML = `
    <div class="jc-clock-face">
      <div class="jc-hour-hand"></div>
      <div class="jc-minute-hand"></div>
      <div class="jc-second-hand"></div>
      <div class="jc-center-dot"></div>
    </div>
  `
  
  // Add clocks to display
  clockDisplay.appendChild(digitalClock)
  clockDisplay.appendChild(analogClock)
  
  // Create controls
  const controls = document.createElement('div')
  controls.className = 'jc-app-controls'
  controls.innerHTML = `
    <div class="jc-control-group">
      <button class="jc-button jc-glow jc-toggle-type">Switch to Analog</button>
      <button class="jc-button jc-glow jc-toggle-seconds">Hide Seconds</button>
      <button class="jc-button jc-glow jc-toggle-format">12h / 24h</button>
      <button class="jc-button jc-glow jc-close-app">Close</button>
    </div>
  `
  
  // Add elements to clock app
  clockApp.appendChild(clockDisplay)
  clockApp.appendChild(controls)
  
  return clockApp
}

// Update clock display
const updateClock = () => {
  const now = new Date()
  
  // Update digital clock
  const digitalClock = document.querySelector('.jc-digital-clock')
  if (digitalClock) {
    const timeElement = digitalClock.querySelector('.jc-time')
    const dateElement = digitalClock.querySelector('.jc-date')
    
    let hours = now.getHours()
    const minutes = now.getMinutes().toString().padStart(2, '0')
    const seconds = now.getSeconds().toString().padStart(2, '0')
    
    // Format hours based on 12h/24h setting
    if (!clockState.format24h) {
      const period = hours >= 12 ? 'PM' : 'AM'
      hours = hours % 12
      hours = hours ? hours : 12 // Convert 0 to 12
      timeElement.textContent = clockState.showSeconds 
        ? `${hours}:${minutes}:${seconds} ${period}`
        : `${hours}:${minutes} ${period}`
    } else {
      hours = hours.toString().padStart(2, '0')
      timeElement.textContent = clockState.showSeconds 
        ? `${hours}:${minutes}:${seconds}`
        : `${hours}:${minutes}`
    }
    
    // Update date
    const options = { weekday: 'long', month: 'long', day: 'numeric' }
    dateElement.textContent = now.toLocaleDateString(undefined, options)
  }
  
  // Update analog clock
  const analogClock = document.querySelector('.jc-analog-clock')
  if (analogClock) {
    const hourHand = analogClock.querySelector('.jc-hour-hand')
    const minuteHand = analogClock.querySelector('.jc-minute-hand')
    const secondHand = analogClock.querySelector('.jc-second-hand')
    
    const seconds = now.getSeconds()
    const minutes = now.getMinutes()
    const hours = now.getHours() % 12
    
    // Calculate rotation angles
    const secondsDegrees = ((seconds / 60) * 360) + 90
    const minutesDegrees = ((minutes / 60) * 360) + ((seconds / 60) * 6) + 90
    const hoursDegrees = ((hours / 12) * 360) + ((minutes / 60) * 30) + 90
    
    // Apply rotations
    secondHand.style.transform = `rotate(${secondsDegrees}deg)`
    minuteHand.style.transform = `rotate(${minutesDegrees}deg)`
    hourHand.style.transform = `rotate(${hoursDegrees}deg)`
    
    // Hide second hand if seconds are disabled
    secondHand.style.display = clockState.showSeconds ? 'block' : 'none'
  }
}

// Toggle clock type
const toggleClockType = () => {
  clockState.clockType = clockState.clockType === 'digital' ? 'analog' : 'digital'
  
  const digitalClock = document.querySelector('.jc-digital-clock')
  const analogClock = document.querySelector('.jc-analog-clock')
  const toggleButton = document.querySelector('.jc-toggle-type')
  
  if (clockState.clockType === 'digital') {
    digitalClock.style.display = 'flex'
    analogClock.style.display = 'none'
    toggleButton.textContent = 'Switch to Analog'
  } else {
    digitalClock.style.display = 'none'
    analogClock.style.display = 'flex'
    toggleButton.textContent = 'Switch to Digital'
  }
}

// Toggle seconds display
const toggleSeconds = () => {
  clockState.showSeconds = !clockState.showSeconds
  
  const toggleButton = document.querySelector('.jc-toggle-seconds')
  toggleButton.textContent = clockState.showSeconds ? 'Hide Seconds' : 'Show Seconds'
  
  updateClock()
}

// Toggle 12h/24h format
const toggleFormat = () => {
  clockState.format24h = !clockState.format24h
  updateClock()
}

// Initialize clock app
export const initClockApp = () => {
  // Create and add clock app to DOM
  const clockApp = createClockApp()
  clockApp.style.display = 'none'
  document.querySelector('jc-activity-viewport').appendChild(clockApp)
  
  // Set initial clock type
  const digitalClock = document.querySelector('.jc-digital-clock')
  const analogClock = document.querySelector('.jc-analog-clock')
  
  if (digitalClock && analogClock) {
    digitalClock.style.display = 'flex'
    analogClock.style.display = 'none'
  }
  
  // Start clock updates
  updateClock()
  setInterval(updateClock, 1000)
  
  // Set up event listeners
  document.querySelector('.jc-toggle-type')?.addEventListener('click', toggleClockType)
  document.querySelector('.jc-toggle-seconds')?.addEventListener('click', toggleSeconds)
  document.querySelector('.jc-toggle-format')?.addEventListener('click', toggleFormat)
  document.querySelector('.jc-close-app')?.addEventListener('click', () => {
    document.getElementById('clock-app').style.display = 'none'
  })
}

// Show clock app
export const showClockApp = () => {
  const clockApp = document.getElementById('clock-app')
  if (clockApp) {
    clockApp.style.display = 'flex'
  } else {
    console.error('Clock app not initialized')
  }
}
