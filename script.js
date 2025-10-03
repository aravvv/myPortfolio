// Spotify-inspired Portfolio JavaScript with Music Player

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeSearch();
    initializeSmoothScrolling();
    initializeAnimations();
    initializeMobileMenu();
    initializeTypingEffect();
    initializeParallaxEffect();
    initializeMusicPlayer();
});

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
                'iot': ['internet of things', 'raspberry pi', 'arduino']
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
                card.style.display = '';
                card.classList.add('search-highlight');
                sectionHasMatch = true;
                hasResults = true;
                
                // If it's a skill category, show all skills in that category
                if (card.classList.contains('skill-category')) {
                    const skillTags = card.querySelectorAll('.skill-tag');
                    skillTags.forEach(tag => {
                        tag.style.display = '';
                    });
                }
            } else {
                card.style.display = 'none';
                card.classList.remove('search-highlight');
            }
        });
        
        // Show section if it has matches or if the query matches section content
        if (sectionContent.includes(query) || sectionHasMatch) {
            section.style.display = '';
        } else {
            section.style.display = 'none';
        }
    });
    
    // Also search in sidebar content
    const sidebarLinks = document.querySelectorAll('.contact-links a, .sidebar-menu a');
    sidebarLinks.forEach(link => {
        const linkContent = link.textContent.toLowerCase();
        if (linkContent.includes(query)) {
            link.classList.add('search-highlight');
            hasResults = true;
        } else {
            link.classList.remove('search-highlight');
        }
    });
    
    showSearchResults(hasResults, query);
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

// Additional interactive features
document.addEventListener('DOMContentLoaded', function() {
    // Add click effects to cards
    const cards = document.querySelectorAll('.skill-category, .experience-card, .project-card, .certification-card');
    
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
