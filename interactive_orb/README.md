# 🌟 Interactive Floating Orb - TamperMonkey Userscript

A beautiful, interactive floating orb for webpage manipulation inspired by the Mozilla Orbit Orb concept. This script provides a fast, elegant way to have multiple action items available on any webpage through a draggable, customizable interface.

## ⚠️ **Important Warning**

**By default, this userscript runs on EVERY webpage you visit** (`@match *://*/*`). This can have performance implications and security considerations. 

### 🚨 **You should modify the `@match` directive to limit it to specific sites:**

```javascript
// Instead of: @match *://*/*
// Use specific sites:
@match https://github.com/*
@match https://*.google.com/*
@match https://stackoverflow.com/*
```

### **Cons of Running on Every Page:**
- **Performance Impact**: Adds overhead to every page load
- **Memory Usage**: Consumes additional browser memory on all tabs
- **Potential Conflicts**: May interfere with site-specific functionality
- **Security Risk**: Executes code on sensitive pages (banking, etc.)
- **Visual Distraction**: Orb appears on pages where you don't need it

### **User Caution Advised:**
- **Review the code** before installation to understand what it does
- **Test on non-critical sites** first
- **Limit to specific domains** you actually want to modify
- **Be aware of auto-start functions** that execute automatically
- **Monitor interval functions** to prevent excessive resource usage
- **Consider privacy implications** when running on all websites

## 🎯 Philosophy

While TamperMonkey is already a powerful framework in itself, within broader frameworks, opinionated task-oriented micro-frameworks naturally emerge. This script serves as a micro-framework for webpage interaction - providing a unified, visual interface for common web automation tasks and custom functions.


## ✨ Features

### 🎨 **Visual Design**
- **Liquid Energy Appearance**: Flowing, organic design with dynamic gradients
- **Multi-layered Glow Effects**: Realistic energy emanation with depth
- **Smooth Animations**: Pulsing energy, floating motion, and liquid flow effects
- **6 Color Variations**: Red-orange, blue plasma, purple energy, green mystical, golden fire, and cyan crystal
- **Interactive Feedback**: Hover effects, scaling, and visual state changes

### 🔧 **Core Functionality**
- **Draggable Interface**: Click and drag the orb anywhere on the page
- **Smart Click Detection**: Distinguishes between clicks and drags
- **Custom Function Execution**: Execute any JavaScript function on click
- **Right-click Context Menu**: Quick access to built-in functions
- **High Z-index**: Always visible above page content (z-index: 999999)
- **Mobile Support**: Touch events for mobile devices
- **Boundary Detection**: Keeps orb within viewport

### ⚡ **Auto-Start Functions**
- **Serial Execution**: 3 functions that run sequentially with 1ms delays
- **Parallel Execution**: 3 functions that run simultaneously
- **Easy Customization**: Simple function definitions ready for your code

### ⏰ **Interval Management System**
- **Flexible Intervals**: Set any function to run at specified intervals
- **Advanced Options**: Immediate execution, execution limits, named intervals
- **Full Control**: Start, stop, list, and manage all active intervals
- **Error Handling**: Robust error handling for interval functions
- **Performance Tracking**: Monitor execution counts and runtime statistics

## 🚀 Installation

1. **Install TamperMonkey** browser extension
2. **Open TamperMonkey Dashboard**
3. **Create New Script**
4. **Copy and paste** the complete userscript code
5. **Save and Enable** the script
6. **Refresh any webpage** to see the floating orb

## 🎮 Usage

### Basic Interaction
```javascript
// The orb appears on every webpage automatically
// Left-click + drag: Move the orb
// Left-click (quick): Execute current function  
// Right-click: Open context menu
```

### Setting Custom Functions
```javascript
// In browser console:
setOrbFunction(() => alert('Hello World!'));
setOrbFunction(() => window.open('https://google.com', '_blank'));
setOrbFunction(() => {
    document.body.style.backgroundColor = 'lightblue';
});
```

### Built-in Menu Functions

**All menu items can be easily customized, and new items can be added or removed** by modifying the `menuItems` array in the `createMenu()` function. 

**Examples of customization:**
```javascript
// Add a new menu item
{ text: '🌐 Open Google', action: () => window.open('https://google.com', '_blank') },

// Remove an existing item - simply delete or comment out the line:
// { text: '🎭 Toggle Dark Mode', action: () => this.toggleDarkMode() },
```

| Function | Description | Example Use Case |
|----------|-------------|------------------|
| 🎯 **Test Alert** | Shows alert with site info and time | Quick functionality test |
| 🎨 **Change Colors** | Cycles through 6 energy colors | Visual customization |
| 🎪 **Bounce Animation** | Triggers dramatic bounce effect | Visual feedback |
| 📋 **Copy Page Title** | Copies current page title | Quick title extraction |
| 🔗 **Copy Page URL** | Copies current URL | Easy link sharing |
| 📜 **Scroll to Top** | Smooth scroll to page top | Quick navigation |
| 📄 **Scroll to Bottom** | Smooth scroll to page bottom | Quick navigation |
| 🔍 **Highlight Links** | Toggle highlight all links | Link discovery |
| 🎭 **Toggle Dark Mode** | Invert page colors | Eye strain relief |
| ⏱️ **List Intervals** | Show all active intervals | Interval monitoring |
| 🛑 **Stop All Intervals** | Stop all running intervals | Cleanup |
| ❌ **Remove Orb** | Remove the orb (with confirmation) | Cleanup |

## 🔄 Auto-Start Functions

The script includes 6 auto-start functions that execute immediately after orb creation:

### Serial Functions (1ms delay each)
```javascript
auto_start_serial_1() {
    console.log('auto_start_serial_1');
    // Add your custom code here
    // Example: Check if user is on specific site
    if (window.location.hostname.includes('github.com')) {
        this.showNotification('🐙 GitHub detected!');
    }
}

auto_start_serial_2() {
    console.log('auto_start_serial_2');
    // Add your custom code here
    // Example: Inject custom CSS
    const style = document.createElement('style');
    style.textContent = `
        .highlight { 
            background: yellow !important; 
            padding: 2px 4px !important; 
        }`;
    document.head.appendChild(style);
}

auto_start_serial_3() {
    console.log('auto_start_serial_3');
    // Add your custom code here
    // Example: Set up custom data collection
    window.pageLoadTime = Date.now();
}
```

### Parallel Functions (simultaneous execution)
```javascript
auto_start_parallel_1() {
    console.log('auto_start_parallel_1');
    // Add your custom code here
    // Example: Set up keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'q') {
            this.executeCustomFunction();
        }
    });
}

auto_start_parallel_2() {
    console.log('auto_start_parallel_2');
    // Add your custom code here
    // Example: Initialize page monitoring
    this.observer = new MutationObserver((mutations) => {
        console.log('Page changed:', mutations.length, 'mutations');
    });
    this.observer.observe(document.body, { childList: true, subtree: true });
}

auto_start_parallel_3() {
    console.log('auto_start_parallel_3');
    // Add your custom code here
    // Example: Start background tasks
    this.backgroundTasks = [];
}
```

## ⏰ Interval Management System

### Basic Interval Usage
```javascript
// Simple interval - runs every 2 seconds
const id1 = setOrbInterval(() => {
    console.log('Hello every 2 seconds');
}, 2000);

// Stop the interval
clearOrbInterval(id1);
```

### Advanced Interval Options
```javascript
// Immediate execution + named interval
const id2 = setOrbInterval(() => {
    const unreadCount = document.querySelectorAll('.unread').length;
    console.log(`Unread messages: ${unreadCount}`);
}, 5000, {
    immediate: true,        // Run immediately, then every 5 seconds
    name: 'MessageChecker'  // Give it a name for easy tracking
});

// Limited executions
const id3 = setOrbInterval(() => {
    window.scrollBy(0, 100);
    console.log('Auto-scrolling...');
}, 1000, {
    maxExecutions: 10,      // Stop after 10 executions
    name: 'AutoScroll',
    immediate: true
});
```

### Interval Management
```javascript
// List all active intervals
listOrbIntervals();
// Output: Shows ID, name, interval time, execution count, runtime

// Stop all intervals at once
clearAllOrbIntervals();
// Output: Notification with count of stopped intervals
```

## 🛠️ Advanced Examples

### Page Automation
```javascript
// Auto-refresh pages every 5 minutes
setOrbInterval(() => {
    if (confirm('Auto-refresh page?')) {
        location.reload();
    }
}, 300000, { name: 'AutoRefresh' });

// Monitor for specific elements
setOrbInterval(() => {
    const errorElements = document.querySelectorAll('.error, .alert-danger');
    if (errorElements.length > 0) {
        console.log(`Found ${errorElements.length} error(s) on page`);
        // Could trigger notifications, logging, etc.
    }
}, 10000, { name: 'ErrorMonitor' });
```

### Content Manipulation
```javascript
// Set orb to toggle reading mode
setOrbFunction(() => {
    const articles = document.querySelectorAll('article, .post, .content');
    articles.forEach(article => {
        if (article.style.fontSize === '18px') {
            article.style.fontSize = '';
            article.style.lineHeight = '';
            article.style.maxWidth = '';
        } else {
            article.style.fontSize = '18px';
            article.style.lineHeight = '1.6';
            article.style.maxWidth = '800px';
        }
    });
});
```

### Data Collection
```javascript
// Collect page statistics every 30 seconds
setOrbInterval(() => {
    const stats = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        title: document.title,
        linkCount: document.querySelectorAll('a').length,
        imageCount: document.querySelectorAll('img').length,
        scrollPosition: window.scrollY
    };
    
    // Store in localStorage or send to external service
    console.log('Page Stats:', stats);
}, 30000, { name: 'StatsCollector' });
```

### Social Media Automation
```javascript
// Auto-like posts (example for educational purposes)
setOrbInterval(() => {
    const likeButtons = document.querySelectorAll('[aria-label*="Like"]:not(.liked)');
    if (likeButtons.length > 0 && Math.random() > 0.7) {
        likeButtons[0].click();
        console.log('Auto-liked a post');
    }
}, 15000, { 
    name: 'AutoLiker',
    maxExecutions: 5  // Limit to prevent spam
});
```

## 🎨 Customization

### Color Schemes
The orb automatically cycles through 6 predefined liquid energy themes:
- **Flowing Red-Orange** (default) - Warm energy
- **Blue Plasma** - Electric energy  
- **Purple Energy** - Mystical power
- **Green Mystical** - Natural magic
- **Golden Fire** - Warm flames
- **Cyan Crystal** - Cool crystal energy

### Visual Modifications
```javascript
// Access the orb element directly
const orb = document.querySelector('.tm-floating-orb');

// Custom size
orb.style.width = '100px';
orb.style.height = '100px';

// Custom position
orb.style.top = '10px';
orb.style.left = '10px';

// Custom animation speed
orb.style.animationDuration = '2s, 6s, 3s';  // pulse, rotate, float
```

## 🔧 API Reference

### Global Functions
These functions are **globally accessible** and can be called from:
- **Browser's Developer Console** (F12 → Console tab)
- **Other userscripts or browser extensions**
- **Bookmarklets**
- **Any JavaScript context on the page**

```javascript
// Set orb click function - Available globally
setOrbFunction(func)

// Interval management - Available globally
setOrbInterval(func, intervalMs, options)
clearOrbInterval(intervalId)
listOrbIntervals()
clearAllOrbIntervals()

// Direct access to orb instance - Available globally
window.floatingOrb
```

### Instance Methods
These methods are accessible through the `window.floatingOrb` instance and can be used from:
- **Browser's Developer Console**: `window.floatingOrb.methodName()`
- **Other scripts**: Direct instance method calls
- **Auto-start functions**: `this.methodName()` (since they're part of the class)
- **Menu actions**: Already integrated into the right-click menu

```javascript
// Function management
floatingOrb.setCustomFunction(func)
floatingOrb.executeCustomFunction()

// Interval management  
floatingOrb.setInterval(func, intervalMs, options)
floatingOrb.clearInterval(intervalId)
floatingOrb.clearAllIntervals()
floatingOrb.listIntervals()

// Visual effects
floatingOrb.changeColors()
floatingOrb.bounceAnimation()
floatingOrb.showNotification(message)

// Utility functions
floatingOrb.copyPageTitle()
floatingOrb.copyPageURL()
floatingOrb.scrollToTop()
floatingOrb.scrollToBottom()
floatingOrb.highlightLinks()
floatingOrb.toggleDarkMode()
```

**Example Usage from Console:**
```javascript
// Global function calls
setOrbFunction(() => console.log('Clicked!'));
setOrbInterval(() => console.log('Every 3 seconds'), 3000);

// Instance method calls
window.floatingOrb.showNotification('Hello from console!');
window.floatingOrb.changeColors();
```

## 🏗️ Architecture

### Class Structure
```
TamperMonkeyFloatingOrb
├── Visual Components
│   ├── Orb element (.tm-floating-orb)
│   ├── Context menu (.tm-orb-menu)
│   └── Notifications
├── Event Handling
│   ├── Mouse events (drag, click, context)
│   ├── Touch events (mobile support)
│   └── Keyboard events
├── Function Management
│   ├── Custom function execution
│   ├── Auto-start functions (serial/parallel)
│   └── Built-in utility functions
└── Interval System
    ├── Interval creation and management
    ├── Execution tracking
    └── Error handling
```

### CSS Architecture
```
Namespaced Classes (tm-*)
├── .tm-floating-orb (main orb)
├── .tm-orb-menu (context menu)
├── .tm-orb-menu-item (menu items)
└── Animations
    ├── @keyframes tm-orb-pulse
    ├── @keyframes tm-orb-rotate  
    ├── @keyframes tm-orb-float
    ├── @keyframes tm-liquid-flow
    └── @keyframes tm-highlight-dance
```

## 📄 License

This userscript is provided as-is for educational and personal use. Feel free to modify and distribute according to your needs.

## 🙏 Acknowledgments

- **Mozilla Orbit Orb** - Original inspiration for the concept
- **TamperMonkey** - The framework that makes browser automation possible
- **CSS Animations Community** - For the beautiful liquid energy effects inspiration
