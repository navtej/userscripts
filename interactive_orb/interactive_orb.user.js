// ==UserScript==
// @name         Floating Orb
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a draggable floating orb to any webpage that can execute custom functions
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // Inject CSS styles
    const css = `
        .tm-floating-orb {
            position: fixed;
            width: 60px;
            height: 60px;
            background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24);
            background-size: 300% 300%;
            border-radius: 50%;
            cursor: grab;
            user-select: none;
            z-index: 999999;
            top: 20%;
            right: 20px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            animation: tm-orb-glow 3s ease-in-out infinite alternate,
                       tm-gradient-shift 4s ease-in-out infinite;
        }

        .tm-floating-orb:hover {
            transform: scale(1.1);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
        }

        .tm-floating-orb:active,
        .tm-floating-orb.tm-dragging {
            cursor: grabbing;
            transform: scale(0.95);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .tm-floating-orb::before {
            content: '';
            position: absolute;
            top: 15%;
            left: 25%;
            width: 20px;
            height: 20px;
            background: rgba(255, 255, 255, 0.4);
            border-radius: 50%;
            filter: blur(8px);
            animation: tm-shimmer 2s ease-in-out infinite alternate;
        }

        .tm-orb-menu {
            position: fixed;
            background: rgba(0, 0, 0, 0.9);
            border-radius: 8px;
            padding: 10px;
            z-index: 1000000;
            display: none;
            min-width: 200px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .tm-orb-menu-item {
            color: white;
            padding: 8px 12px;
            cursor: pointer;
            border-radius: 4px;
            margin: 2px 0;
            transition: background 0.2s;
            font-family: Arial, sans-serif;
            font-size: 14px;
        }

        .tm-orb-menu-item:hover {
            background: rgba(255, 255, 255, 0.1);
        }

        @keyframes tm-orb-glow {
            0% { filter: brightness(1) saturate(1); }
            100% { filter: brightness(1.2) saturate(1.3); }
        }

        @keyframes tm-gradient-shift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }

        @keyframes tm-shimmer {
            0% { opacity: 0.3; transform: scale(1); }
            100% { opacity: 0.7; transform: scale(1.2); }
        }

        @keyframes tm-bounce {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.2) rotate(10deg); }
            50% { transform: scale(0.9) rotate(-5deg); }
            75% { transform: scale(1.1) rotate(3deg); }
        }

        @keyframes tm-intense-bounce {
            0% { transform: scale(1) rotate(0deg); }
            15% { transform: scale(1.4) rotate(15deg); }
            30% { transform: scale(0.7) rotate(-10deg); }
            45% { transform: scale(1.3) rotate(8deg); }
            60% { transform: scale(0.8) rotate(-5deg); }
            75% { transform: scale(1.2) rotate(3deg); }
            90% { transform: scale(0.9) rotate(-2deg); }
            100% { transform: scale(1) rotate(0deg); }
        }
    `;

    // Inject CSS
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    class TamperMonkeyFloatingOrb {
        constructor() {
            this.orb = null;
            this.menu = null;
            this.isDragging = false;
            this.dragOffset = { x: 0, y: 0 };
            this.lastClickTime = 0;
            this.clickThreshold = 200;
            this.customFunction = null;
            
            this.init();
        }

        init() {
            this.createOrb();
            this.createMenu();
            this.attachEvents();
            
            // Set default function
            this.setCustomFunction(() => {
                alert('Floating Orb clicked! Right-click for options.');
            });
        }

        createOrb() {
            this.orb = document.createElement('div');
            this.orb.className = 'tm-floating-orb';
            this.orb.title = 'Draggable Orb - Click to activate, Right-click for menu';
            document.body.appendChild(this.orb);
        }

        createMenu() {
            this.menu = document.createElement('div');
            this.menu.className = 'tm-orb-menu';
            
            const menuItems = [
                { text: '🎯 Test Alert', action: () => this.testAlert() },
                { text: '🎨 Change Colors', action: () => this.changeColors() },
                { text: '🎪 Bounce Animation', action: () => this.bounceAnimation() },
                { text: '📋 Copy Page Title', action: () => this.copyPageTitle() },
                { text: '🔗 Copy Page URL', action: () => this.copyPageURL() },
                { text: '📜 Scroll to Top', action: () => this.scrollToTop() },
                { text: '📄 Scroll to Bottom', action: () => this.scrollToBottom() },
                { text: '🔍 Highlight Links', action: () => this.highlightLinks() },
                { text: '🎭 Toggle Dark Mode', action: () => this.toggleDarkMode() },
                { text: '❌ Remove Orb', action: () => this.removeOrb() }
            ];

            menuItems.forEach(item => {
                const menuItem = document.createElement('div');
                menuItem.className = 'tm-orb-menu-item';
                menuItem.textContent = item.text;
                menuItem.onclick = () => {
                    item.action();
                    this.hideMenu();
                };
                this.menu.appendChild(menuItem);
            });

            document.body.appendChild(this.menu);
        }

        attachEvents() {
            // Mouse events
            this.orb.addEventListener('mousedown', (e) => {
                if (e.button === 0) { // Left click
                    e.preventDefault();
                    this.startDrag(e.clientX, e.clientY);
                }
            });

            this.orb.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                this.showMenu(e.clientX, e.clientY);
            });

            // Touch events
            this.orb.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const touch = e.touches[0];
                this.startDrag(touch.clientX, touch.clientY);
            });

            // Global events
            document.addEventListener('mousemove', (e) => {
                if (this.isDragging) {
                    this.updatePosition(e.clientX, e.clientY);
                }
            });

            document.addEventListener('touchmove', (e) => {
                if (this.isDragging) {
                    e.preventDefault();
                    const touch = e.touches[0];
                    this.updatePosition(touch.clientX, touch.clientY);
                }
            });

            document.addEventListener('mouseup', () => this.endDrag());
            document.addEventListener('touchend', () => this.endDrag());

            // Hide menu when clicking elsewhere
            document.addEventListener('click', (e) => {
                if (!this.menu.contains(e.target) && e.target !== this.orb) {
                    this.hideMenu();
                }
            });
        }

        startDrag(clientX, clientY) {
            this.isDragging = true;
            this.lastClickTime = Date.now();
            this.orb.classList.add('tm-dragging');
            this.hideMenu();
            
            const rect = this.orb.getBoundingClientRect();
            this.dragOffset = {
                x: clientX - rect.left - rect.width / 2,
                y: clientY - rect.top - rect.height / 2
            };
        }

        updatePosition(clientX, clientY) {
            const x = clientX - this.dragOffset.x;
            const y = clientY - this.dragOffset.y;
            
            const orbSize = this.orb.offsetWidth;
            const maxX = window.innerWidth - orbSize;
            const maxY = window.innerHeight - orbSize;
            
            const constrainedX = Math.max(0, Math.min(x, maxX));
            const constrainedY = Math.max(0, Math.min(y, maxY));
            
            this.orb.style.left = constrainedX + 'px';
            this.orb.style.top = constrainedY + 'px';
            this.orb.style.right = 'auto';
        }

        endDrag() {
            if (this.isDragging) {
                const dragDuration = Date.now() - this.lastClickTime;
                this.isDragging = false;
                this.orb.classList.remove('tm-dragging');
                
                if (dragDuration < this.clickThreshold) {
                    this.executeCustomFunction();
                }
            }
        }

        showMenu(x, y) {
            this.menu.style.display = 'block';
            this.menu.style.left = x + 'px';
            this.menu.style.top = y + 'px';
            
            // Adjust position if menu goes off screen
            const rect = this.menu.getBoundingClientRect();
            if (rect.right > window.innerWidth) {
                this.menu.style.left = (x - rect.width) + 'px';
            }
            if (rect.bottom > window.innerHeight) {
                this.menu.style.top = (y - rect.height) + 'px';
            }
        }

        hideMenu() {
            this.menu.style.display = 'none';
        }

        setCustomFunction(func) {
            this.customFunction = func;
        }

        executeCustomFunction() {
            if (this.customFunction && typeof this.customFunction === 'function') {
                try {
                    this.customFunction();
                } catch (error) {
                    console.error('Error executing orb function:', error);
                }
            }
        }

        // Built-in utility functions
        testAlert() {
            alert(`Hello from ${window.location.hostname}! 🌟\nTime: ${new Date().toLocaleTimeString()}`);
        }

        changeColors() {
            const colors = [
                'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #f9ca24)',
                'linear-gradient(45deg, #a8edea, #fed6e3)',
                'linear-gradient(45deg, #ff9a9e, #fecfef)',
                'linear-gradient(45deg, #667eea, #764ba2)',
                'linear-gradient(45deg, #f093fb, #f5576c)',
                'linear-gradient(45deg, #4facfe, #00f2fe)',
                'linear-gradient(45deg, #43e97b, #38f9d7)',
                'linear-gradient(45deg, #fa709a, #fee140)'
            ];
            
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            this.orb.style.background = randomColor;
            this.orb.style.backgroundSize = '300% 300%';
        }

        bounceAnimation() {
            this.orb.style.animation = 'none';
            this.orb.offsetHeight; // Trigger reflow
            this.orb.style.animation = 'tm-orb-glow 3s ease-in-out infinite alternate, tm-gradient-shift 4s ease-in-out infinite, tm-bounce 0.6s ease-out';
        }

        copyPageTitle() {
            navigator.clipboard.writeText(document.title).then(() => {
                this.showNotification('📋 Page title copied to clipboard!');
            }).catch(() => {
                this.showNotification('❌ Failed to copy title');
            });
        }

        copyPageURL() {
            navigator.clipboard.writeText(window.location.href).then(() => {
                this.showNotification('🔗 Page URL copied to clipboard!');
            }).catch(() => {
                this.showNotification('❌ Failed to copy URL');
            });
        }

        scrollToTop() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            this.showNotification('⬆️ Scrolled to top');
        }

        scrollToBottom() {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
            this.showNotification('⬇️ Scrolled to bottom');
        }

        highlightLinks() {
            const links = document.querySelectorAll('a');
            links.forEach(link => {
                if (link.style.backgroundColor === 'yellow') {
                    link.style.backgroundColor = '';
                    link.style.padding = '';
                } else {
                    link.style.backgroundColor = 'yellow';
                    link.style.padding = '2px 4px';
                }
            });
            this.showNotification('🔍 Links highlighted/unhighlighted');
        }

        toggleDarkMode() {
            const body = document.body;
            if (body.style.filter === 'invert(1) hue-rotate(180deg)') {
                body.style.filter = '';
                this.showNotification('☀️ Dark mode disabled');
            } else {
                body.style.filter = 'invert(1) hue-rotate(180deg)';
                this.showNotification('🌙 Dark mode enabled');
            }
        }

        showNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 1000001;
                font-family: Arial, sans-serif;
                font-size: 14px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
                animation: tm-notification-slide 0.3s ease-out;
            `;
            
            // Add slide animation
            const slideCSS = `
                @keyframes tm-notification-slide {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            if (!document.querySelector('#tm-notification-styles')) {
                const style = document.createElement('style');
                style.id = 'tm-notification-styles';
                style.textContent = slideCSS;
                document.head.appendChild(style);
            }
            
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        removeOrb() {
            if (confirm('Are you sure you want to remove the floating orb?')) {
                this.orb.remove();
                this.menu.remove();
                this.showNotification('👋 Floating orb removed');
            }
        }

        // Auto-start functions
        startAutoFunctions() {
            // Run serial functions with 1ms delay each
            this.runSerialFunctions();
            
            // Run parallel functions immediately
            this.runParallelFunctions();
        }

        async runSerialFunctions() {
            await this.delay(1);
            this.auto_start_serial_1();
            
            await this.delay(1);
            this.auto_start_serial_2();
            
            await this.delay(1);
            this.auto_start_serial_3();
        }

        runParallelFunctions() {
            // Run all parallel functions immediately
            this.auto_start_parallel_1();
            this.auto_start_parallel_2();
            this.auto_start_parallel_3();
        }

        delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Serial auto-start functions (easy to customize)
        auto_start_serial_1() {
            console.log('auto_start_serial_1');
            // Add your custom code here
        }

        auto_start_serial_2() {
            console.log('auto_start_serial_2');
            // Add your custom code here
        }

        auto_start_serial_3() {
            console.log('auto_start_serial_3');
            // Add your custom code here
        }

        // Parallel auto-start functions (easy to customize)
        auto_start_parallel_1() {
            console.log('auto_start_parallel_1');
            // Add your custom code here
        }

        auto_start_parallel_2() {
            console.log('auto_start_parallel_2');
            // Add your custom code here
        }

        auto_start_parallel_3() {
            console.log('auto_start_parallel_3');
            // Add your custom code here
        }
    }

    // Wait for page to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                window.floatingOrb = new TamperMonkeyFloatingOrb();
            }, 1000);
        });
    } else {
        setTimeout(() => {
            window.floatingOrb = new TamperMonkeyFloatingOrb();
        }, 1000);
    }

    // Global API for custom functions and intervals
    window.setOrbFunction = function(func) {
        if (window.floatingOrb) {
            window.floatingOrb.setCustomFunction(func);
            console.log('Orb function updated');
        }
    };

    window.setOrbInterval = function(func, intervalMs, options) {
        if (window.floatingOrb) {
            return window.floatingOrb.setInterval(func, intervalMs, options);
        }
        return null;
    };

    window.clearOrbInterval = function(intervalId) {
        if (window.floatingOrb) {
            return window.floatingOrb.clearInterval(intervalId);
        }
        return false;
    };

    window.listOrbIntervals = function() {
        if (window.floatingOrb) {
            return window.floatingOrb.listIntervals();
        }
        return [];
    };

    window.clearAllOrbIntervals = function() {
        if (window.floatingOrb) {
            return window.floatingOrb.clearAllIntervals();
        }
        return 0;
    };

    // Example usage in console:
    // setOrbFunction(() => console.log('Custom function executed!'));
    // setOrbFunction(() => window.open('https://google.com', '_blank'));
    
    // Interval examples:
    // const id1 = setOrbInterval(() => console.log('Hello every 2 seconds'), 2000);
    // const id2 = setOrbInterval(() => console.log('Immediate then every 5 seconds'), 5000, { immediate: true, name: 'MyInterval' });
    // const id3 = setOrbInterval(() => console.log('Limited runs'), 1000, { maxExecutions: 5, name: 'LimitedInterval' });
    // clearOrbInterval(id1);
    // listOrbIntervals();
    // clearAllOrbIntervals();

})();
