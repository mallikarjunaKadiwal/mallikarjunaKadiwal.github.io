const GITHUB_USERNAME = 'mallikarjunaKadiwal';
const GITHUB_API_URL = 'https://api.github.com';

// Hamburger Menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });
}

// Fetch user repositories count
async function fetchRepositoriesCount() {
    try {
        const response = await fetch(`${GITHUB_API_URL}/users/${GITHUB_USERNAME}`);
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        document.getElementById('repos-count').textContent = data.public_repos;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('repos-count').textContent = '5+';
    }
}

// Smooth scroll behavior for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideInUp 0.6s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.about-card, .skill-category, .devops-card, .cert-card, .project-card').forEach(el => {
    observer.observe(el);
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Trigger counter animation when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statValues = document.querySelectorAll('.stat-value');
            statValues.forEach(stat => {
                if (stat.textContent !== '0' && stat.textContent !== '100%' && !stat.dataset.animated) {
                    const targetText = stat.textContent.replace(/[^0-9]/g, '');
                    if (targetText && !isNaN(parseInt(targetText))) {
                        animateCounter(stat, parseInt(targetText));
                        stat.dataset.animated = 'true';
                    }
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
});

const heroSection = document.querySelector('.hero');
if (heroSection) {
    statsObserver.observe(heroSection);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchRepositoriesCount();
});
