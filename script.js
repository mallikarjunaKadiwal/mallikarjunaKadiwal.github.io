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
};

const LANGUAGE_EMOJIS = {
    'JavaScript': '🟨',
    'TypeScript': '🔵',
    'Python': '🐍',
    'Java': '☕',
    'C++': '⚙️',
    'C#': '#️⃣',
    'PHP': '🐘',
    'Ruby': '💎',
    'Go': '🐹',
    'Rust': '🦀',
    'HTML': '🌐',
    'CSS': '🎨',
    'Vue': '💚',
    'React': '⚛️',
    'Angular': '🅰️',
    'Shell': '🐚',
    'Kotlin': '🎯',
    'Swift': '🍎',
};

// Fetch user data
async function fetchUserData() {
    try {
        const response = await fetch(`${GITHUB_API_URL}/users/${GITHUB_USERNAME}`);
        if (!response.ok) throw new Error('Failed to fetch user data');
        
        const data = await response.json();
        displayUserData(data);
        return data;
    } catch (error) {
        console.error('Error fetching user data:', error);
        document.querySelector('.hero').innerHTML = 
            '<p>Error loading profile. Please check the username.</p>';
    }
}

// Display user data
function displayUserData(data) {
    document.getElementById('avatar').src = data.avatar_url;
    document.getElementById('name').textContent = data.name || data.login;
    document.getElementById('bio').textContent = data.bio || 'Developer';
    document.getElementById('repos-count').textContent = data.public_repos;
    document.getElementById('followers-count').textContent = data.followers;
    document.getElementById('following-count').textContent = data.following;
    document.getElementById('github-link').href = data.html_url;
    
    if (data.location) {
        document.getElementById('location').textContent = `📍 ${data.location}`;
    }
    
    if (data.twitter_username) {
        document.getElementById('social-twitter').href = 
            `https://twitter.com/${data.twitter_username}`;
    }
    
    document.getElementById('social-github').href = data.html_url;
    
    // Create about content
    const aboutContent = document.getElementById('about-content');
    aboutContent.innerHTML = `
        <p><strong>GitHub Profile:</strong> ${data.html_url}</p>
        ${data.company ? `<p><strong>Company:</strong> ${data.company}</p>` : ''}
        ${data.location ? `<p><strong>Location:</strong> ${data.location}</p>` : ''}
        ${data.blog ? `<p><strong>Website:</strong> <a href="${data.blog}" target="_blank">${data.blog}</a></p>` : ''}
        ${data.bio ? `<p><strong>Bio:</strong> ${data.bio}</p>` : ''}
        <p><strong>Member Since:</strong> ${new Date(data.created_at).toLocaleDateString()}</p>
    `;
}

// Fetch repositories
async function fetchRepositories() {
    try {
        const response = await fetch(
            `${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos?sort=stars&per_page=12&type=owner`
        );
        if (!response.ok) throw new Error('Failed to fetch repositories');
        
        const repos = await response.json();
        displayRepositories(repos);
        return repos;
    } catch (error) {
        console.error('Error fetching repositories:', error);
        document.getElementById('repos-container').innerHTML = 
            '<p>Error loading repositories.</p>';
    }
}

// Display repositories
function displayRepositories(repos) {
    const container = document.getElementById('repos-container');
    
    if (repos.length === 0) {
        container.innerHTML = '<p>No repositories found.</p>';
        return;
    }
    
    container.innerHTML = repos.map(repo => `
        <div class="repo-card">
            <a href="${repo.html_url}" class="repo-name" target="_blank">${repo.name}</a>
            <p class="repo-description">${repo.description || 'No description'}</p>
            <div class="repo-meta">
                ${repo.language ? `
                    <div class="repo-language">
                        <span class="language-dot" style="background-color: ${LANGUAGE_COLORS[repo.language] || '#000'}"></span>
                        ${repo.language}
                    </div>
                ` : ''}
            </div>
            <div class="repo-stats">
                ${repo.stargazers_count > 0 ? `
                    <div class="repo-stat">
                        ⭐ <span>${repo.stargazers_count}</span>
                    </div>
                ` : ''}
                ${repo.forks_count > 0 ? `
                    <div class="repo-stat">
                        🍴 <span>${repo.forks_count}</span>
                    </div>
                ` : ''}
                ${repo.open_issues_count > 0 ? `
                    <div class="repo-stat">
                        📌 <span>${repo.open_issues_count}</span>
                    </div>
                ` : ''}
            </div>
            <a href="${repo.html_url}" class="repo-link" target="_blank">View Repository →</a>
        </div>
    `).join('');
}

// Analyze languages
async function analyzeLanguages() {
    try {
        const response = await fetch(
            `${GITHUB_API_URL}/users/${GITHUB_USERNAME}/repos?per_page=100&type=owner`
        );
        if (!response.ok) throw new Error('Failed to fetch repositories');
        
        const repos = await response.json();
        const languages = {};
        
        repos.forEach(repo => {
            if (repo.language) {
                languages[repo.language] = (languages[repo.language] || 0) + 1;
            }
        });
        
        displayLanguages(languages);
    } catch (error) {
        console.error('Error analyzing languages:', error);
    }
}

// Display languages
function displayLanguages(languages) {
    const container = document.getElementById('languages-container');
    
    if (Object.keys(languages).length === 0) {
        container.innerHTML = '<p>No language data available.</p>';
        return;
    }
    
    const sorted = Object.entries(languages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12);
    
    const total = sorted.reduce((sum, [_, count]) => sum + count, 0);
    
    container.innerHTML = sorted.map(([lang, count]) => {
        const percentage = Math.round((count / total) * 100);
        return `
            <div class="language-card">
                <div class="language-icon">${LANGUAGE_EMOJIS[lang] || '💻'}</div>
                <div class="language-name">${lang}</div>
                <div class="language-percent">${percentage}%</div>
            </div>
        `;
    }).join('');
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    await fetchUserData();
    await fetchRepositories();
    await analyzeLanguages();
});