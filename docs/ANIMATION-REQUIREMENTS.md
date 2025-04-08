# jellicule Animation Requirements

This document outlines the animation requirements and principles for the jellicule component library.

## Core Animation Principles

1. **Efficiency First**: Animations should use the most efficient methods available.
2. **Refresh Rate Awareness**: Animations should detect and adapt to the viewport's refresh rate.
3. **Maximum Duration**: Animations should never take more than 0.3 seconds (300ms) to complete.
4. **Proportional Steps**: The number of animation steps should be proportional to the detected refresh rate.
5. **Dimensional Awareness**: Animations should scale proportionally to the actual dimensions of the elements being animated.

## Technical Implementation

### Refresh Rate Detection

The animation system automatically detects the viewport's refresh rate using `requestAnimationFrame`. If detection fails, it defaults to 60Hz. The system supports common refresh rates:

- 60Hz (standard)
- 90Hz
- 120Hz (high refresh rate)
- 144Hz (gaming displays)
- 240Hz (high-end displays)

### Animation Duration Calculation

Animation durations are calculated based on:

1. The distance being animated
2. The relevant dimension of the element (width or height)
3. The detected refresh rate

The formula ensures that animations complete within the 300ms maximum while maintaining smooth motion.

### CSS Variables

The animation system sets the following CSS variables:

- `--jc-refresh-rate`: The detected refresh rate (e.g., "60Hz")
- `--jc-animation-duration`: The maximum animation duration (300ms)
- `--jc-transition-step`: The optimal duration for small transitions, calculated based on refresh rate

### Performance Optimizations

1. **will-change**: Elements that animate frequently use the `will-change` property to hint the browser about upcoming animations.
2. **Hardware Acceleration**: Transforms and opacity changes are preferred over animating properties that trigger layout.
3. **Throttling**: Animation calculations are throttled to prevent performance issues.
4. **Adaptive Complexity**: Animation complexity scales based on device performance.

## Usage Guidelines

### For Component Developers

When creating components that include animations:

1. Use the animation system's utilities to calculate optimal durations and steps.
2. Use CSS variables for transition durations instead of hardcoded values.
3. Consider element dimensions when animating.
4. Test animations at different refresh rates.

Example:

```javascript
// JavaScript
import { getOptimalTransition, animateElement } from './animation-system.js';

// Get optimal transition for an element
const transition = getOptimalTransition(element, 'width', 200);

// Apply animation
animateElement(element, {
  property: 'width',
  distance: 200,
  onComplete: () => console.log('Animation complete')
});
```

```css
/* CSS */
.my-component {
  transition: transform var(--jc-animation-duration) var(--jc-transition-function);
  will-change: transform;
}

/* For small, frequent animations */
.my-component:hover {
  transition: transform var(--jc-transition-step);
  transform: scale(1.05);
}
```

### For Theme Developers

When creating themes:

1. Respect the animation duration limits.
2. Use the provided CSS variables for consistent animations.
3. Consider using different animation styles for different refresh rates.

## Testing

The animation system includes utilities for testing animations at different refresh rates:

```javascript
// Force a specific refresh rate for testing
import { updateAnimationSettings } from './animation-system.js';
updateAnimationSettings(60); // Test at 60Hz
updateAnimationSettings(120); // Test at 120Hz
```

## Browser Support

The animation system works in all modern browsers. In browsers that don't support refresh rate detection, the system defaults to 60Hz.

## Performance Monitoring

The animation system includes performance monitoring to detect and report animation performance issues:

- Frame drops
- Animations exceeding the maximum duration
- CPU/GPU usage spikes during animations

This data can be used to optimize animations further.
