# Mallikarjuna Kadiwal - Personal Portfolio 

A dynamic, fully responsive personal portfolio website showcasing my experience as a Full Stack Developer and DevOps Engineer. The site highlights my technical skills, professional experience, certifications, and dynamically fetches my latest GitHub projects.

## 🚀 Live Demo
*(Add your GitHub Pages link here, e.g., https://mallikarjunakadiwal.github.io/portfolio)*

## ✨ Key Features
* **Dynamic GitHub Integration:** Uses the GitHub REST API to automatically fetch, sort (by stars and recent updates), and display my public repositories. 
* **Category Filtering:** Custom JavaScript filtering allows users to sort projects by 'Frontend', 'Backend', or 'All'.
* **Light / Dark Mode:** A fully functional theme toggle that saves the user's preference to `localStorage` or defaults to their system preference.
* **Resume Download:** Built-in secure resume download functionality with custom success/error UI alerts.
* **Modern UI/UX:** Features smooth CSS animations, hover effects, sticky navigation, and a fully responsive mobile-first design.

## 🛠️ Tech Stack
* **HTML5:** Semantic structuring and accessibility.
* **CSS3:** Custom variables (CSS properties), Flexbox, CSS Grid, animations, and media queries for responsiveness.
* **JavaScript (Vanilla):** DOM manipulation, asynchronous API fetching (`fetch`), Intersection Observer for scroll animations, and `localStorage` management.

## 📁 Project Structure
```text
├── index.html      # Main HTML document
├── styles.css      # All styling, animations, and theme variables
├── script.js       # GitHub API integration, theme toggle logic, and UI alerts
├── resume.pdf      # Downloadable resume file
└── README.md       # Project documentation
