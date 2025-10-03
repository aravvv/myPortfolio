// Contact Page Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeParticleSystem();
    initializeContactAnimations();
    initializeMouseFollower();
    initializeSoundEffects();
    initializeTypingAnimation();
    initializeScrollAnimations();
});

// Particle System
function initializeParticleSystem() {
    const particleContainer = document.querySelector('.floating-particles');
    
    // Create additional dynamic particles
    for (let i = 0; i < 20; i++) {
        createFloatingParticle(particleContainer, i);
    }
    
    // Animate existing particles on mouse move
    document.addEventListener('mousemove', function(e) {
        const particles = document.querySelectorAll('.dynamic-particle');
        particles.forEach((particle, index) => {
            const speed = (index + 1) * 0.5;
            const x = (e.clientX - window.innerWidth / 2) * speed * 0.01;
            const y = (e.clientY - window.innerHeight / 2) * speed * 0.01;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
}

function createFloatingParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'dynamic-particle';
    particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        background: ${getRandomColor()};
        border-radius: 50%;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        opacity: ${Math.random() * 0.7 + 0.3};
        animation: floatDynamic ${Math.random() * 10 + 5}s ease-in-out infinite;
        animation-delay: ${Math.random() * 5}s;
        pointer-events: none;
        z-index: 1;
    `;
    
    container.appendChild(particle);
}

function getRandomColor() {
    const colors = [
        'rgba(29, 185, 84, 0.8)',
        'rgba(114, 137, 218, 0.6)',
        'rgba(255, 107, 107, 0.7)',
        'rgba(254, 202, 87, 0.6)',
        'rgba(156, 136, 255, 0.7)'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Contact Animations
function initializeContactAnimations() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach((item, index) => {
        // Entrance animation
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 200);
        
        // Enhanced hover effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.03)';
            createRippleEffect(this);
            playHoverSound();
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Click animation
        item.addEventListener('click', function() {
            createClickEffect(this);
            playClickSound();
        });
    });
}

function createRippleEffect(element) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        background: rgba(29, 185, 84, 0.3);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        animation: rippleAnimation 0.6s ease-out;
        pointer-events: none;
        z-index: 0;
    `;
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

function createClickEffect(element) {
    const clickEffect = document.createElement('div');
    clickEffect.className = 'click-effect';
    clickEffect.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        width: 100px;
        height: 100px;
        background: rgba(29, 185, 84, 0.2);
        border-radius: 50%;
        transform: translate(-50%, -50%) scale(0);
        animation: clickAnimation 0.4s ease-out;
        pointer-events: none;
        z-index: 5;
    `;
    
    element.appendChild(clickEffect);
    
    setTimeout(() => {
        clickEffect.remove();
    }, 400);
}

// Mouse Follower
function initializeMouseFollower() {
    const follower = document.createElement('div');
    follower.className = 'mouse-follower';
    follower.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        background: radial-gradient(circle, rgba(29, 185, 84, 0.3), transparent);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        mix-blend-mode: difference;
        transition: transform 0.1s ease;
        opacity: 0;
    `;
    
    document.body.appendChild(follower);
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        follower.style.opacity = '1';
    });
    
    document.addEventListener('mouseleave', function() {
        follower.style.opacity = '0';
    });
    
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        follower.style.left = followerX - 10 + 'px';
        follower.style.top = followerY - 10 + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    
    animateFollower();
    
    // Scale follower on interactive elements
    const interactiveElements = document.querySelectorAll('.contact-item, .quick-btn, .action-btn, .back-btn');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            follower.style.transform = 'scale(2)';
            follower.style.background = 'radial-gradient(circle, rgba(29, 185, 84, 0.5), transparent)';
        });
        
        element.addEventListener('mouseleave', () => {
            follower.style.transform = 'scale(1)';
            follower.style.background = 'radial-gradient(circle, rgba(29, 185, 84, 0.3), transparent)';
        });
    });
}

// Sound Effects (Optional - using Web Audio API)
function initializeSoundEffects() {
    let audioContext;
    
    // Initialize audio context on first user interaction
    document.addEventListener('click', function initAudio() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        document.removeEventListener('click', initAudio);
    });
    
    window.playHoverSound = function() {
        if (!audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    };
    
    window.playClickSound = function() {
        if (!audioContext) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.15);
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
    };
}

// Typing Animation for Profile Name
function initializeTypingAnimation() {
    const profileName = document.querySelector('.profile-name');
    if (!profileName) return;
    
    const originalText = profileName.textContent;
    profileName.textContent = '';
    
    let index = 0;
    
    function typeText() {
        if (index < originalText.length) {
            profileName.textContent += originalText.charAt(index);
            index++;
            setTimeout(typeText, 100);
        } else {
            // Add blinking cursor effect
            const cursor = document.createElement('span');
            cursor.textContent = '|';
            cursor.style.animation = 'blink 1s infinite';
            profileName.appendChild(cursor);
            
            // Remove cursor after 3 seconds
            setTimeout(() => {
                cursor.remove();
            }, 3000);
        }
    }
    
    // Start typing animation after page load
    setTimeout(typeText, 1000);
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                // Animate contact items with stagger
                if (entry.target.classList.contains('contact-methods')) {
                    const items = entry.target.querySelectorAll('.contact-item');
                    items.forEach((item, index) => {
                        setTimeout(() => {
                            item.style.animation = `slideInUp 0.6s ease forwards`;
                        }, index * 100);
                    });
                }
            }
        });
    }, observerOptions);
    
    const animatedElements = document.querySelectorAll('.contact-methods, .quick-actions, .profile-section');
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Enhanced 3D Card Interactions
function initializeCardInteractions() {
    const card = document.querySelector('.contact-card-3d');
    const cardInner = document.querySelector('.card-inner');
    
    if (!card || !cardInner) return;
    
    card.addEventListener('mousemove', function(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        cardInner.style.transform = `
            translateY(-10px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg) 
            scale(1.02)
        `;
    });
    
    card.addEventListener('mouseleave', function() {
        cardInner.style.transform = 'translateY(0px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
}

// Profile Image Interaction
function initializeProfileInteraction() {
    const profileImage = document.querySelector('.profile-image-3d');
    
    if (!profileImage) return;
    
    profileImage.addEventListener('click', function() {
        this.style.animation = 'none';
        this.offsetHeight; // Trigger reflow
        this.style.animation = 'profileSpin 1s ease-in-out';
    });
}

// Keyboard Navigation
function initializeKeyboardNavigation() {
    const contactItems = document.querySelectorAll('.contact-item');
    let currentIndex = -1;
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentIndex = (currentIndex + 1) % contactItems.length;
            focusItem(currentIndex);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentIndex = (currentIndex - 1 + contactItems.length) % contactItems.length;
            focusItem(currentIndex);
        } else if (e.key === 'Enter' && currentIndex >= 0) {
            e.preventDefault();
            contactItems[currentIndex].click();
        }
    });
    
    function focusItem(index) {
        contactItems.forEach(item => item.classList.remove('keyboard-focus'));
        contactItems[index].classList.add('keyboard-focus');
        contactItems[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

// Copy to Clipboard Function
function copyToClipboard(text, element) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyFeedback(element);
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showCopyFeedback(element);
    }
}

function showCopyFeedback(element) {
    const feedback = document.createElement('div');
    feedback.textContent = 'Copied!';
    feedback.style.cssText = `
        position: absolute;
        top: -40px;
        left: 50%;
        transform: translateX(-50%);
        background: #1db954;
        color: #000;
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 12px;
        font-weight: 600;
        z-index: 1000;
        animation: fadeInOut 2s ease;
    `;
    
    element.style.position = 'relative';
    element.appendChild(feedback);
    
    setTimeout(() => {
        feedback.remove();
    }, 2000);
}

// Add double-click to copy functionality
document.querySelectorAll('.contact-value').forEach(element => {
    element.addEventListener('dblclick', function() {
        copyToClipboard(this.textContent, this.parentElement.parentElement);
    });
});

// Initialize all interactions
document.addEventListener('DOMContentLoaded', function() {
    initializeCardInteractions();
    initializeProfileInteraction();
    initializeKeyboardNavigation();
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes floatDynamic {
        0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.7; }
        50% { transform: translateY(-20px) rotate(180deg); opacity: 1; }
    }
    
    @keyframes rippleAnimation {
        to { width: 200px; height: 200px; opacity: 0; }
    }
    
    @keyframes clickAnimation {
        to { transform: translate(-50%, -50%) scale(1); opacity: 0; }
    }
    
    @keyframes slideInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes profileSpin {
        0% { transform: rotateY(0deg) scale(1); }
        50% { transform: rotateY(180deg) scale(1.1); }
        100% { transform: rotateY(360deg) scale(1); }
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    .keyboard-focus {
        outline: 2px solid #1db954 !important;
        outline-offset: 2px;
    }
    
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        20%, 80% { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
`;

document.head.appendChild(style);

// Performance optimization - Debounced resize handler
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(function() {
        // Reinitialize on resize if needed
        initializeParticleSystem();
    }, 250);
});

// Preload optimization
window.addEventListener('load', function() {
    // Preload hover states
    const style = document.createElement('style');
    style.textContent = `
        .contact-item:hover .contact-icon,
        .quick-btn:hover,
        .action-btn:hover {
            transform: translateZ(0); /* Force GPU acceleration */
        }
    `;
    document.head.appendChild(style);
});

console.log('🚀 Contact page interactions initialized successfully!');
