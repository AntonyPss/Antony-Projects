document.addEventListener('DOMContentLoaded', async () => {
  try {
      // Obtener el ID del proyecto
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
  // Configurar metadatos
  document.title = `${project.title} - Preview`;
  document.getElementById('projectTitle').textContent = project.title;
  document.getElementById('projectDescription').textContent = project.description;
  
  // Configurar icono
  const icon = document.getElementById('projectIcon');
  icon.src = project.icon;
  icon.alt = project.iconAlt;

  // Cargar screenshots
  const container = document.getElementById('screenshotsContainer');
  container.innerHTML = project.screenshots.map(screenshot => `
      <div class="preview-list-item">
          <img src="${screenshot.image}" 
               alt="${screenshot.title}" 
               class="viewImage"
               loading="lazy">
          <div class="preview-header">
              <h3>${screenshot.title}</h3>
              <p>${screenshot.description}</p>
          </div>
      </div>
  `).join('');

  // Cargar descargas
  const downloads = document.getElementById('downloadsContainer');
  downloads.innerHTML = project.downloads.map(download => `
      <a href="${download.url}" target="_blank" rel="noopener" class="download-link">
          <div class="preview-list-item users-list ${download.name.toLowerCase()}">
              <img src="${download.image}" 
                   alt="${download.name}" 
                   class="userIcon">
              <div class="users-upper">
                  <h3>${download.name}</h3>
              </div>
          </div>
      </a>
  `).join('');
}

function setupImageModal() {
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImage');
  const closeBtn = document.getElementById('modalClose');

  document.addEventListener('click', (e) => {
      if (e.target.classList.contains('viewImage')) {
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

function showError() {
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.innerHTML = `
      <p>⚠️ Error loading content. Please try again later.</p>
      <p>If the problem persists, contact support.</p>
  `;
  document.querySelector('main').prepend(errorElement);
}