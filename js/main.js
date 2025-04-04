// Main JavaScript for Lina's Portfolio
document.addEventListener('DOMContentLoaded', function() {
    // Initialize core functionalities
    initSplashScreen();
    initNavigation();
    initScrollAnimations();
    initParallaxEffect();
    initSkillsAnimation();
    initProjectFilters();
    initMoleculeDecorations();
    initTypingEffect();
    initContactFormEffects();
    initTooltips();
    initAnimatedBackgrounds();
    initTiltEffect();
    initLabView();

    // Add class to body when page is fully loaded
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle navigation menu
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();

            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80, // Adjust for header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Change header on scroll
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// Scroll animations for elements
function initScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in-section');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            }
        });
    }, { threshold: 0.15 });

    fadeElements.forEach(element => {
        observer.observe(element);
    });

    // Also use for animate-on-scroll elements
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.15 });

    animatedElements.forEach(element => {
        animationObserver.observe(element);
    });
}

// Parallax effect for background elements
function initParallaxEffect() {
    window.addEventListener('scroll', function() {
        const parallaxElements = document.querySelectorAll('.parallax');

        parallaxElements.forEach(element => {
            const speed = element.getAttribute('data-speed') || 0.5;
            const yPos = -(window.scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Animate skill bars when in viewport
function initSkillsAnimation() {
    const skillBars = document.querySelectorAll('.skill-level');

    skillBars.forEach(bar => {
        // Get skill percentage from inline style or data attribute
        const percentage = bar.style.width || bar.getAttribute('data-percent');
        // Store it as a CSS variable
        bar.style.setProperty('--skill-percent', percentage);
        // Reset width for animation
        bar.style.width = 0;
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, { threshold: 0.2 });

    skillBars.forEach(bar => {
        observer.observe(bar);
    });
}

// Project filtering
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length === 0 || projectCards.length === 0) return;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Get filter value
            const filter = this.getAttribute('data-filter');

            // Filter projects with GSAP for smooth animations
            if (typeof gsap !== 'undefined') {
                projectCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        gsap.to(card, {
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            duration: 0.5,
                            delay: Math.random() * 0.3,
                            ease: 'power2.out',
                            onStart: function() {
                                card.style.display = 'block';
                            }
                        });
                    } else {
                        gsap.to(card, {
                            opacity: 0,
                            y: 20,
                            scale: 0.9,
                            duration: 0.5,
                            ease: 'power2.in',
                            onComplete: function() {
                                card.style.display = 'none';
                            }
                        });
                    }
                });
            } else {
                // Fallback without GSAP
                projectCards.forEach(card => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(20px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 500);
                    }
                });
            }
        });
    });
}

// Add dynamic molecule decorations
function initMoleculeDecorations() {
    const sections = document.querySelectorAll('.section');

    sections.forEach(section => {
        // Add 2-4 random molecule decorations to each section
        const count = Math.floor(Math.random() * 3) + 2;

        for (let i = 0; i < count; i++) {
            const molecule = document.createElement('div');
            molecule.classList.add('molecule-decoration');

            // Random position
            molecule.style.top = `${Math.random() * 80 + 10}%`;
            molecule.style.left = `${Math.random() * 80 + 10}%`;

            // Random size
            const size = Math.random() * 100 + 50;
            molecule.style.width = `${size}px`;
            molecule.style.height = `${size}px`;

            // Random animation duration
            const duration = Math.random() * 20 + 10;
            molecule.style.animation = `float ${duration}s ease-in-out infinite`;
            molecule.style.animationDelay = `${Math.random() * 5}s`;

            section.appendChild(molecule);
        }
    });
}

// Typing effect for hero heading
function initTypingEffect() {
    const heroHeading = document.querySelector('.hero h1');
    const heroParagraph = document.querySelector('.hero p');

    if (heroHeading && !heroHeading.classList.contains('typing-animation')) {
        // Save original text
        const originalText = heroHeading.textContent;

        // Clear and add typing class
        heroHeading.textContent = '';
        heroHeading.classList.add('typing-animation');

        // Set width based on text length for typing animation
        heroHeading.style.width = `${originalText.length}ch`;

        // Animate typing
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                heroHeading.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            } else {
                // When done, start paragraph fade in
                if (heroParagraph) {
                    heroParagraph.style.opacity = '0';
                    heroParagraph.style.transform = 'translateY(20px)';

                    setTimeout(() => {
                        heroParagraph.style.transition = 'opacity 1s ease, transform 1s ease';
                        heroParagraph.style.opacity = '1';
                        heroParagraph.style.transform = 'translateY(0)';
                    }, 200);
                }
            }
        };

        // Start typing after a short delay
        setTimeout(typeWriter, 500);
    }
}

// Enhanced contact form effects
function initContactFormEffects() {
    const formInputs = document.querySelectorAll('.form-group input, .form-group textarea');
    const submitBtn = document.getElementById('submit-btn');

    // Add floating label effect
    formInputs.forEach(input => {
        const formGroup = input.parentElement;

        // Create and add a label element if it doesn't exist
        if (!formGroup.querySelector('label')) {
            const label = document.createElement('label');
            label.setAttribute('for', input.id);
            label.textContent = input.placeholder;
            label.style.position = 'absolute';
            label.style.left = '15px';
            label.style.top = '15px';
            label.style.transition = 'all 0.3s ease';
            label.style.pointerEvents = 'none';
            label.style.opacity = '0.7';

            formGroup.style.position = 'relative';
            formGroup.insertBefore(label, input);
        }

        // Handle input focus and blur
        input.addEventListener('focus', function() {
            const label = this.previousElementSibling;
            label.style.top = '-12px';
            label.style.fontSize = '12px';
            label.style.opacity = '1';
            label.style.color = 'var(--primary-color)';
            label.style.backgroundColor = 'white';
            label.style.padding = '0 5px';
        });

        input.addEventListener('blur', function() {
            const label = this.previousElementSibling;
            if (this.value === '') {
                label.style.top = '15px';
                label.style.fontSize = '';
                label.style.opacity = '0.7';
                label.style.color = '';
                label.style.backgroundColor = 'transparent';
                label.style.padding = '0';
            }
        });

        // Check if input has value on load
        if (input.value !== '') {
            const label = input.previousElementSibling;
            label.style.top = '-12px';
            label.style.fontSize = '12px';
            label.style.opacity = '1';
            label.style.backgroundColor = 'white';
            label.style.padding = '0 5px';
        }
    });

    // Add ripple effect to submit button
    if (submitBtn) {
        submitBtn.classList.add('btn-glow');

        submitBtn.addEventListener('click', function(e) {
            // Add ripple effect on click
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            this.appendChild(ripple);

            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);

            ripple.style.width = ripple.style.height = `${size}px`;
            ripple.style.left = `${e.clientX - rect.left - size/2}px`;
            ripple.style.top = `${e.clientY - rect.top - size/2}px`;

            ripple.classList.add('active');

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    }

    // Form submission
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Animate button
            submitBtn.innerHTML = 'Sending...';
            submitBtn.disabled = true;

            // Simulate form submission
            setTimeout(() => {
                submitBtn.innerHTML = 'Message Sent!';
                submitBtn.style.backgroundColor = '#5cb85c';

                // Reset form
                contactForm.reset();

                // Reset button after 3 seconds
                setTimeout(() => {
                    submitBtn.innerHTML = 'Send Message';
                    submitBtn.style.backgroundColor = '';
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
}

// Initialize tooltips
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');

    tooltipElements.forEach(element => {
        const tooltipText = element.getAttribute('data-tooltip');

        // Create tooltip
        const tooltip = document.createElement('span');
        tooltip.classList.add('tooltip-text');
        tooltip.textContent = tooltipText;

        // Add tooltip to element
        element.classList.add('tooltip');
        element.appendChild(tooltip);
    });
}

// Function to create animated background for sections
function initAnimatedBackgrounds() {
    const sections = document.querySelectorAll('.section');

    sections.forEach((section, index) => {
        // Add animated background to alternating sections
        if (index % 2 === 0) {
            section.classList.add('section-animated-bg');
        }
    });

    // Add canvas background to about section
    addCanvasBackground('about');
}

// Add an immersive canvas background to a section
function addCanvasBackground(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.classList.add('background-canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.zIndex = '-1';
    canvas.style.opacity = '0.8';

    // Insert canvas as first child of section
    section.insertBefore(canvas, section.firstChild);

    // Set canvas size
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;

    // Get context
    const ctx = canvas.getContext('2d');

    // Particles array
    const particles = [];
    const particleCount = 50;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            color: `rgba(91, 166, 201, ${Math.random() * 0.2 + 0.1})`,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25
        });
    }

    // Draw function
    function draw() {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw particles
        particles.forEach(particle => {
            // Move particle
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Bounce off edges
            if (particle.x < 0 || particle.x > canvas.width) {
                particle.speedX = -particle.speedX;
            }

            if (particle.y < 0 || particle.y > canvas.height) {
                particle.speedY = -particle.speedY;
            }

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
        });

        // Draw connections
        ctx.strokeStyle = 'rgba(91, 166, 201, 0.05)';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(draw);
    }

    // Start animation
    draw();

    // Update canvas size on window resize
    window.addEventListener('resize', function() {
        canvas.width = section.offsetWidth;
        canvas.height = section.offsetHeight;
    });
}

// Function to create a tilt effect on cards
function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card, .interest-card, .stat-item');

    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const tiltX = (y - centerY) / 10;
            const tiltY = -(x - centerX) / 10;

            this.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.transition = 'transform 0.5s ease';
        });
    });
}

// Initialize interactive laboratory/microscope view in projects section
function initLabView() {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;

    // Create toggle button
    const toggleBtn = document.createElement('button');
    toggleBtn.classList.add('btn', 'btn-secondary', 'lab-view-toggle');
    toggleBtn.innerHTML = '<i class="fas fa-microscope"></i> Lab View';
    toggleBtn.style.position = 'absolute';
    toggleBtn.style.top = '20px';
    toggleBtn.style.right = '20px';

    // Add button to projects section
    projectsSection.style.position = 'relative';
    projectsSection.appendChild(toggleBtn);

    // Create lab view container
    const labView = document.createElement('div');
    labView.classList.add('lab-view');
    labView.style.position = 'absolute';
    labView.style.top = '0';
    labView.style.left = '0';
    labView.style.width = '100%';
    labView.style.height = '100%';
    labView.style.backgroundColor = 'rgba(24, 52, 70, 0.95)';
    labView.style.zIndex = '10';
    labView.style.display = 'none';
    labView.style.justifyContent = 'center';
    labView.style.alignItems = 'center';
    labView.style.padding = '40px';
    labView.style.overflowY = 'auto';

    // Add close button
    const closeBtn = document.createElement('button');
    closeBtn.classList.add('lab-view-close');
    closeBtn.innerHTML = '&times;';
    closeBtn.style.position = 'absolute';
    closeBtn.style.top = '20px';
    closeBtn.style.right = '20px';
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '30px';
    closeBtn.style.cursor = 'pointer';

    labView.appendChild(closeBtn);

    // Create microscope view container
    const microscopeView = document.createElement('div');
    microscopeView.classList.add('microscope-view');
    microscopeView.style.width = '80%';
    microscopeView.style.maxWidth = '800px';
    microscopeView.style.height = '500px';
    microscopeView.style.border = '20px solid #333';
    microscopeView.style.borderRadius = '50%';
    microscopeView.style.position = 'relative';
    microscopeView.style.overflow = 'hidden';
    microscopeView.style.boxShadow = '0 0 50px rgba(137, 208, 225, 0.5)';

    labView.appendChild(microscopeView);

    // Add lab view to projects section
    projectsSection.appendChild(labView);

    // Toggle lab view
    toggleBtn.addEventListener('click', function() {
        labView.style.display = 'flex';
        initMicroscopeCanvas(microscopeView);
    });

    // Close lab view
    closeBtn.addEventListener('click', function() {
        labView.style.display = 'none';
    });
}

// Initialize microscope canvas
function initMicroscopeCanvas(container) {
    // Clear previous canvas if exists
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = container.offsetWidth;
    canvas.height = container.offsetHeight;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    // Create microscope cells
    const cells = [];
    const cellCount = 20;

    for (let i = 0; i < cellCount; i++) {
        cells.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 30 + 20,
            color: `rgba(${Math.random() * 100 + 50}, ${Math.random() * 100 + 100}, ${Math.random() * 100 + 150}, 0.7)`,
            speedX: Math.random() * 0.5 - 0.25,
            speedY: Math.random() * 0.5 - 0.25,
            nucleusRadius: Math.random() * 10 + 5
        });
    }

    // Draw function
    function drawMicroscope() {
        // Clear canvas with dark background
        ctx.fillStyle = 'rgba(10, 20, 30, 0.95)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw grid lines
        ctx.strokeStyle = 'rgba(91, 166, 201, 0.1)';
        ctx.lineWidth = 1;

        // Vertical lines
        for (let x = 0; x < canvas.width; x += 20) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        // Horizontal lines
        for (let y = 0; y < canvas.height; y += 20) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }

        // Update and draw cells
        cells.forEach(cell => {
            // Move cell
            cell.x += cell.speedX;
            cell.y += cell.speedY;

            // Bounce off edges
            if (cell.x - cell.radius < 0 || cell.x + cell.radius > canvas.width) {
                cell.speedX = -cell.speedX;
            }

            if (cell.y - cell.radius < 0 || cell.y + cell.radius > canvas.height) {
                cell.speedY = -cell.speedY;
            }

            // Draw cell
            ctx.beginPath();
            ctx.arc(cell.x, cell.y, cell.radius, 0, Math.PI * 2);
            ctx.fillStyle = cell.color;
            ctx.fill();

            // Draw cell nucleus
            ctx.beginPath();
            ctx.arc(cell.x, cell.y, cell.nucleusRadius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(20, 30, 50, 0.8)';
            ctx.fill();

            // Draw cell membrane
            ctx.beginPath();
            ctx.arc(cell.x, cell.y, cell.radius, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Add microscope lens effect (circular gradient)
        const gradient = ctx.createRadialGradient(
            canvas.width / 2,
            canvas.height / 2,
            0,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width / 2
        );

        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.7, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.9)');

        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        requestAnimationFrame(drawMicroscope);
    }

    // Start animation
    drawMicroscope();
}

// Splash screen functionality
function initSplashScreen() {
    const splashScreen = document.getElementById('splashScreen');
    const splashButton = document.getElementById('splashButton');

    // Check if user has seen the splash screen before
    const hasSeenSplash = localStorage.getItem('hasSeenSplash');

    if (hasSeenSplash) {
        // If user has seen splash before, hide it immediately
        splashScreen.classList.add('splash-hidden');
    } else {
        // Prevent scrolling while splash is visible
        document.body.style.overflow = 'hidden';

        // Add event listener to the button
        splashButton.addEventListener('click', function() {
            // Hide splash screen
            splashScreen.classList.add('splash-hidden');

            // Re-enable scrolling
            document.body.style.overflow = '';

            // Save to localStorage so it doesn't show again in this session
            localStorage.setItem('hasSeenSplash', 'true');
        });
    }
}

// Initialize interactive hints
function initInteractiveHints() {
    // Add hint for skills sphere
    addHint(
        'skills-sphere',
        'top-right',
        '<i class="fas fa-hand-pointer"></i> Click and drag to rotate the skills sphere. Who knew science could be this fun to play with!',
        { top: '10px', right: '10px' }
    );

    // Add hint for timeline container
    addHint(
        'timeline-container',
        'top-left',
        '<i class="fas fa-mouse"></i> Click to pause rotation, then try moving your mouse to explore my timeline. Time travel has never been so easy!',
        { top: '10px', left: '10px' }
    );

    // Add hint for project section lab view
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        // This hint will be added near the lab view toggle button
        const labViewToggle = projectsSection.querySelector('.lab-view-toggle');
        if (labViewToggle) {
            const hintDiv = document.createElement('div');
            hintDiv.classList.add('hint-bubble');
            hintDiv.innerHTML = '<i class="fas fa-flask"></i> Click here to enter "Lab View" mode and see my projects under the microscope! No lab coat required.';
            hintDiv.style.position = 'absolute';
            hintDiv.style.top = '20px';
            hintDiv.style.right = '80px';
            projectsSection.appendChild(hintDiv);

            // Show hint when hovering over the lab view toggle
            labViewToggle.addEventListener('mouseenter', function() {
                hintDiv.classList.add('visible');
            });

            labViewToggle.addEventListener('mouseleave', function() {
                hintDiv.classList.remove('visible');
            });
        }
    }

    // Add hint for hero DNA helix
    addHint(
        'hero-canvas',
        'bottom-right',
        '<i class="fas fa-dna"></i> Move your mouse around to interact with the DNA helix. Don\'t worry, no genetic modification is happening!',
        { bottom: '60px', right: '20px' }
    );
}

// Helper function to add a hint to a specific element
function addHint(elementId, position, hintText, coordinates) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // Create hint icon
    const hintIcon = document.createElement('div');
    hintIcon.classList.add('hint-icon');
    hintIcon.innerHTML = '<i class="fas fa-info"></i>';

    // Position hint icon
    Object.keys(coordinates).forEach(key => {
        hintIcon.style[key] = coordinates[key];
    });

    // Create hint bubble
    const hintBubble = document.createElement('div');
    hintBubble.classList.add('hint-bubble');
    if (position.includes('right')) hintBubble.classList.add('right');
    if (position.includes('top')) hintBubble.classList.add('top');
    hintBubble.innerHTML = hintText;

    // Position hint bubble relative to hint icon
    if (position === 'top-right') {
        hintBubble.style.bottom = '40px';
        hintBubble.style.right = '0';
    } else if (position === 'top-left') {
        hintBubble.style.bottom = '40px';
        hintBubble.style.left = '0';
    } else if (position === 'bottom-right') {
        hintBubble.style.top = '40px';
        hintBubble.style.right = '0';
    } else if (position === 'bottom-left') {
        hintBubble.style.top = '40px';
        hintBubble.style.left = '0';
    }

    // Add elements to the DOM
    element.style.position = 'relative';
    element.appendChild(hintIcon);
    hintIcon.appendChild(hintBubble);

    // Toggle hint visibility
    hintIcon.addEventListener('mouseenter', function() {
        hintBubble.classList.add('visible');
    });

    hintIcon.addEventListener('mouseleave', function() {
        hintBubble.classList.remove('visible');
    });

    // Auto-hide hints after a while
    setTimeout(function() {
        if (!hintBubble.classList.contains('visible')) {
            hintIcon.classList.add('visible');
            hintBubble.classList.add('visible');

            setTimeout(function() {
                hintBubble.classList.remove('visible');
            }, 5000);
        }
    }, 2000 + (Math.random() * 3000));
}