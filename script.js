const GITHUB_USERNAME = 'mallikarjunaKadiwal';
const GITHUB_API_URL = 'https://api.github.com';

// Language colors mapping
const LANGUAGE_COLORS = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#2b7489',
    'Python': '#3572A5',
    'Java': '#b07219',
    'C++': '#f34b7d',
    'C#': '#239120',
    'PHP': '#777bb4',
    'Ruby': '#cc342d',
    'Go': '#00add8',
    'Rust': '#dea584',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'Vue': '#41b883',
    'React': '#61dafb',
    'Angular': '#dd0031',
    'Shell': '#89e051',
    'Kotlin': '#7f52ff',
    'Swift': '#fa7343',
    'Django': '#092E20',
    'MSSQL': '#CC2927',
};

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

// Fetch and display repositories
async function fetchAndDisplayRepositories() {
    try {
        const response = await fetch(`${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos?sort=stars&order=desc&per_page=50`);
        if (!response.ok) throw new Error('Failed to fetch repositories');
        
        const repos = await response.json();
        
        // Filter out forked repositories if you want only your own projects
        const ownRepos = repos.filter(repo => !repo.fork);
        
        displayRepositories(ownRepos);
        updateRepoCount(ownRepos.length);
    } catch (error) {
        console.error('Error fetching repositories:', error);
        displayRepositoriesError();
    }
}

// Display repositories in the projects grid
function displayRepositories(repos) {
    const container = document.getElementById('projects-grid') || document.querySelector('.projects-grid');
    
    if (!container) {
        console.error('Projects grid container not found');
        return;
    }

    // Clear existing content
    container.innerHTML = '';

    if (repos.length === 0) {
        container.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; color: #586069;">No repositories found.</p>';
        return;
    }

    // Create project cards for each repository
    repos.forEach((repo, index) => {
        const card = createProjectCard(repo, index);
        container.appendChild(card);
    });
}

// Create individual project card
function createProjectCard(repo, index) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.animationDelay = `${index * 0.1}s`;

    const languages = repo.language ? [repo.language] : [];
    const techTags = languages.map(lang => `<span>${lang}</span>`).join('');
    
    const gradient = getGradientForIndex(index);
    
    const stats = [];
    if (repo.stargazers_count > 0) {
        stats.push(`<span class="project-stat"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>`);
    }
    if (repo.forks_count > 0) {
        stats.push(`<span class="project-stat"><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>`);
    }
    if (repo.open_issues_count > 0) {
        stats.push(`<span class="project-stat"><i class="fas fa-exclamation-circle"></i> ${repo.open_issues_count}</span>`);
    }

    const statsHTML = stats.length > 0 ? `<div class="project-stats">${stats.join('')}</div>` : '';

    card.innerHTML = `
        <div class="project-header" style="background: ${gradient};">
            <div class="project-icon">
                <i class="fab fa-github"></i>
            </div>
        </div>
        <div class="project-body">
            <h3><a href="${repo.html_url}" target="_blank" rel="noopener noreferrer">${repo.name}</a></h3>
            <p class="project-description-short">${repo.description || 'No description available'}</p>
            ${techTags ? `<div class="project-tech">${techTags}</div>` : ''}
            ${statsHTML}
            <div class="project-info">
                <span class="repo-info"><i class="fas fa-code-branch"></i> ${repo.default_branch}</span>
                <span class="repo-info"><i class="fas fa-database"></i> ${formatBytes(repo.size * 1024)}</span>
            </div>
            <div class="project-links">
                <a href="${repo.html_url}" class="project-link" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-github"></i> Repository
                </a>
                ${repo.homepage ? `<a href="${repo.homepage}" class="project-link" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-external-link-alt"></i> Visit
                </a>` : ''}
            </div>
        </div>
    `;

    return card;
}

// Get gradient for different cards
function getGradientForIndex(index) {
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    ];
    return gradients[index % gradients.length];
}

// Display error message
function displayRepositoriesError() {
    const container = document.querySelector('.projects-grid');
    if (container) {
        container.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #586069;">
                <p>Unable to load repositories. Please try again later.</p>
            </div>
        `;
    }
}

// Update repository count
function updateRepoCount(count) {
    const reposCountElement = document.getElementById('repos-count');
    if (reposCountElement) {
        reposCountElement.textContent = count;
    }
}

// Format bytes to human readable format
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Fetch user data
async function fetchUserData() {
    try {
        const response = await fetch(`${GITHUB_API_URL}/users/${GITHUB_USERNAME}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const data = await response.json();
        displayUserData(data);
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

// Display user data
function displayUserData(data) {
    const avatar = document.getElementById('avatar');
    const name = document.getElementById('name');
    const bio = document.getElementById('bio');
    const reposCount = document.getElementById('repos-count');
    
    if (avatar) avatar.src = data.avatar_url;
    if (name) name.textContent = data.name || data.login;
    if (bio) bio.textContent = data.bio || 'Full Stack Developer | DevOps Engineer';
    if (reposCount) reposCount.textContent = data.public_repos;
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

document.querySelectorAll('.about-card, .skill-category, .devops-card, .cert-card').forEach(el => {
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

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    fetchUserData();
    fetchAndDisplayRepositories();
});
