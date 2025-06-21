document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Check if the project ID is valid
        const projectId = getProjectIdFromUrl();
        const project = await loadProjectData(projectId);

        if (!project) {
            throw new Error('Project data not available');
        }

        setupProject(project);
        setupImageModal();

    } catch (error) {
        console.error('Error:', error);
        showError();
    }
});

// Helper functions
function getProjectIdFromUrl() {
    return window.location.pathname.split('/').pop()
        .replace('.html', '')
        .replace('music-ore-ui', 'music_ore_ui')
        .replace('thony-ui', 'thony_ui')
        .replace('music-ui', 'music_ui')
        .replace(/-/g, '_')
        .replace(/_/g, '-');
}

async function loadProjectData(projectId) {
    try {
        const response = await fetch(`../data/data.json?${Date.now()}`);
        const data = await response.json();
        return data.projects[projectId] || getFallbackData(projectId);
    } catch {
        return getFallbackData(projectId);
    }
}

function getFallbackData(projectId) {
    const fallbacks = {
        'thony-ui': {
            title: "Thony Ui v1.2.9",
            description: "Modern UI with smooth animations",
            icon: "../assets/icons/Thony-Ui.png",
            screenshots: [{
                image: "../assets/img/Thony-Ui (1).png",
                title: "Fallback Image",
                description: "Default description"
            }]
        },
        'music-ore-ui': { /*...*/ },
        'music-ui': { /*...*/ }
    };
    return fallbacks[projectId];
}

function setupProject(project) {
    // Set Document Title and Project Details
    document.title = `${project.title} - Preview`;
    document.getElementById('projectTitle').textContent = project.title;
    document.getElementById('projectDescription').textContent = project.description;

    // Show Project Icon
    const icon = document.getElementById('projectIcon');
    icon.src = project.icon;
    icon.alt = project.iconAlt;

    // Load Screenshots Items
    const container = document.getElementById('screenshotsList');
    container.innerHTML = project.screenshots.map(screenshot => `
        <div class="card-item">
            <div class="card-content">
                <div class="card-miniature">
                    <img src="${screenshot.image}" alt="${screenshot.title} Cover" class="card-image" loading="lazy">
                </div>
                <div class="card-about">
                    <h3 class="card-title">${screenshot.title}</h3>
                    <p class="card-description">${screenshot.description}</p>
                </div>
            </div>
        </div>
  `).join('');

    // Load Downloads Items
    const downloads = document.getElementById("downloadsList");
    downloads.innerHTML = project.downloads.map(download => `
            <a href="${download.url}" target="_blank" class="download-card ${download.name.toLowerCase()}">
                <img src="${download.image}" alt="${download.name}">
                <div class="download-info">
                    <h4>${download.name}</h4>
                    <p>Download with ${download.name}</p>
                </div>
            </a>
  `).join('');
}

// Setup Image Modal for Screenshots
function setupImageModal() {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.getElementById('modalClose');

    document.addEventListener('click', (e) => {
        if (e.target.classList && e.target.classList.contains('card-image')) {
            modal.style.display = 'flex';
            modalImg.src = e.target.src;
            modalImg.alt = e.target.alt;
        }
    });

    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}

// Show Error Message if Project Data Fails to Load
function showError() {
    const errorElement = document.getElementById("errorMessage");
    errorElement.style.display = "block";
    errorElement.innerHTML = `
        <div class="error-message">
            <h2>Error loading project data</h2>
            <p>Please try again later or check your internet connection.</p>
        </div>
  `;
}