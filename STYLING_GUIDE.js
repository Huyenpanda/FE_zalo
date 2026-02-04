/**
 * STYLING BEST PRACTICES & CUSTOMIZATION GUIDE
 * 
 * This file documents the CSS styling approach and provides examples
 * for customizing the Zalo Chat Interface.
 */

/**
 * CSS ARCHITECTURE
 * 
 * The project uses CSS Modules for component styling:
 * - Each component has a corresponding .module.css file
 * - Styles are scoped to prevent naming conflicts
 * - Global styles are in src/styles/global.css
 * - CSS variables are used for theming
 */

/**
 * FILE STRUCTURE
 * 
 * src/
 * ├── styles/
 * │   └── global.css .................... Global styles and CSS variables
 * │
 * ├── components/
 * │   └── chat/
 * │       ├── Sidebar/
 * │       │   ├── Sidebar.jsx
 * │       │   └── Sidebar.module.css ... Sidebar component styles
 * │       ├── ChatWindow/
 * │       │   ├── ChatWindow.jsx
 * │       │   └── ChatWindow.module.css  Chat window styles
 * │       ├── MessageBubble/
 * │       │   ├── MessageBubble.jsx
 * │       │   └── MessageBubble.module.css Message bubble styles
 * │       └── InputBox/
 * │           ├── InputBox.jsx
 * │           └── InputBox.module.css ... Input area styles
 * │
 * └── pages/
 *     ├── Chat.jsx
 *     └── Chat.module.css .............. Chat page layout styles
 */

/**
 * COLOR SYSTEM
 * 
 * All colors are defined as CSS variables in global.css:
 * --primary-color:      #0068ff (Zalo Blue)
 * --primary-hover:      #0052cc (Darker blue)
 * --primary-light:      #e8f0ff (Light blue background)
 * --text-primary:       #000000 (Black)
 * --text-secondary:     #666666 (Dark gray)
 * --text-tertiary:      #999999 (Light gray)
 * --border-color:       #e5e5e5 (Subtle gray)
 * --bg-light:           #f0f0f0 (Light gray)
 * --bg-lighter:         #f9f9f9 (Very light gray)
 * --success-color:      #31a24c (Green)
 * --error-color:        #f33 (Red)
 */

/**
 * CUSTOMIZATION EXAMPLES
 */

// Example 1: Change Primary Color
// File: src/styles/global.css
/*
:root {
  --primary-color: #FF6B6B;        // Changed to red
  --primary-hover: #EE5A5A;        // Darker red
  --primary-light: #FFE8E8;        // Light red background
}
*/

// Example 2: Custom Sidebar Width
// File: src/pages/Chat.module.css
/*
.sidebar {
  width: 450px;                    // Increased from 360px
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.12);  // Enhanced shadow
}
*/

// Example 3: Customize Message Bubble Colors
// File: src/components/chat/MessageBubble/MessageBubble.module.css
/*
.messageContainer.own .messageBubble {
  background-color: var(--primary-color);
  color: #ffffff;
  border-radius: 16px 4px 16px 16px;  // More rounded
}

.messageContainer.other .messageBubble {
  background-color: #f0f0f0;
  color: #000000;
  border-radius: 4px 16px 16px 16px;
}
*/

// Example 4: Dark Mode (Theme Switching)
// File: src/styles/global.css
/*
html[data-theme="dark"] {
  --primary-color: #4A8BFF;
  --text-primary: #FFFFFF;
  --text-secondary: #B0B0B0;
  --text-tertiary: #808080;
  --border-color: #404040;
  --bg-light: #2A2A2A;
  --bg-lighter: #1A1A1A;
}
*/

/**
 * RESPONSIVE DESIGN APPROACH
 * 
 * The project uses mobile-first design with progressive enhancement:
 * 
 * Base styles (mobile)
 * └── Tablet adjustments (768px+)
 *     └── Desktop adjustments (1024px+)
 *         └── Large desktop (1200px+)
 */

// Example: Media Query Strategy
/*
@media (max-width: 768px) {
  // Tablet and down
}

@media (max-width: 480px) {
  // Mobile only
}

@media (min-width: 1024px) {
  // Tablet and up
}

@media (min-width: 1200px) {
  // Desktop and up
}
*/

/**
 * ANIMATION & TRANSITION EXAMPLES
 */

// Example: Message Slide In Animation
/*
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.messageBubble {
  animation: slideIn 0.3s ease-out;
}
*/

// Example: Hover Transitions
/*
.button {
  background-color: var(--bg-light);
  transition: all 0.2s ease;
}

.button:hover {
  background-color: var(--primary-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 104, 255, 0.2);
}
*/

/**
 * LAYOUT PATTERNS
 */

// Pattern 1: Flexbox Container
/*
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}
*/

// Pattern 2: Side-by-Side Layout
/*
.row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.col {
  flex: 1;
  min-width: 0;  // Important for text truncation
}
*/

// Pattern 3: Grid Layout (for message groups)
/*
.messageGroup {
  display: grid;
  gap: 8px;
  grid-auto-rows: max-content;
}
*/

/**
 * TYPOGRAPHY SYSTEM
 */

// Font sizes used in the project:
/*
Display:     32px  (Sidebar title)
Heading:     16px  (Chat header)
Body:        15px  (Default text)
Secondary:   14px  (Secondary text)
Small:       13px  (Timestamps)
Mini:        12px  (Badges)
*/

// Example: Custom Typography
/*
.heading {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--text-primary);
  margin: 0;
}

.body {
  font-size: 15px;
  line-height: 1.5;
  color: var(--text-secondary);
}

.caption {
  font-size: 12px;
  color: var(--text-tertiary);
}
*/

/**
 * SPACING SYSTEM
 * 
 * Base unit: 8px
 * Used for consistent spacing throughout
 */

// Spacing values:
/*
4px   = micro spacing (rare)
8px   = tight spacing
12px  = standard gap between elements
16px  = standard padding
24px  = large spacing
32px  = extra large spacing
*/

// Example usage:
/*
.container {
  padding: 16px;           // Standard padding
  gap: 12px;              // Element spacing
  margin-bottom: 24px;    // Large spacing
}
*/

/**
 * COMMON CUSTOMIZATION TASKS
 */

// Task 1: Change sidebar width
// Edit: src/pages/Chat.module.css
/*
.sidebar {
  width: 400px;  // Change this value
}

@media (max-width: 1024px) {
  .sidebar {
    width: 350px;  // Tablet width
  }
}
*/

// Task 2: Change message bubble shape
// Edit: src/components/chat/MessageBubble/MessageBubble.module.css
/*
.messageBubble {
  border-radius: 12px;  // More rounded
  // or
  border-radius: 0;     // Squared edges
  // or
  border-radius: 28px;  // Pill-shaped
}
*/

// Task 3: Modify search box style
// Edit: src/components/chat/Sidebar/Sidebar.module.css
/*
.searchInput {
  background-color: #f5f5f5;  // Different background
  border: 2px solid var(--border-color);
  border-radius: 8px;  // Less rounded
}

.searchInput:focus {
  background-color: #ffffff;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(0, 104, 255, 0.1);  // Add glow
}
*/

// Task 4: Add custom scrollbar styling
// Edit: src/styles/global.css
/*
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-lighter);
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-hover);
}
*/

// Task 5: Add shadow effects
// Edit relevant component .module.css
/*
// Light shadow
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

// Medium shadow
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);

// Heavy shadow
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.16);

// Soft glow
box-shadow: 0 0 0 8px rgba(0, 104, 255, 0.1);
*/

/**
 * ACCESSIBILITY CONSIDERATIONS
 */

// Always include focus states for keyboard navigation:
/*
button:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

input:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: -2px;
}
*/

// Maintain sufficient color contrast:
/*
Color Contrast Ratios (WCAG):
- AAA (preferred): 7:1
- AA (minimum):    4.5:1
- UI/Graphics:     3:1

Example combinations that work well:
- Black (#000) on White (#fff)    = 21:1
- Blue (#0068ff) on White (#fff)  = 4.6:1
- Gray (#666) on White (#fff)     = 7.5:1
*/

// Use meaningful hover/focus states:
/*
.button {
  cursor: pointer;
  transition: all 0.2s;
}

.button:hover,
.button:focus {
  background-color: var(--primary-light);
  box-shadow: 0 2px 8px rgba(0, 104, 255, 0.2);
}

.button:active {
  transform: scale(0.98);
}
*/

/**
 * PERFORMANCE TIPS FOR CSS
 */

// 1. Use CSS variables instead of hardcoded colors
// Instead of: color: #0068ff
// Use: color: var(--primary-color)

// 2. Leverage CSS Modules to avoid specificity wars
// Instead of: .container .title { ... }
// Use: .title { ... } (scoped by module)

// 3. Use transitions instead of animations for simple effects
/*
// Good
transition: background-color 0.2s ease;

// Avoid unnecessary animations
animation: complexKeyframes 1s infinite;
*/

// 4. Minimize reflows and repaints
/*
// Good - changes one property
element.style.backgroundColor = 'red';

// Avoid - multiple reflows
element.style.width = '100px';
element.style.height = '100px';
element.style.padding = '10px';
*/

/**
 * CSS MODULE IMPORT PATTERN
 */

// File: src/components/chat/Component/Component.jsx
/*
import styles from './Component.module.css';

export default function Component() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Title</h1>
      <p className={styles.text}>Text</p>
    </div>
  );
}
*/

// File: src/components/chat/Component/Component.module.css
/*
.container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.title {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
}

.text {
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
}
*/

/**
 * DYNAMIC CLASS BINDING
 */

// Example: Conditional classes
/*
// File: src/components/chat/MessageBubble/MessageBubble.jsx
<div className={`${styles.messageContainer} ${isOwn ? styles.own : styles.other}`}>
  {/* Content */}
</div>

// File: src/components/chat/MessageBubble/MessageBubble.module.css
.messageContainer {
  display: flex;
  margin-bottom: 12px;
}

.own {
  justify-content: flex-end;
}

.other {
  justify-content: flex-start;
}
*/

/**
 * DEVELOPMENT WORKFLOW
 */

// 1. Make CSS changes
// 2. Save file (auto-refresh on hot reload)
// 3. Check browser DevTools for styles
// 4. Verify responsive behavior
// 5. Test on different devices/browsers

/**
 * USEFUL BROWSER DEVTOOLS TIPS
 */

// 1. Inspect element (Ctrl+Shift+C)
// 2. Toggle classes in DevTools (.cls button)
// 3. Edit CSS in real-time to test changes
// 4. Use DevTools responsive mode (Ctrl+Shift+M)
// 5. Check computed styles panel
// 6. Use network tab to ensure CSS loads
// 7. Use accessibility audit tool

/**
 * OPTIMIZATION CHECKLIST
 */

// - [ ] Use CSS variables for colors
// - [ ] Use CSS Modules for scoping
// - [ ] Minimize specificity in selectors
// - [ ] Use shorthand properties when possible
// - [ ] Remove unused CSS
// - [ ] Optimize images and icons
// - [ ] Use flexbox for layouts
// - [ ] Use grid for complex layouts
// - [ ] Use transitions instead of animations
// - [ ] Test on multiple browsers
// - [ ] Test responsive design
// - [ ] Verify accessibility
// - [ ] Check color contrast ratios
// - [ ] Ensure all interactive elements have focus states

// ============================================================================
// END OF STYLING GUIDE
// ============================================================================
