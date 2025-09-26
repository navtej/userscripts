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
            width: 80px;
            height: 80px;
            background: radial-gradient(circle at 30% 30%, 
                rgba(255, 100, 100, 0.9) 0%,
                rgba(255, 60, 60, 0.7) 30%,
                rgba(200, 20, 20, 0.8) 70%,
                rgba(80, 10, 10, 0.9) 100%);
            border-radius: 50%;
            cursor: grab;
            user-select: none;
            z-index: 999999;
            top: 20%;
            right: 20px;
            box-shadow: 
                0 0 30px rgba(255, 60, 60, 0.6),
                0 0 60px rgba(255, 30, 30, 0.4),
                0 0 90px rgba(255, 20, 20, 0.2),
                inset 0 0 30px rgba(255, 100, 100, 0.3);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            animation: tm-orb-pulse 3s ease-in-out infinite,
                       tm-orb-rotate 8s linear infinite,
                       tm-orb-float 4s ease-in-out infinite;
            overflow: hidden;
        }

        .tm-floating-orb:hover {
            transform: scale(1.15);
            box-shadow: 
                0 0 40px rgba(255, 60, 60, 0.8),
                0 0 80px rgba(255, 30, 30, 0.6),
                0 0 120px rgba(255, 20, 20, 0.3),
                inset 0 0 40px rgba(255, 150, 150, 0.4);
        }

        .tm-floating-orb:active,
        .tm-floating-orb.tm-dragging {
            cursor: grabbing;
            transform: scale(0.9);
            box-shadow: 
                0 0 20px rgba(255, 60, 60, 0.9),
                0 0 40px rgba(255, 30, 30, 0.7),
                inset 0 0 20px rgba(255, 80, 80, 0.5);
        }

        .tm-floating-orb::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(from 0deg,
                rgba(255, 120, 120, 0.0) 0deg,
                rgba(255, 80, 80, 0.6) 60deg,
                rgba(255, 100, 100, 0.8) 120deg,
                rgba(255, 60, 60, 0.4) 180deg,
                rgba(255, 140, 140, 0.7) 240deg,
                rgba(255, 90, 90, 0.5) 300deg,
                rgba(255, 120, 120, 0.0) 360deg);
            border-radius: 50%;
            animation: tm-liquid-flow 6s linear infinite;
            filter: blur(8px);
            opacity: 0.7;
        }

        .tm-floating-orb::after {
            content: '';
            position: absolute;
            top: 15%;
            left: 20%;
            width: 25%;
            height: 25%;
            background: radial-gradient(circle,
                rgba(255, 200, 200, 0.9) 0%,
                rgba(255, 150, 150, 0.4) 50%,
                transparent 70%);
            border-radius: 50%;
            filter: blur(4px);
            animation: tm-highlight-dance 4s ease-in-out infinite;
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

        @keyframes tm-orb-pulse {
            0%, 100% { 
                filter: brightness(1) saturate(1);
                transform: scale(1);
            }
            50% { 
                filter: brightness(1.3) saturate(1.4);
                transform: scale(1.05);
            }
        }

        @keyframes tm-orb-rotate {
            from { 
                background: radial-gradient(circle at 30% 30%, 
                    rgba(255, 100, 100, 0.9) 0%,
                    rgba(255, 60, 60, 0.7) 30%,
                    rgba(200, 20, 20, 0.8) 70%,
                    rgba(80, 10, 10, 0.9) 100%);
            }
            25% { 
                background: radial-gradient(circle at 70% 30%, 
                    rgba(255, 120, 80, 0.9) 0%,
                    rgba(255, 80, 40, 0.7) 30%,
                    rgba(220, 30, 10, 0.8) 70%,
                    rgba(90, 15, 5, 0.9) 100%);
            }
            50% { 
                background: radial-gradient(circle at 70% 70%, 
                    rgba(255, 140, 60, 0.9) 0%,
                    rgba(255, 100, 20, 0.7) 30%,
                    rgba(240, 40, 0, 0.8) 70%,
                    rgba(100, 20, 0, 0.9) 100%);
            }
            75% { 
                background: radial-gradient(circle at 30% 70%, 
                    rgba(255, 80, 120, 0.9) 0%,
                    rgba(255, 40, 80, 0.7) 30%,
                    rgba(200, 10, 30, 0.8) 70%,
                    rgba(80, 5, 15, 0.9) 100%);
            }
            to { 
                background: radial-gradient(circle at 30% 30%, 
                    rgba(255, 100, 100, 0.9) 0%,
                    rgba(255, 60, 60, 0.7) 30%,
                    rgba(200, 20, 20, 0.8) 70%,
                    rgba(80, 10, 10, 0.9) 100%);
            }
        }

        @keyframes tm-orb-float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-8px) rotate(2deg); }
            66% { transform: translateY(4px) rotate(-1deg); }
        }

        @keyframes tm-liquid-flow {
            0% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(90deg) scale(1.1); }
            50% { transform: rotate(180deg) scale(1.05); }
            75% { transform: rotate(270deg) scale(1.15); }
            100% { transform: rotate(360deg) scale(1); }
        }

        @keyframes tm-highlight-dance {
            0% { 
                transform: translate(0, 0) scale(1);
                opacity: 0.8;
            }
            25% { 
                transform: translate(8px, -4px) scale(1.2);
                opacity: 0.6;
            }
            50% { 
                transform: translate(-2px, 6px) scale(0.9);
                opacity: 0.9;
            }
            75% { 
                transform: translate(-6px, -2px) scale(1.1);
                opacity: 0.7;
            }
            100% { 
                transform: translate(0, 0) scale(1);
                opacity: 0.8;
            }
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
            this.clickFunction = null;
            
            this.init();
        }

        init() {
            this.createOrb();
            this.createMenu();
            this.attachEvents();
            
            // Set default function
            this.setClickFunction(() => {
                alert('Floating Orb clicked! Right-click for options.');
            });

            // Start auto functions after orb is created
            this.startAutoFunctions();

            // Apply any queued functions that were set before orb was ready
            this.applyPreInitQueue();
        }

        applyPreInitQueue() {
            if (window.orbPreInitQueue) {
                // Apply queued click function
                if (window.orbPreInitQueue.clickFunction) {
                    this.setClickFunction(window.orbPreInitQueue.clickFunction);
                    console.log('Applied queued click function');
                }

                // Apply queued serial functions
                if (window.orbPreInitQueue.serialFunctions.serial_1) {
                    this.auto_start_serial_1 = window.orbPreInitQueue.serialFunctions.serial_1;
                    console.log('Applied queued serial function 1');
                }
                if (window.orbPreInitQueue.serialFunctions.serial_2) {
                    this.auto_start_serial_2 = window.orbPreInitQueue.serialFunctions.serial_2;
                    console.log('Applied queued serial function 2');
                }
                if (window.orbPreInitQueue.serialFunctions.serial_3) {
                    this.auto_start_serial_3 = window.orbPreInitQueue.serialFunctions.serial_3;
                    console.log('Applied queued serial function 3');
                }

                // Apply queued parallel functions
                if (window.orbPreInitQueue.parallelFunctions.parallel_1) {
                    this.auto_start_parallel_1 = window.orbPreInitQueue.parallelFunctions.parallel_1;
                    console.log('Applied queued parallel function 1');
                }
                if (window.orbPreInitQueue.parallelFunctions.parallel_2) {
                    this.auto_start_parallel_2 = window.orbPreInitQueue.parallelFunctions.parallel_2;
                    console.log('Applied queued parallel function 2');
                }
                if (window.orbPreInitQueue.parallelFunctions.parallel_3) {
                    this.auto_start_parallel_3 = window.orbPreInitQueue.parallelFunctions.parallel_3;
                    console.log('Applied queued parallel function 3');
                }

                // Apply queued intervals
                window.orbPreInitQueue.intervals.forEach(queuedInterval => {
                    this.setInterval(queuedInterval.func, queuedInterval.intervalMs, queuedInterval.options);
                    console.log('Applied queued interval');
                });

                // Clear the queue
                window.orbPreInitQueue = { 
                    clickFunction: null, 
                    intervals: [],
                    serialFunctions: { serial_1: null, serial_2: null, serial_3: null },
                    parallelFunctions: { parallel_1: null, parallel_2: null, parallel_3: null }
                };
            }
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
                { text: '⏱️ List Intervals', action: () => this.listIntervals() },
                { text: '🛑 Stop All Intervals', action: () => this.clearAllIntervals() },
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
                    this.executeClickFunction();
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

        setClickFunction(func) {
            this.clickFunction = func;
        }

        executeClickFunction() {
            if (this.clickFunction && typeof this.clickFunction === 'function') {
                try {
                    this.clickFunction();
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
            const liquidStyles = [
                // Original flowing red-orange
                `radial-gradient(circle at 30% 30%, 
                    rgba(255, 100, 100, 0.9) 0%,
                    rgba(255, 60, 60, 0.7) 30%,
                    rgba(200, 20, 20, 0.8) 70%,
                    rgba(80, 10, 10, 0.9) 100%)`,
                
                // Blue plasma
                `radial-gradient(circle at 40% 20%, 
                    rgba(100, 150, 255, 0.9) 0%,
                    rgba(60, 120, 255, 0.7) 30%,
                    rgba(20, 80, 200, 0.8) 70%,
                    rgba(10, 40, 80, 0.9) 100%)`,
                
                // Purple energy
                `radial-gradient(circle at 60% 40%, 
                    rgba(200, 100, 255, 0.9) 0%,
                    rgba(160, 60, 255, 0.7) 30%,
                    rgba(100, 20, 200, 0.8) 70%,
                    rgba(50, 10, 80, 0.9) 100%)`,
                
                // Green mystical
                `radial-gradient(circle at 25% 60%, 
                    rgba(100, 255, 150, 0.9) 0%,
                    rgba(60, 255, 120, 0.7) 30%,
                    rgba(20, 200, 80, 0.8) 70%,
                    rgba(10, 80, 40, 0.9) 100%)`,
                
                // Golden fire
                `radial-gradient(circle at 50% 30%, 
                    rgba(255, 200, 100, 0.9) 0%,
                    rgba(255, 160, 60, 0.7) 30%,
                    rgba(200, 100, 20, 0.8) 70%,
                    rgba(80, 40, 10, 0.9) 100%)`,
                
                // Cyan crystal
                `radial-gradient(circle at 35% 50%, 
                    rgba(100, 255, 255, 0.9) 0%,
                    rgba(60, 220, 255, 0.7) 30%,
                    rgba(20, 150, 200, 0.8) 70%,
                    rgba(10, 60, 80, 0.9) 100%)`
            ];
            
            const glowColors = [
                'rgba(255, 60, 60, 0.6)', // red
                'rgba(60, 120, 255, 0.6)', // blue  
                'rgba(160, 60, 255, 0.6)', // purple
                'rgba(60, 255, 120, 0.6)', // green
                'rgba(255, 160, 60, 0.6)', // golden
                'rgba(60, 220, 255, 0.6)'  // cyan
            ];
            
            const randomIndex = Math.floor(Math.random() * liquidStyles.length);
            const selectedGradient = liquidStyles[randomIndex];
            const selectedGlow = glowColors[randomIndex];
            
            this.orb.style.background = selectedGradient;
            this.orb.style.boxShadow = `
                0 0 30px ${selectedGlow},
                0 0 60px ${selectedGlow.replace('0.6', '0.4')},
                0 0 90px ${selectedGlow.replace('0.6', '0.2')},
                inset 0 0 30px ${selectedGlow.replace('0.6', '0.3')}`;
        }

        bounceAnimation() {
            this.orb.style.animation = 'none';
            this.orb.offsetHeight; // Trigger reflow
            this.orb.style.animation = `
                tm-orb-pulse 3s ease-in-out infinite,
                tm-orb-rotate 8s linear infinite,
                tm-orb-float 4s ease-in-out infinite,
                tm-intense-bounce 0.8s ease-out`;
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

        // Interval function manager
        setInterval(func, intervalMs, options = {}) {
            const {
                immediate = false,  // Run immediately before starting interval
                maxExecutions = null,  // Limit number of executions (null = infinite)
                name = null  // Optional name for tracking
            } = options;

            if (typeof func !== 'function') {
                console.error('setInterval: First argument must be a function');
                return null;
            }

            if (typeof intervalMs !== 'number' || intervalMs <= 0) {
                console.error('setInterval: Second argument must be a positive number (milliseconds)');
                return null;
            }

            let executionCount = 0;
            let intervalId = null;

            const executeFunction = () => {
                try {
                    if (maxExecutions && executionCount >= maxExecutions) {
                        this.clearInterval(intervalId);
                        return;
                    }
                    
                    func();
                    executionCount++;
                    
                    if (name) {
                        console.log(`Interval "${name}" executed (${executionCount}${maxExecutions ? `/${maxExecutions}` : ''})`);
                    }
                } catch (error) {
                    console.error(`Error in interval${name ? ` "${name}"` : ''}:`, error);
                }
            };

            // Run immediately if requested
            if (immediate) {
                executeFunction();
            }

            // Start the interval
            intervalId = window.setInterval(executeFunction, intervalMs);

            // Store interval info for tracking
            if (!this.activeIntervals) {
                this.activeIntervals = new Map();
            }

            const intervalInfo = {
                id: intervalId,
                func: func,
                interval: intervalMs,
                executionCount: () => executionCount,
                name: name || `interval_${intervalId}`,
                startTime: Date.now()
            };

            this.activeIntervals.set(intervalId, intervalInfo);

            console.log(`Started interval${name ? ` "${name}"` : ''} (ID: ${intervalId}) - ${intervalMs}ms`);
            return intervalId;
        }

        // Clear specific interval
        clearInterval(intervalId) {
            if (intervalId) {
                window.clearInterval(intervalId);
                
                if (this.activeIntervals && this.activeIntervals.has(intervalId)) {
                    const info = this.activeIntervals.get(intervalId);
                    console.log(`Stopped interval "${info.name}" (ID: ${intervalId})`);
                    this.activeIntervals.delete(intervalId);
                }
                
                return true;
            }
            return false;
        }

        // Clear all active intervals
        clearAllIntervals() {
            if (this.activeIntervals) {
                let count = 0;
                for (const [id, info] of this.activeIntervals) {
                    window.clearInterval(id);
                    console.log(`Stopped interval "${info.name}" (ID: ${id})`);
                    count++;
                }
                this.activeIntervals.clear();
                this.showNotification(`🛑 Stopped ${count} active intervals`);
                return count;
            }
            return 0;
        }

        // List all active intervals
        listIntervals() {
            if (!this.activeIntervals || this.activeIntervals.size === 0) {
                console.log('No active intervals');
                return [];
            }

            const intervals = [];
            console.log('Active Intervals:');
            for (const [id, info] of this.activeIntervals) {
                const runtime = Date.now() - info.startTime;
                const intervalData = {
                    id: id,
                    name: info.name,
                    interval: info.interval,
                    executionCount: info.executionCount(),
                    runtime: runtime
                };
                intervals.push(intervalData);
                console.log(`  ${info.name} (ID: ${id}) - ${info.interval}ms, executed ${info.executionCount()} times, running for ${runtime}ms`);
            }
            return intervals;
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

    // Pre-initialization storage for functions set before orb is ready
    window.orbPreInitQueue = {
        clickFunction: null,
        intervals: [],
        serialFunctions: {
            serial_1: null,
            serial_2: null,
            serial_3: null
        },
        parallelFunctions: {
            parallel_1: null,
            parallel_2: null,
            parallel_3: null
        }
    };

    // Global API for custom functions and intervals
    window.setOrbClickFunction = function(func) {
        if (window.floatingOrb) {
            window.floatingOrb.setClickFunction(func);
            console.log('Orb click function updated');
        } else {
            // Store for later when orb is created
            window.orbPreInitQueue.clickFunction = func;
            console.log('Orb click function queued (orb not ready yet)');
        }
    };

    window.setOrbInterval = function(func, intervalMs, options) {
        if (window.floatingOrb) {
            return window.floatingOrb.setInterval(func, intervalMs, options);
        } else {
            // Store for later when orb is created
            const queuedInterval = { func, intervalMs, options };
            window.orbPreInitQueue.intervals.push(queuedInterval);
            console.log('Interval queued (orb not ready yet)');
            return 'queued';
        }
    };

    // Serial function setters
    window.setOrbSerial1 = function(func) {
        if (window.floatingOrb) {
            window.floatingOrb.auto_start_serial_1 = func;
            console.log('Serial function 1 updated');
        } else {
            window.orbPreInitQueue.serialFunctions.serial_1 = func;
            console.log('Serial function 1 queued (orb not ready yet)');
        }
    };

    window.setOrbSerial2 = function(func) {
        if (window.floatingOrb) {
            window.floatingOrb.auto_start_serial_2 = func;
            console.log('Serial function 2 updated');
        } else {
            window.orbPreInitQueue.serialFunctions.serial_2 = func;
            console.log('Serial function 2 queued (orb not ready yet)');
        }
    };

    window.setOrbSerial3 = function(func) {
        if (window.floatingOrb) {
            window.floatingOrb.auto_start_serial_3 = func;
            console.log('Serial function 3 updated');
        } else {
            window.orbPreInitQueue.serialFunctions.serial_3 = func;
            console.log('Serial function 3 queued (orb not ready yet)');
        }
    };

    // Parallel function setters
    window.setOrbParallel1 = function(func) {
        if (window.floatingOrb) {
            window.floatingOrb.auto_start_parallel_1 = func;
            console.log('Parallel function 1 updated');
        } else {
            window.orbPreInitQueue.parallelFunctions.parallel_1 = func;
            console.log('Parallel function 1 queued (orb not ready yet)');
        }
    };

    window.setOrbParallel2 = function(func) {
        if (window.floatingOrb) {
            window.floatingOrb.auto_start_parallel_2 = func;
            console.log('Parallel function 2 updated');
        } else {
            window.orbPreInitQueue.parallelFunctions.parallel_2 = func;
            console.log('Parallel function 2 queued (orb not ready yet)');
        }
    };

    window.setOrbParallel3 = function(func) {
        if (window.floatingOrb) {
            window.floatingOrb.auto_start_parallel_3 = func;
            console.log('Parallel function 3 updated');
        } else {
            window.orbPreInitQueue.parallelFunctions.parallel_3 = func;
            console.log('Parallel function 3 queued (orb not ready yet)');
        }
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

    // Utility function to set all serial functions at once
    window.setAllOrbSerialFunctions = function(func1, func2, func3) {
        setOrbSerial1(func1);
        setOrbSerial2(func2);
        setOrbSerial3(func3);
    };

    // Utility function to set all parallel functions at once
    window.setAllOrbParallelFunctions = function(func1, func2, func3) {
        setOrbParallel1(func1);
        setOrbParallel2(func2);
        setOrbParallel3(func3);
    };

    // Example usage in console:
    // setOrbClickFunction(() => console.log('Custom function executed!'));
    // setOrbClickFunction(() => window.open('https://google.com', '_blank'));
    
    // Interval examples:
    // const id1 = setOrbInterval(() => console.log('Hello every 2 seconds'), 2000);
    // const id2 = setOrbInterval(() => console.log('Immediate then every 5 seconds'), 5000, { immediate: true, name: 'MyInterval' });
    // const id3 = setOrbInterval(() => console.log('Limited runs'), 1000, { maxExecutions: 5, name: 'LimitedInterval' });
    // clearOrbInterval(id1);
    // listOrbIntervals();
    // clearAllOrbIntervals();

    // ===== CUSTOM USER FUNCTIONS - Add your custom functions here =====
    
    // Example of setting a custom click function within the userscript:
    let testFn = function(){
        console.log("my custom function");
    };
    setOrbClickFunction(testFn);

    // Example of setting serial functions within the userscript:
    setOrbSerial1(() => {
        console.log("Custom serial function 1 - runs first");
        // Check if we're on GitHub
        if (window.location.hostname.includes('github.com')) {
            console.log("GitHub detected in serial 1!");
        }
    });

    setOrbSerial2(() => {
        console.log("Custom serial function 2 - runs second (1ms later)");
        // Inject custom CSS
        const style = document.createElement('style');
        style.textContent = '.custom-highlight { background: yellow !important; }';
        document.head.appendChild(style);
    });

    setOrbSerial3(() => {
        console.log("Custom serial function 3 - runs third (2ms later)");
        // Store page load time
        window.customPageLoadTime = Date.now();
    });

    // Example of setting parallel functions within the userscript:
    setOrbParallel1(() => {
        console.log("Custom parallel function 1 - runs immediately");
        // Set up keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'h') {
                console.log('Custom hotkey pressed!');
            }
        });
    });

    setOrbParallel2(() => {
        console.log("Custom parallel function 2 - runs immediately");
        // Initialize page monitoring
        const observer = new MutationObserver((mutations) => {
            if (mutations.length > 5) {
                console.log('Significant page changes detected:', mutations.length);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });

    setOrbParallel3(() => {
        console.log("Custom parallel function 3 - runs immediately");
        // Set up custom data collection
        window.customPageStats = {
            loadTime: Date.now(),
            initialLinks: document.querySelectorAll('a').length,
            initialImages: document.querySelectorAll('img').length
        };
    });

    // Example of setting intervals within the userscript:
    // setOrbInterval(() => console.log('Auto message every 5 seconds'), 5000, { name: 'UserScript Interval' });

    // More examples:
    // setOrbClickFunction(() => {
    //     // Custom functionality here
    //     alert('Hello from custom userscript function!');
    //     console.log('Current page:', window.location.href);
    // });

})();
