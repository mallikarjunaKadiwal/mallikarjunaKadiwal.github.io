const GITHUB_USERNAME = 'mallikarjunaKadiwal';
const GITHUB_API_URL = 'https://api.github.com';

let allRepos = [];
let filteredRepos = [];

// Language color mapping
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
    'Django': '#0C3C26',
};

// Categorize repos by technology
function categorizeRepo(repo) {
    const lang = (repo.language || '').toLowerCase();
    const name = (repo.name || '').toLowerCase();
    const desc = (repo.description || '').toLowerCase();

    if (lang === 'typescript' || (lang === 'javascript' && (desc.includes('react') || name.includes('react')))) {
        return 'frontend';
    }
    if (lang === 'python' || desc.includes('django') || name.includes('api') || name.includes('backend')) {
        return 'backend';
    }
    if (desc.includes('full stack') || (lang === 'javascript' && desc.includes('express')) || 
        (lang === 'python' && desc.includes('react'))) {
        return 'fullstack';
    }
    return 'all';
}

// Fetch all repositories
async function fetchAllRepositories() {
    try {
        const response = await fetch(
            `${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos?sort=stars&per_page=100&type=owner`
        );
        
        if (!response.ok) throw new Error('Failed to fetch repositories');
        
        allRepos = await response.json();
        
        // Sort by stars, then by updated date
        allRepos.sort((a, b) => {
            if (b.stargazers_count !== a.stargazers_count) {
                return b.stargazers_count - a.stargazers_count;
            }
            return new Date(b.updated_at) - new Date(a.updated_at);
        });
        
        filteredRepos = allRepos;
        displayRepositories(filteredRepos);
        setupFilterButtons();
        
        // Update repos count
        document.getElementById('repos-count').textContent = allRepos.length;
        
    } catch (error) {
        console.error('Error fetching repositories:', error);
        document.getElementById('repos-container').innerHTML = 
            '<div class="error-message"><p>Unable to load repositories. Please visit <a href="https://github.com/mallikarjunaKadiwal" target="_blank">GitHub</a> directly.</p></div>';
    }
}

// Display repositories
function displayRepositories(repos) {
    const container = document.getElementById('repos-container');
    
    if (repos.length === 0) {
        container.innerHTML = '<p class="no-results">No repositories found with this filter.</p>';
        return;
    }
    
    container.innerHTML = repos.map((repo, index) => {
        const category = categorizeRepo(repo);
        const languageColor = LANGUAGE_COLORS[repo.language] || '#000';
        const updatedDate = new Date(repo.updated_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        
        // Create gradient background
        const gradientColors = {
            'frontend': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'backend': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            'fullstack': 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            'all': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        };
        
        return `
            <div class="project-card" data-category="${category}">
                <div class="project-header" style="background: ${gradientColors[category]};">
                    <div class="project-icon">
                        <i class="fas fa-code-branch"></i>
                    </div>
                </div>
                <div class="project-body">
                    <h3>${repo.name}</h3>
                    <p class="project-subtitle">${repo.description || 'No description available'}</p>
                    
                    <div class="project-meta">
                        ${repo.language ? `
                            <div class="project-language">
                                <span class="language-dot" style="background-color: ${languageColor}"></span>
                                <span>${repo.language}</span>
                            </div>
                        ` : ''}
                        <span class="project-updated">Updated ${updatedDate}</span>
                    </div>
                    
                    <div class="project-stats">
                        ${repo.stargazers_count > 0 ? `
                            <div class="stat-badge">
                                <i class="fas fa-star"></i> ${repo.stargazers_count}
                            </div>
                        ` : ''}
                        ${repo.forks_count > 0 ? `
                            <div class="stat-badge">
                                <i class="fas fa-code-branch"></i> ${repo.forks_count}
                            </div>
                        ` : ''}
                        ${repo.watchers_count > 0 ? `
                            <div class="stat-badge">
                                <i class="fas fa-eye"></i> ${repo.watchers_count}
                            </div>
                        ` : ''}
                        ${repo.open_issues_count > 0 ? `
                            <div class="stat-badge">
                                <i class="fas fa-exclamation-circle"></i> ${repo.open_issues_count}
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="project-links">
                        <a href="${repo.html_url}" class="project-link" target="_blank">
                            <i class="fab fa-github"></i> View Code
                        </a>
                        ${repo.homepage ? `
                            <a href="${repo.homepage}" class="project-link" target="_blank">
                                <i class="fas fa-external-link-alt"></i> Live Demo
                            </a>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// Setup filter buttons
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            if (filter === 'all') {
                filteredRepos = allRepos;
            } else {
                filteredRepos = allRepos.filter(repo => categorizeRepo(repo) === filter || filter === 'all');
            }
            
            displayRepositories(filteredRepos);
        });
    });
}

// Resume Download Handler
function setupResumeDownload() {
    const resumeBtn = document.querySelector('a[href*="resume"]');
    
    if (resumeBtn) {
        resumeBtn.addEventListener('click', function(e) {
            const fileUrl = this.getAttribute('href');
            const fileName = this.getAttribute('download') || 'Mallikarjuna_Kadiwal_Resume.pdf';
            
            // Check if file exists
            fetch(fileUrl, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        // Trigger download
                        const link = document.createElement('a');
                        link.href = fileUrl;
                        link.download = fileName;
                        link.style.display = 'none';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        showAlert('Resume downloaded successfully! 📄', 'success');
                    } else {
                        showAlert('Resume file not found. Please contact admin.', 'error');
                    }
                })
                .catch(error => {
                    console.error('Download error:', error);
                    // Fallback: allow browser default behavior
                    showAlert('Opening resume...', 'info');
                });
        });
    }
}

// Show notification alerts
function showAlert(message, type = 'info') {
    const alert = document.createElement('div');
    alert.className = `download-alert download-alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${message}</span>
    `;
    
    const bgColor = {
        success: 'linear-gradient(135deg, #28a745 0%, #20c997 100%)',
        error: 'linear-gradient(135deg, #dc3545 0%, #ff6b6b 100%)',
        info: 'linear-gradient(135deg, #0366d6 0%, #6f42c1 100%)'
    };
    
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor[type]};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 12px;
        font-weight: 600;
        letter-spacing: 0.5px;
        animation: slideInDown 0.3s ease-out;
    `;
    
    document.body.appendChild(alert);
    
    setTimeout(() => {
        alert.style.animation = 'slideOutUp 0.3s ease-out';
        setTimeout(() => alert.remove(), 300);
    }, 3000);
}

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

// Smooth scroll behavior
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

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    setupResumeDownload();
    fetchAllRepositories();
});
