// Spotify-inspired Portfolio JavaScript with Music Player

document.addEventListener('DOMContentLoaded', function() {
    // Load saved changes first
    loadSavedChanges();
    
    // Initialize all functionality
    initializeSearch();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeMobileMenu();
    initializeTypingEffect();
    initializeParallaxEffect();
    initializeMusicPlayer();
    initializeAdminMode();
    initializeCallout();
});

// Callout functionality
function initializeCallout() {
    // Show callout automatically after page loads
    setTimeout(() => {
        const callout = document.getElementById('listenReadCallout');
        if (callout) {
            callout.style.opacity = '1';
        }
    }, 1000);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        const callout = document.getElementById('listenReadCallout');
        if (callout && callout.style.display !== 'none') {
            closeCallout();
        }
    }, 6000);
}

function closeCallout() {
    const callout = document.getElementById('listenReadCallout');
    if (callout) {
        callout.style.animation = 'slideUp 0.3s ease-out forwards';
        setTimeout(() => {
            callout.style.display = 'none';
        }, 300);
    }
}

// Music Player Data - Curated playlist with free music sources
const playlist = [
    {
        title: "Chill Lofi Beat",
        artist: "Lofi Hip Hop",
        src: "https://www.bensound.com/bensound-music/bensound-slowmotion.mp3",
        duration: 180
    },
    {
        title: "Ambient Focus",
        artist: "Study Music",
        src: "https://www.bensound.com/bensound-music/bensound-creativeminds.mp3",
        duration: 148
    },
    {
        title: "Peaceful Piano",
        artist: "Relaxing Sounds",
        src: "https://www.bensound.com/bensound-music/bensound-relaxing.mp3",
        duration: 200
    },
    {
        title: "Electronic Vibes",
        artist: "Synthwave",
        src: "https://www.bensound.com/bensound-music/bensound-energy.mp3",
        duration: 165
    },
    {
        title: "Acoustic Dreams",
        artist: "Indie Folk",
        src: "https://www.bensound.com/bensound-music/bensound-sunny.mp3",
        duration: 190
    }
];

// Music Player functionality
function initializeMusicPlayer() {
    const audio = document.getElementById('currentAudio');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const volumeBtn = document.getElementById('volumeBtn');
    const volumeRange = document.getElementById('volumeRange');
    const progressBar = document.querySelector('.progress-bar');
    const progressFill = document.querySelector('.progress-fill');
    const progressHandle = document.querySelector('.progress-handle');
    const timeCurrent = document.querySelector('.time-current');
    const timeTotal = document.querySelector('.time-total');
    const songTitle = document.querySelector('.song-title');
    const songArtist = document.querySelector('.song-artist');
    const songCover = document.querySelector('.song-cover');

    let currentTrackIndex = 0;
    let isPlaying = false;
    let isDragging = false;

    // Load initial track
    loadTrack(currentTrackIndex);

    // Play/Pause functionality
    playPauseBtn.addEventListener('click', togglePlayPause);

    // Previous track
    prevBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) {
            audio.play();
        }
    });

    // Next track
    nextBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        if (isPlaying) {
            audio.play();
        }
    });

    // Volume control
    volumeRange.addEventListener('input', (e) => {
        const volume = e.target.value / 100;
        audio.volume = volume;
        updateVolumeIcon(volume);
    });

    // Volume button toggle
    volumeBtn.addEventListener('click', () => {
        if (audio.volume > 0) {
            audio.volume = 0;
            volumeRange.value = 0;
        } else {
            audio.volume = 0.7;
            volumeRange.value = 70;
        }
        updateVolumeIcon(audio.volume);
    });

    // Progress bar interaction
    progressBar.addEventListener('click', (e) => {
        if (!audio.duration) return;
        const rect = progressBar.getBoundingClientRect();
        const percent = (e.clientX - rect.left) / rect.width;
        audio.currentTime = percent * audio.duration;
    });

    // Progress bar dragging
    progressHandle.addEventListener('mousedown', (e) => {
        isDragging = true;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging || !audio.duration) return;
        const rect = progressBar.getBoundingClientRect();
        const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.currentTime = percent * audio.duration;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });

    // Audio event listeners
    audio.addEventListener('loadedmetadata', () => {
        timeTotal.textContent = formatTime(audio.duration);
        updateProgress();
    });

    audio.addEventListener('timeupdate', updateProgress);

    audio.addEventListener('ended', () => {
        // Auto-play next track
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
        audio.play();
    });

    audio.addEventListener('play', () => {
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
        songCover.innerHTML = '<i class="fas fa-music playing"></i>';
    });

    audio.addEventListener('pause', () => {
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        songCover.innerHTML = '<i class="fas fa-music"></i>';
    });

    audio.addEventListener('error', () => {
        console.log('Audio error, skipping to next track');
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.target.matches('input, textarea')) return;
        
        switch(e.code) {
            case 'Space':
                e.preventDefault();
                togglePlayPause();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                prevBtn.click();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextBtn.click();
                break;
            case 'ArrowUp':
                e.preventDefault();
                volumeRange.value = Math.min(100, parseInt(volumeRange.value) + 10);
                volumeRange.dispatchEvent(new Event('input'));
                break;
            case 'ArrowDown':
                e.preventDefault();
                volumeRange.value = Math.max(0, parseInt(volumeRange.value) - 10);
                volumeRange.dispatchEvent(new Event('input'));
                break;
        }
    });

    // Helper functions
    function loadTrack(index) {
        const track = playlist[index];
        audio.src = track.src;
        songTitle.textContent = track.title;
        songArtist.textContent = track.artist;
        timeCurrent.textContent = '0:00';
        timeTotal.textContent = formatTime(track.duration);
        progressFill.style.width = '0%';
        progressHandle.style.left = '0%';
    }

    function togglePlayPause() {
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play().catch(error => {
                console.log('Playback failed:', error);
                // Try next track if current fails
                currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
                loadTrack(currentTrackIndex);
            });
        }
    }

    function updateProgress() {
        if (!audio.duration || isDragging) return;
        
        const percent = (audio.currentTime / audio.duration) * 100;
        progressFill.style.width = percent + '%';
        progressHandle.style.left = percent + '%';
        timeCurrent.textContent = formatTime(audio.currentTime);
    }

    function updateVolumeIcon(volume) {
        const icon = volumeBtn.querySelector('i');
        if (volume === 0) {
            icon.className = 'fas fa-volume-mute';
        } else if (volume < 0.5) {
            icon.className = 'fas fa-volume-down';
        } else {
            icon.className = 'fas fa-volume-up';
        }
    }

    function formatTime(seconds) {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Initialize volume
    audio.volume = 0.7;
    updateVolumeIcon(0.7);
}

// Search functionality
function initializeSearch() {
    const searchInput = document.querySelector('.search-bar input');
    const searchIcon = document.querySelector('.search-bar i');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const query = e.target.value.toLowerCase();
            
            if (query.length > 0) {
                searchIcon.className = 'fas fa-times';
                searchIcon.style.cursor = 'pointer';
                performSearch(query);
            } else {
                searchIcon.className = 'fas fa-search';
                searchIcon.style.cursor = 'default';
                clearSearch();
            }
        });
        
        searchIcon.addEventListener('click', function() {
            if (searchIcon.classList.contains('fa-times')) {
                searchInput.value = '';
                searchIcon.className = 'fas fa-search';
                searchIcon.style.cursor = 'default';
                clearSearch();
            }
        });
    }
}

function performSearch(query) {
    const sections = document.querySelectorAll('.content-section');
    let hasResults = false;
    let firstMatch = null;
    
    // Enhanced search that includes partial matches and multiple keywords
    const searchTerms = query.split(' ').filter(term => term.length > 0);
    
    sections.forEach(section => {
        const sectionContent = section.textContent.toLowerCase();
        const cards = section.querySelectorAll('.skill-tag, .experience-card, .project-card, .certification-card, .skill-category');
        let sectionHasMatch = false;
        
        // Check if section title matches
        const sectionTitle = section.querySelector('h2, h3');
        if (sectionTitle && sectionTitle.textContent.toLowerCase().includes(query)) {
            sectionHasMatch = true;
        }
        
        cards.forEach(card => {
            const cardContent = card.textContent.toLowerCase();
            let cardMatches = false;
            
            // Check for exact match first
            if (cardContent.includes(query)) {
                cardMatches = true;
            } else {
                // Check for partial matches with all search terms
                cardMatches = searchTerms.every(term => cardContent.includes(term));
            }
            
            // Also check for common abbreviations and synonyms
            const synonyms = {
                'ai': ['artificial intelligence', 'machine learning', 'ml'],
                'ml': ['machine learning', 'artificial intelligence', 'ai'],
                'nlp': ['natural language processing'],
                'cv': ['computer vision', 'opencv'],
                'db': ['database', 'mongodb', 'sql'],
                'js': ['javascript'],
                'py': ['python'],
                'react': ['reactjs', 'react.js'],
                'git': ['github', 'version control'],
                'aws': ['amazon web services', 'cloud'],
                'ocr': ['optical character recognition'],
                'bot': ['telegram bot', 'chatbot'],
                'audio': ['music', 'sound', 'midi', 'daw'],
                'iot': ['internet of things', 'raspberry pi', 'arduino'],
                'n8n': ['automation', 'workflow'],
                'selenium': ['web automation', 'testing'],
                'tableau': ['data visualization', 'analytics'],
                'powerbi': ['power bi', 'microsoft', 'business intelligence']
            };
            
            // Check synonyms
            if (!cardMatches) {
                for (const [key, values] of Object.entries(synonyms)) {
                    if (query.includes(key)) {
                        cardMatches = values.some(synonym => cardContent.includes(synonym));
                        if (cardMatches) break;
                    }
                    if (values.some(value => query.includes(value))) {
                        cardMatches = cardContent.includes(key);
                        if (cardMatches) break;
                    }
                }
            }
            
            if (cardMatches) {
                // Always show the element
                card.style.display = '';
                card.classList.add('search-highlight');
                sectionHasMatch = true;
                hasResults = true;
                
                // Store first match for auto-scroll
                if (!firstMatch) {
                    firstMatch = card;
                }
                
                // If it's a skill category, show all skills in that category and scroll to it in carousel
                if (card.classList.contains('skill-category')) {
                    const skillTags = card.querySelectorAll('.skill-tag');
                    skillTags.forEach(tag => {
                        tag.style.display = '';
                    });
                    
                    // Auto-scroll carousel to show this skill category
                    scrollToSkillCategory(card);
                }
            } else {
                // Don't hide, just remove highlight
                card.classList.remove('search-highlight');
            }
        });
        
        // Always show sections, never hide them
        section.style.display = '';
        
        // Add section highlight if it matches
        if (sectionContent.includes(query) || sectionHasMatch) {
            section.classList.add('search-highlight-section');
        } else {
            section.classList.remove('search-highlight-section');
        }
    });
    
    // Also search in sidebar content
    const sidebarLinks = document.querySelectorAll('.contact-links a, .sidebar-menu a');
    sidebarLinks.forEach(link => {
        const linkContent = link.textContent.toLowerCase();
        if (linkContent.includes(query)) {
            link.classList.add('search-highlight');
            hasResults = true;
            if (!firstMatch) {
                firstMatch = link;
            }
        } else {
            link.classList.remove('search-highlight');
        }
    });
    
    // Auto-scroll to first match
    if (firstMatch) {
        setTimeout(() => {
            firstMatch.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center',
                inline: 'center'
            });
        }, 100);
    }
    
    showSearchResults(hasResults, query);
}

// Function to scroll carousel to specific skill category
function scrollToSkillCategory(skillCategory) {
    const skillsCarousel = document.getElementById('skillsCarousel');
    if (!skillsCarousel || !skillCategory) return;
    
    const containerRect = skillsCarousel.getBoundingClientRect();
    const elementRect = skillCategory.getBoundingClientRect();
    
    // Calculate scroll position to center the element
    const scrollLeft = skillsCarousel.scrollLeft + (elementRect.left - containerRect.left) - (containerRect.width / 2) + (elementRect.width / 2);
    
    skillsCarousel.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth'
    });
}

function clearSearch() {
    const sections = document.querySelectorAll('.content-section');
    const cards = document.querySelectorAll('.skill-tag, .experience-card, .project-card, .certification-card');
    
    sections.forEach(section => {
        section.style.display = '';
    });
    
    cards.forEach(card => {
        card.style.display = '';
        card.classList.remove('search-highlight');
    });
    
    const existingMessage = document.querySelector('.search-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

function showSearchResults(hasResults, query) {
    const existingMessage = document.querySelector('.search-results-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    if (!hasResults) {
        const message = document.createElement('div');
        message.className = 'search-results-message';
        message.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #b3b3b3;">
                <i class="fas fa-search" style="font-size: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                <h3>No results found for "${query}"</h3>
                <p>Try searching for skills, technologies, or experience</p>
            </div>
        `;
        document.querySelector('.main-content').appendChild(message);
    }
}

// Smooth scrolling for navigation links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Intersection Observer for animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                
                const cards = entry.target.querySelectorAll('.skill-category, .experience-card, .project-card, .certification-card');
                cards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('animate-in');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const navRight = document.querySelector('.nav-right');
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    mobileMenuBtn.style.display = 'none';
    
    navRight.insertBefore(mobileMenuBtn, navRight.firstChild);
    
    mobileMenuBtn.addEventListener('click', function() {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle('mobile-open');
        
        const icon = this.querySelector('i');
        if (sidebar.classList.contains('mobile-open')) {
            icon.className = 'fas fa-times';
        } else {
            icon.className = 'fas fa-bars';
        }
    });
    
    document.addEventListener('click', function(e) {
        const sidebar = document.querySelector('.sidebar');
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        
        if (!sidebar.contains(e.target) && !mobileBtn.contains(e.target)) {
            sidebar.classList.remove('mobile-open');
            mobileBtn.querySelector('i').className = 'fas fa-bars';
        }
    });
    
    window.addEventListener('resize', function() {
        const sidebar = document.querySelector('.sidebar');
        const mobileBtn = document.querySelector('.mobile-menu-btn');
        
        if (window.innerWidth > 1024) {
            mobileBtn.style.display = 'none';
            sidebar.classList.remove('mobile-open');
        } else {
            mobileBtn.style.display = 'block';
        }
    });
    
    if (window.innerWidth <= 1024) {
        mobileMenuBtn.style.display = 'block';
    }
}

// Typing effect for hero section
function initializeTypingEffect() {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (!heroSubtitle) return;
    
    const roles = [
        'Computer Science & AI/ML Student',
        'Python Developer',
        'Machine Learning Enthusiast',
        'Full Stack Developer',
        'Data Science Enthusiast'
    ];
    
    let currentRoleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    function typeEffect() {
        const currentRole = roles[currentRoleIndex];
        
        if (isDeleting) {
            heroSubtitle.textContent = currentRole.substring(0, currentCharIndex - 1);
            currentCharIndex--;
        } else {
            heroSubtitle.textContent = currentRole.substring(0, currentCharIndex + 1);
            currentCharIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && currentCharIndex === currentRole.length) {
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentRoleIndex = (currentRoleIndex + 1) % roles.length;
            typeSpeed = 500;
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    setTimeout(typeEffect, 1000);
}

// Parallax effect for hero section
function initializeParallaxEffect() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxSpeed = 0.5;
        
        heroSection.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    });
}

// Skills Carousel Navigation
function initializeSkillsCarousel() {
    const skillsCarousel = document.getElementById('skillsCarousel');
    const prevBtn = document.getElementById('prevCarousel');
    const nextBtn = document.getElementById('nextCarousel');
    
    if (!skillsCarousel || !prevBtn || !nextBtn) return;
    
    const scrollAmount = 350; // Amount to scroll per click
    
    prevBtn.addEventListener('click', () => {
        skillsCarousel.scrollBy({
            left: -scrollAmount,
            behavior: 'smooth'
        });
    });
    
    nextBtn.addEventListener('click', () => {
        skillsCarousel.scrollBy({
            left: scrollAmount,
            behavior: 'smooth'
        });
    });
    
    // Add keyboard navigation
    skillsCarousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextBtn.click();
        }
    });
    
    // Update button states based on scroll position
    function updateButtonStates() {
        const maxScroll = skillsCarousel.scrollWidth - skillsCarousel.clientWidth;
        const currentScroll = skillsCarousel.scrollLeft;
        
        prevBtn.style.opacity = currentScroll <= 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentScroll >= maxScroll ? '0.5' : '1';
    }
    
    skillsCarousel.addEventListener('scroll', updateButtonStates);
    window.addEventListener('resize', updateButtonStates);
    
    // Initial button state update
    setTimeout(updateButtonStates, 100);
}

// Make skill categories clickable with animations
function initializeClickableSkillCategories() {
    const skillCategories = document.querySelectorAll('.skill-category');
    
    skillCategories.forEach(category => {
        category.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove expanded class from all other categories
            skillCategories.forEach(cat => {
                if (cat !== this) {
                    cat.classList.remove('expanded');
                }
            });
            
            // Toggle expanded class on clicked category
            this.classList.toggle('expanded');
            
            // If expanding, scroll to center it in the carousel only (not the page)
            if (this.classList.contains('expanded')) {
                setTimeout(() => {
                    scrollToSkillCategory(this);
                }, 100);
                
                // Add skill icons if not already present
                addSkillIcons(this);
            }
        });
    });
    
    // Close expanded categories when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.skill-category')) {
            skillCategories.forEach(cat => {
                cat.classList.remove('expanded');
            });
        }
    });
}

// Add skill icons to expanded categories
function addSkillIcons(category) {
    const skillTags = category.querySelectorAll('.skill-tag');
    
    // Skill icon mapping
    const skillIcons = {
        'Python': 'fab fa-python',
        'C': 'fas fa-code',
        'Java (Basics)': 'fab fa-java',
        'HTML': 'fab fa-html5',
        'CSS': 'fab fa-css3-alt',
        'Amazon Web Services (AWS)': 'fab fa-aws',
        'SQL': 'fas fa-database',
        'MongoDB': 'fas fa-leaf',
        'Large Language Models (LLMs)': 'fas fa-brain',
        'Agentic AI': 'fas fa-robot',
        'OpenCV': 'fas fa-eye',
        'Flask': 'fas fa-flask',
        'Pandas': 'fas fa-table',
        'NumPy': 'fas fa-calculator',
        'TensorFlow': 'fas fa-network-wired',
        'Scikit-learn': 'fas fa-chart-line',
        'LangChain': 'fas fa-link',
        'n8n': 'fas fa-project-diagram',
        'Selenium': 'fas fa-spider',
        'Web Scraping': 'fas fa-globe',
        'API Development & Integration': 'fas fa-plug',
        'Website Automation': 'fas fa-cogs',
        'AI Chatbot Development': 'fas fa-comments',
        'Arduino': 'fas fa-microchip',
        'Raspberry Pi': 'fas fa-raspberry-pi',
        'Robotics': 'fas fa-robot',
        'Git': 'fab fa-git-alt',
        'GitHub': 'fab fa-github',
        'Microsoft Excel': 'fas fa-file-excel',
        'Power BI': 'fas fa-chart-bar',
        'Tableau': 'fas fa-chart-area',
        'Communication': 'fas fa-comments',
        'Leadership and Team Management': 'fas fa-users',
        'Presentation Design (Microsoft PowerPoint)': 'fas fa-presentation',
        'Canva': 'fas fa-palette',
        'Video Editing': 'fas fa-video',
        'Digital Audio Workstation (Cakewalk by BandLab)': 'fas fa-music',
        'MIDI Programming': 'fas fa-piano',
        'Audio Interfaces & Monitoring': 'fas fa-headphones',
        'Guitar': 'fas fa-guitar',
        'Piano': 'fas fa-piano'
    };
    
    skillTags.forEach(tag => {
        const skillName = tag.textContent.trim();
        const iconClass = skillIcons[skillName];
        
        if (iconClass && !tag.querySelector('i')) {
            const icon = document.createElement('i');
            icon.className = iconClass + ' skill-icon';
            
            // Wrap content in skill-tag-with-icon
            const textNode = tag.childNodes[0];
            tag.innerHTML = '';
            tag.classList.add('skill-tag-with-icon');
            tag.appendChild(icon);
            tag.appendChild(document.createTextNode(skillName));
        }
    });
}

// Additional interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Initialize skills carousel
    initializeSkillsCarousel();
    
    // Initialize clickable skill categories
    initializeClickableSkillCategories();
    
    // Add click effects to cards
    const cards = document.querySelectorAll('.experience-card, .project-card, .certification-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Hire Me button functionality
    const hireMeBtn = document.querySelector('.premium-btn');
    if (hireMeBtn) {
        hireMeBtn.addEventListener('click', function() {
            const email = 'aravgupta2604@gmail.com';
            const subject = 'Hiring Inquiry - Portfolio Contact';
            const body = 'Hi Arav,\n\nI found your portfolio and would like to discuss potential opportunities.\n\nBest regards,';
            
            window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    }
    
    // Add loading animation
    document.body.style.opacity = '0';
    window.addEventListener('load', function() {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    });
});

// Add CSS for animations and effects
const additionalStyles = `
    .animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .skill-category,
    .experience-card,
    .project-card,
    .certification-card {
        opacity: 1;
        transform: translateY(0);
        transition: all 0.4s ease-out;
    }
    
    .search-highlight {
        box-shadow: 0 0 20px rgba(29, 185, 84, 0.3);
        border: 1px solid #1db954;
    }
    
    .mobile-menu-btn {
        background: none;
        border: none;
        color: #ffffff;
        font-size: 20px;
        cursor: pointer;
        padding: 8px;
        border-radius: 4px;
        transition: background-color 0.3s ease;
    }
    
    .mobile-menu-btn:hover {
        background-color: #282828;
    }
    
    @media (max-width: 1024px) {
        .sidebar.mobile-open {
            transform: translateX(0);
            z-index: 1001;
        }
        
        .sidebar.mobile-open::before {
            content: '';
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: -1;
        }
    }
    
    .hero-subtitle {
        min-height: 1.5em;
    }
    
    .hero-subtitle::after {
        content: '|';
        animation: blink 1s infinite;
        margin-left: 2px;
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    .song-cover .playing {
        animation: spin 3s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Admin Mode functionality
let isAdminMode = false;
let adminToken = null;

function initializeAdminMode() {
    const adminBtn = document.getElementById('adminBtn');
    if (!adminBtn) return;
    
    adminBtn.addEventListener('click', handleAdminClick);
    
    // Check if admin mode is already active (stored in localStorage)
    const storedToken = localStorage.getItem('adminToken');
    if (storedToken && localStorage.getItem('adminMode') === 'true') {
        adminToken = storedToken;
        enableAdminMode();
    }
}

function handleAdminClick() {
    if (!isAdminMode) {
        showPasswordPrompt();
    } else {
        disableAdminMode();
    }
}

function showPasswordPrompt() {
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
        <div class="admin-modal-content">
            <div class="admin-modal-header">
                <h3>Admin Access</h3>
                <button class="close-modal" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="admin-modal-body">
                <p>Enter admin password to enable editing mode:</p>
                <input type="password" id="adminPasswordInput" placeholder="Password" 
                       style="width: 100%; padding: 12px; margin: 16px 0; background: #282828; 
                              border: 1px solid #404040; border-radius: 4px; color: #ffffff; outline: none;">
                <div class="admin-modal-actions">
                    <button class="admin-cancel-btn" onclick="this.closest('.admin-modal').remove()">Cancel</button>
                    <button class="admin-submit-btn" onclick="verifyAdminPassword()">Access</button>
                </div>
                <div id="adminError" style="color: #ff6b6b; margin-top: 12px; display: none;">
                    Incorrect password. Please try again.
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Focus on password input
    setTimeout(() => {
        document.getElementById('adminPasswordInput').focus();
    }, 100);
    
    // Handle Enter key
    document.getElementById('adminPasswordInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            verifyAdminPassword();
        }
    });
}

async function verifyAdminPassword() {
    const passwordInput = document.getElementById('adminPasswordInput');
    const errorDiv = document.getElementById('adminError');
    const submitBtn = document.querySelector('.admin-submit-btn');
    const enteredPassword = passwordInput.value;
    
    if (!enteredPassword) {
        errorDiv.textContent = 'Please enter a password';
        errorDiv.style.display = 'block';
        return;
    }
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';
    submitBtn.disabled = true;
    errorDiv.style.display = 'none';
    
    try {
        // Backend API call for secure authentication
        const response = await fetch('/api/verify-admin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: enteredPassword })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Store the secure token
            adminToken = result.token;
            localStorage.setItem('adminToken', adminToken);
            
            enableAdminMode();
            document.querySelector('.admin-modal').remove();
        } else {
            errorDiv.textContent = result.message || 'Authentication failed';
            errorDiv.style.display = 'block';
            passwordInput.value = '';
            passwordInput.focus();
        }
    } catch (error) {
        console.error('Authentication error:', error);
        errorDiv.textContent = 'Connection error. Please try again.';
        errorDiv.style.display = 'block';
    } finally {
        // Restore button state
        submitBtn.innerHTML = 'Access';
        submitBtn.disabled = false;
    }
}

function enableAdminMode() {
    isAdminMode = true;
    localStorage.setItem('adminMode', 'true');
    
    const adminBtn = document.getElementById('adminBtn');
    adminBtn.classList.add('admin-mode');
    adminBtn.innerHTML = '<i class="fas fa-edit"></i>';
    adminBtn.title = 'Exit Admin Mode';
    
    // Make content editable
    makeContentEditable();
    
    // Show save button
    showSaveButton();
    
    // Show admin indicator
    showAdminIndicator();
}

function disableAdminMode() {
    isAdminMode = false;
    localStorage.removeItem('adminMode');
    
    const adminBtn = document.getElementById('adminBtn');
    adminBtn.classList.remove('admin-mode');
    adminBtn.innerHTML = '<i class="fas fa-cog"></i>';
    adminBtn.title = 'Admin Access';
    
    // Remove editable attributes
    removeContentEditable();
    
    // Remove save button
    removeSaveButton();
    
    // Remove admin indicator
    removeAdminIndicator();
}

function makeContentEditable() {
    // Make ALL text content editable - comprehensive selection
    const editableElements = document.querySelectorAll(
        'h1, h2, h3, .hero-subtitle, .description, .project-description, ' +
        '.company, .duration, .education-school, .education-grade, ' +
        '.stat-number, .stat-label, .cert-info h3, .skill-tag, ' +
        '.skill-category h3, .section-header h2, .profile-info h4, ' +
        '.profile-info p, .song-title, .song-artist'
    );
    
    editableElements.forEach(element => {
        element.contentEditable = true;
        element.classList.add('admin-editable');
        element.addEventListener('blur', saveChangesToLocalStorage);
    });
    
    // Add section management buttons
    addSectionManagementButtons();
}

function removeContentEditable() {
    const editableElements = document.querySelectorAll('.admin-editable');
    editableElements.forEach(element => {
        element.contentEditable = false;
        element.classList.remove('admin-editable');
    });
    
    // Remove management buttons
    document.querySelectorAll('.admin-section-btn, .admin-add-section').forEach(btn => btn.remove());
}

function addSectionManagementButtons() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        if (section.querySelector('.admin-section-btn')) return; // Already has buttons
        
        const sectionControls = document.createElement('div');
        sectionControls.className = 'admin-section-controls';
        sectionControls.innerHTML = `
            <button class="admin-section-btn admin-delete-section" onclick="deleteSection(this)" title="Delete Section">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        section.appendChild(sectionControls);
    });
}

function showSaveButton() {
    if (document.querySelector('.admin-save-btn')) return; // Already exists
    
    const saveBtn = document.createElement('button');
    saveBtn.className = 'admin-save-btn';
    saveBtn.innerHTML = '<i class="fas fa-save"></i> Save Changes';
    saveBtn.onclick = saveAllChanges;
    
    document.body.appendChild(saveBtn);
}

function removeSaveButton() {
    const saveBtn = document.querySelector('.admin-save-btn');
    if (saveBtn) saveBtn.remove();
}

function showAdminIndicator() {
    if (document.querySelector('.admin-indicator')) return; // Already exists
    
    const indicator = document.createElement('div');
    indicator.className = 'admin-indicator';
    indicator.innerHTML = '<i class="fas fa-edit"></i> Admin Mode Active';
    
    document.body.appendChild(indicator);
}

function removeAdminIndicator() {
    const indicator = document.querySelector('.admin-indicator');
    if (indicator) indicator.remove();
}

function saveChangesToLocalStorage() {
    // Save individual changes to localStorage as they're made
    const portfolioData = {
        timestamp: Date.now(),
        content: {},
        structure: {
            sections: [],
            skillCategories: []
        }
    };
    
    const editableElements = document.querySelectorAll('.admin-editable');
    editableElements.forEach((element, index) => {
        const uniqueId = generateUniqueId(element);
        portfolioData.content[uniqueId] = {
            text: element.textContent.trim(),
            html: element.innerHTML,
            selector: getElementSelector(element),
            tagName: element.tagName,
            className: element.className,
            parentSelector: getParentSelector(element),
            index: index,
            uniqueId: uniqueId
        };
    });
    
    // Save section structure
    const sections = document.querySelectorAll('.content-section');
    sections.forEach((section, index) => {
        portfolioData.structure.sections.push({
            id: section.id,
            index: index,
            title: section.querySelector('h2')?.textContent || '',
            exists: true
        });
    });
    
    // Save skill categories structure
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        const categoryTitle = category.querySelector('h3')?.textContent || '';
        const skills = Array.from(category.querySelectorAll('.skill-tag')).map(tag => tag.textContent.trim());
        portfolioData.structure.skillCategories.push({
            title: categoryTitle,
            skills: skills,
            index: index
        });
    });
    
    localStorage.setItem('portfolioChanges', JSON.stringify(portfolioData));
    console.log('Comprehensive data saved:', portfolioData);
}

async function saveAllChanges() {
    const saveBtn = document.querySelector('.admin-save-btn');
    const originalContent = saveBtn.innerHTML;
    
    if (!adminToken) {
        alert('Admin session expired. Please log in again.');
        disableAdminMode();
        return;
    }
    
    // Show loading state
    saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
    saveBtn.disabled = true;
    
    // Collect all portfolio data
    const portfolioData = {
        timestamp: Date.now(),
        content: {}
    };
    
    const editableElements = document.querySelectorAll('.admin-editable');
    editableElements.forEach((element, index) => {
        portfolioData.content[`element_${index}`] = {
            text: element.textContent,
            html: element.innerHTML,
            selector: getElementSelector(element),
            tagName: element.tagName
        };
    });
    
    try {
        // Save to backend with secure authentication
        const response = await fetch('/api/save-portfolio', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ portfolioData })
        });
        
        const result = await response.json();
        
        if (response.ok && result.success) {
            // Also save locally as backup
            localStorage.setItem('portfolioChanges', JSON.stringify(portfolioData));
            
            // Show success message
            const successMsg = document.createElement('div');
            successMsg.className = 'admin-success-message';
            successMsg.innerHTML = '<i class="fas fa-check"></i> Changes saved to server successfully!';
            
            document.body.appendChild(successMsg);
            
            setTimeout(() => {
                successMsg.remove();
            }, 3000);
        } else {
            throw new Error(result.message || 'Save failed');
        }
    } catch (error) {
        console.error('Save error:', error);
        
        // Fallback to localStorage save
        localStorage.setItem('portfolioChanges', JSON.stringify(portfolioData));
        
        // Show warning message
        const warningMsg = document.createElement('div');
        warningMsg.className = 'admin-warning-message';
        warningMsg.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Saved locally only - Server connection failed';
        
        document.body.appendChild(warningMsg);
        
        setTimeout(() => {
            warningMsg.remove();
        }, 4000);
    } finally {
        // Restore button state
        saveBtn.innerHTML = originalContent;
        saveBtn.disabled = false;
    }
}

function generateUniqueId(element) {
    // Generate a unique ID based on element characteristics
    const tagName = element.tagName.toLowerCase();
    const text = element.textContent.trim().substring(0, 20).replace(/\s+/g, '_');
    const className = element.className.replace(/\s+/g, '_');
    const parentClass = element.parentElement?.className.replace(/\s+/g, '_') || '';
    
    return `${tagName}_${text}_${className}_${parentClass}`.replace(/[^a-zA-Z0-9_]/g, '');
}

function getParentSelector(element) {
    if (!element.parentElement) return '';
    
    let selector = element.parentElement.tagName.toLowerCase();
    if (element.parentElement.id) selector += `#${element.parentElement.id}`;
    if (element.parentElement.className) {
        const classes = element.parentElement.className.split(' ').filter(c => c.trim());
        if (classes.length > 0) selector += `.${classes.join('.')}`;
    }
    return selector;
}

function getElementSelector(element) {
    // Create a unique selector for the element
    let selector = element.tagName.toLowerCase();
    if (element.id) selector += `#${element.id}`;
    if (element.className) selector += `.${element.className.split(' ').join('.')}`;
    return selector;
}

function deleteSection(button) {
    if (confirm('Are you sure you want to delete this section?')) {
        button.closest('.content-section').remove();
        saveChangesToLocalStorage();
    }
}

// Admin Mode Styles
const adminStyles = `
    .admin-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    }
    
    .admin-modal-content {
        background: #181818;
        border-radius: 8px;
        width: 90%;
        max-width: 400px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    }
    
    .admin-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px;
        border-bottom: 1px solid #282828;
    }
    
    .admin-modal-header h3 {
        margin: 0;
        color: #1db954;
    }
    
    .close-modal {
        background: none;
        border: none;
        color: #b3b3b3;
        font-size: 18px;
        cursor: pointer;
        padding: 8px;
    }
    
    .close-modal:hover {
        color: #ffffff;
    }
    
    .admin-modal-body {
        padding: 20px;
    }
    
    .admin-modal-body p {
        color: #b3b3b3;
        margin-bottom: 16px;
    }
    
    .admin-modal-actions {
        display: flex;
        gap: 12px;
        justify-content: flex-end;
        margin-top: 20px;
    }
    
    .admin-cancel-btn, .admin-submit-btn {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
    }
    
    .admin-cancel-btn {
        background: #282828;
        color: #b3b3b3;
    }
    
    .admin-cancel-btn:hover {
        background: #404040;
        color: #ffffff;
    }
    
    .admin-submit-btn {
        background: #1db954;
        color: #000000;
    }
    
    .admin-submit-btn:hover {
        background: #1ed760;
    }
    
    .admin-editable {
        border: 2px dashed transparent;
        transition: all 0.3s ease;
        border-radius: 4px;
        padding: 4px;
    }
    
    .admin-editable:hover {
        border-color: rgba(29, 185, 84, 0.5);
        background: rgba(29, 185, 84, 0.05);
    }
    
    .admin-editable:focus {
        border-color: #1db954;
        background: rgba(29, 185, 84, 0.1);
        outline: none;
    }
    
    .admin-section-controls {
        position: absolute;
        top: 10px;
        right: 10px;
        z-index: 100;
    }
    
    .admin-section-btn {
        background: rgba(255, 107, 107, 0.8);
        border: none;
        color: #ffffff;
        padding: 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        margin-left: 8px;
        transition: all 0.3s ease;
    }
    
    .admin-section-btn:hover {
        background: #ff6b6b;
        transform: scale(1.05);
    }
    
    .admin-save-btn {
        position: fixed;
        bottom: 120px;
        right: 20px;
        background: #1db954;
        color: #000000;
        border: none;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 700;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(29, 185, 84, 0.3);
        transition: all 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .admin-save-btn:hover {
        background: #1ed760;
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(29, 185, 84, 0.4);
    }
    
    .admin-indicator {
        position: fixed;
        top: 80px;
        right: 20px;
        background: rgba(29, 185, 84, 0.9);
        color: #000000;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 14px;
        font-weight: 600;
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .admin-success-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #1db954;
        color: #000000;
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 8px;
        animation: fadeInOut 3s ease-in-out;
    }
    
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
        10%, 90% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
    }
    
    .content-section {
        position: relative;
    }
`;

// Load saved changes function
function loadSavedChanges() {
    const savedData = localStorage.getItem('portfolioChanges');
    if (!savedData) return;
    
    try {
        const portfolioData = JSON.parse(savedData);
        console.log('Loading saved changes:', portfolioData);
        
        // Apply saved changes to elements with improved matching
        if (portfolioData.content) {
            Object.keys(portfolioData.content).forEach(key => {
                const elementData = portfolioData.content[key];
                
                // Skip if data is invalid
                if (!elementData.text || !elementData.tagName) return;
                
                // Find element using precise matching
                let element = findElementPrecisely(elementData);
                
                // Apply changes if element found and text is different
                if (element && elementData.text.trim() !== element.textContent.trim()) {
                    console.log('Updating element:', element, 'with text:', elementData.text);
                    element.textContent = elementData.text.trim();
                }
            });
            
            // Temporarily disabled automatic skill reconstruction to prevent mix-ups
            // loadNewSkillsAndCategories(portfolioData);
        }
    } catch (error) {
        console.error('Error loading saved changes:', error);
    }
}

// Precise element finding function
function findElementPrecisely(elementData) {
    // Try exact selector match first
    if (elementData.selector) {
        try {
            const element = document.querySelector(elementData.selector);
            if (element && element.tagName === elementData.tagName) {
                return element;
            }
        } catch (e) {
            // Invalid selector, continue
        }
    }
    
    // Use unique ID if available
    if (elementData.uniqueId) {
        const allElements = document.querySelectorAll(elementData.tagName.toLowerCase());
        for (let el of allElements) {
            const currentUniqueId = generateUniqueId(el);
            if (currentUniqueId === elementData.uniqueId) {
                return el;
            }
        }
    }
    
    // Fallback: match by tag, parent context, and original content
    if (elementData.parentSelector && elementData.text) {
        try {
            const parentElement = document.querySelector(elementData.parentSelector);
            if (parentElement) {
                const childElements = parentElement.querySelectorAll(elementData.tagName.toLowerCase());
                for (let el of childElements) {
                    // For skill tags, be very specific about matching
                    if (elementData.tagName === 'SPAN' && el.classList.contains('skill-tag')) {
                        // Only match if this exact skill tag exists in original content
                        const originalSkillTags = getOriginalSkillTags();
                        if (originalSkillTags.includes(elementData.text.trim())) {
                            return el;
                        }
                    } else {
                        // For other elements, use position and content matching
                        const currentText = el.textContent.trim();
                        if (currentText === elementData.text.trim()) {
                            return el;
                        }
                    }
                }
            }
        } catch (e) {
            // Invalid parent selector
        }
    }
    
    return null;
}

// Get original skill tags to prevent cross-contamination
function getOriginalSkillTags() {
    // Define the original skills that should exist
    const originalSkills = [
        'Python', 'C', 'Java (Basics)', 'HTML', 'CSS',
        'Amazon Web Services (AWS)', 'SQL', 'MongoDB',
        'Large Language Models (LLMs)', 'Agentic AI', 'OpenCV',
        'Flask', 'Pandas', 'NumPy', 'TensorFlow', 'Scikit-learn', 'LangChain',
        'n8n', 'Selenium', 'Web Scraping', 'API Development & Integration',
        'Website Automation', 'AI Chatbot Development',
        'Arduino', 'Raspberry Pi', 'Robotics',
        'Git', 'GitHub', 'Microsoft Excel', 'Power BI', 'Tableau',
        'Communication', 'Leadership and Team Management',
        'Presentation Design (Microsoft PowerPoint)', 'Canva', 'Video Editing',
        'Digital Audio Workstation (Cakewalk by BandLab)', 'MIDI Programming',
        'Audio Interfaces & Monitoring', 'Guitar', 'Piano'
    ];
    
    return originalSkills;
}

// Load new skills and categories that were added in admin mode
function loadNewSkillsAndCategories(portfolioData) {
    const skillsCarousel = document.getElementById('skillsCarousel');
    if (!skillsCarousel || !portfolioData.content) return;
    
    const savedElements = Object.values(portfolioData.content);
    
    // Find saved skill categories that don't exist in current DOM
    const existingCategories = Array.from(skillsCarousel.querySelectorAll('.skill-category h3'))
        .map(h3 => h3.textContent.trim());
    
    const savedCategories = savedElements
        .filter(item => item.tagName === 'H3' && item.selector && item.selector.includes('skill-category'))
        .map(item => item.text.trim());
    
    // Add missing categories
    savedCategories.forEach(categoryName => {
        if (!existingCategories.includes(categoryName)) {
            const relatedSkills = savedElements
                .filter(item => item.tagName === 'SPAN' && 
                        item.selector && 
                        item.selector.includes('skill-tag'))
                .map(item => item.text.trim());
            
            // Create new category with related skills
            createSkillCategoryFromSaved(categoryName, relatedSkills);
        }
    });
    
    // Handle individual skills that were added to existing categories
    const existingSkillCategories = skillsCarousel.querySelectorAll('.skill-category');
    existingSkillCategories.forEach(category => {
        const categoryTitle = category.querySelector('h3').textContent.trim();
        const existingSkills = Array.from(category.querySelectorAll('.skill-tag'))
            .map(tag => tag.textContent.trim());
        
        // Find saved skills for this category
        const savedSkills = savedElements
            .filter(item => item.tagName === 'SPAN' && 
                    item.text && 
                    !existingSkills.includes(item.text.trim()))
            .map(item => item.text.trim());
        
        // Add missing skills to this category
        savedSkills.forEach(skillName => {
            if (skillName && !existingSkills.includes(skillName)) {
                addSkillToCategory(category, skillName);
            }
        });
    });
}

// Create skill category from saved data
function createSkillCategoryFromSaved(categoryName, skills) {
    const skillsGrid = document.getElementById('skillsCarousel');
    if (!skillsGrid) return;
    
    const newCategory = document.createElement('div');
    newCategory.className = 'skill-category';
    newCategory.innerHTML = `
        <h3>${categoryName}</h3>
        <div class="skill-tags">
            ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
        </div>
    `;
    
    skillsGrid.appendChild(newCategory);
    console.log('Created new skill category from saved data:', categoryName);
}

// Add skill to existing category
function addSkillToCategory(category, skillName) {
    const skillTagsContainer = category.querySelector('.skill-tags');
    if (!skillTagsContainer) return;
    
    const newSkillTag = document.createElement('span');
    newSkillTag.className = 'skill-tag';
    newSkillTag.textContent = skillName;
    
    skillTagsContainer.appendChild(newSkillTag);
    console.log('Added skill to category:', skillName);
}

// Add functionality to add new skills
function addNewSkill(categoryElement) {
    const skillTagsContainer = categoryElement.querySelector('.skill-tags');
    if (!skillTagsContainer) return;
    
    const newSkillName = prompt('Enter new skill name:');
    if (!newSkillName || !newSkillName.trim()) return;
    
    const newSkillTag = document.createElement('span');
    newSkillTag.className = 'skill-tag';
    newSkillTag.textContent = newSkillName.trim();
    newSkillTag.contentEditable = true;
    newSkillTag.classList.add('admin-editable');
    newSkillTag.addEventListener('blur', saveChangesToLocalStorage);
    
    skillTagsContainer.appendChild(newSkillTag);
    saveChangesToLocalStorage();
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'admin-success-message';
    successMsg.innerHTML = '<i class="fas fa-plus"></i> New skill added!';
    successMsg.style.animation = 'fadeInOut 2s ease-in-out';
    
    document.body.appendChild(successMsg);
    setTimeout(() => successMsg.remove(), 2000);
}

// Enhanced section management with add new skill functionality
function addSectionManagementButtons() {
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        if (section.querySelector('.admin-section-btn')) return; // Already has buttons
        
        const sectionControls = document.createElement('div');
        sectionControls.className = 'admin-section-controls';
        
        // Add skill button for skills section
        if (section.id === 'skills') {
            sectionControls.innerHTML = `
                <button class="admin-section-btn admin-add-skill" onclick="showAddSkillModal()" title="Add New Skill Category">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="admin-section-btn admin-delete-section" onclick="deleteSection(this)" title="Delete Section">
                    <i class="fas fa-trash"></i>
                </button>
            `;
        } else {
            sectionControls.innerHTML = `
                <button class="admin-section-btn admin-delete-section" onclick="deleteSection(this)" title="Delete Section">
                    <i class="fas fa-trash"></i>
                </button>
            `;
        }
        
        section.appendChild(sectionControls);
    });
    
    // Add skill buttons to individual skill categories
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        if (category.querySelector('.admin-skill-btn')) return;
        
        const addSkillBtn = document.createElement('button');
        addSkillBtn.className = 'admin-skill-btn';
        addSkillBtn.innerHTML = '<i class="fas fa-plus"></i>';
        addSkillBtn.title = 'Add New Skill';
        addSkillBtn.onclick = () => addNewSkill(category);
        
        category.appendChild(addSkillBtn);
    });
}

// Show modal to add new skill category
function showAddSkillModal() {
    const modal = document.createElement('div');
    modal.className = 'admin-modal';
    modal.innerHTML = `
        <div class="admin-modal-content">
            <div class="admin-modal-header">
                <h3>Add New Skill Category</h3>
                <button class="close-modal" onclick="this.parentElement.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="admin-modal-body">
                <p>Category Name:</p>
                <input type="text" id="newCategoryName" placeholder="e.g., New Technologies" 
                       style="width: 100%; padding: 12px; margin: 8px 0; background: #282828; 
                              border: 1px solid #404040; border-radius: 4px; color: #ffffff; outline: none;">
                <p>Skills (comma separated):</p>
                <textarea id="newCategorySkills" placeholder="e.g., React, Vue.js, Angular" 
                         style="width: 100%; padding: 12px; margin: 8px 0; background: #282828; 
                                border: 1px solid #404040; border-radius: 4px; color: #ffffff; outline: none; 
                                height: 80px; resize: vertical;"></textarea>
                <div class="admin-modal-actions">
                    <button class="admin-cancel-btn" onclick="this.closest('.admin-modal').remove()">Cancel</button>
                    <button class="admin-submit-btn" onclick="createNewSkillCategory()">Add Category</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    setTimeout(() => document.getElementById('newCategoryName').focus(), 100);
}

// Create new skill category
function createNewSkillCategory() {
    const categoryName = document.getElementById('newCategoryName').value.trim();
    const skillsText = document.getElementById('newCategorySkills').value.trim();
    
    if (!categoryName) {
        alert('Please enter a category name');
        return;
    }
    
    const skills = skillsText ? skillsText.split(',').map(s => s.trim()).filter(s => s) : [];
    
    const skillsGrid = document.getElementById('skillsCarousel');
    const newCategory = document.createElement('div');
    newCategory.className = 'skill-category';
    newCategory.innerHTML = `
        <h3 contenteditable="true" class="admin-editable">${categoryName}</h3>
        <div class="skill-tags">
            ${skills.map(skill => `<span class="skill-tag admin-editable" contenteditable="true">${skill}</span>`).join('')}
        </div>
    `;
    
    skillsGrid.appendChild(newCategory);
    
    // Add event listeners to new editable elements
    const editableElements = newCategory.querySelectorAll('.admin-editable');
    editableElements.forEach(element => {
        element.addEventListener('blur', saveChangesToLocalStorage);
    });
    
    // Add skill management button
    const addSkillBtn = document.createElement('button');
    addSkillBtn.className = 'admin-skill-btn';
    addSkillBtn.innerHTML = '<i class="fas fa-plus"></i>';
    addSkillBtn.title = 'Add New Skill';
    addSkillBtn.onclick = () => addNewSkill(newCategory);
    newCategory.appendChild(addSkillBtn);
    
    saveChangesToLocalStorage();
    document.querySelector('.admin-modal').remove();
    
    // Show success message
    const successMsg = document.createElement('div');
    successMsg.className = 'admin-success-message';
    successMsg.innerHTML = '<i class="fas fa-plus"></i> New skill category added!';
    document.body.appendChild(successMsg);
    setTimeout(() => successMsg.remove(), 3000);
}

// Inject admin styles
const adminStyleSheet = document.createElement('style');
adminStyleSheet.textContent = adminStyles + `
    .admin-skill-btn {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(29, 185, 84, 0.8);
        border: none;
        color: #000000;
        padding: 6px;
        border-radius: 50%;
        cursor: pointer;
        font-size: 12px;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 10;
    }
    
    .admin-skill-btn:hover {
        background: #1db954;
        transform: scale(1.1);
    }
    
    .admin-warning-message {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #ff9500;
        color: #000000;
        padding: 16px 24px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 8px;
        animation: fadeInOut 4s ease-in-out;
    }
`;
document.head.appendChild(adminStyleSheet);
