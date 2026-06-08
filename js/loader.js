document.addEventListener("DOMContentLoaded", async () => {
    try {
        const projectId = getProjectIdFromUrl();
        const project = await loadProjectData(projectId);

        if (!project) {
            console.warn("Project data not available for ID:", projectId);
            showError();
            return;
        }

        setupProject(project);
        setupImageModal();
    } catch (error) {
        console.error("Error:", error);
        showError();
    }

    // Animaciones
    const observerOptions = { threshold: 0.2 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            }
        });
    }, observerOptions);

    const sections = ["review", "download", "contact"];
    sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });
});

function getProjectIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    let projectId = params.get("id");
    if (projectId) return projectId;

    const path = window.location.pathname;
    const fileName = path.split("/").pop().replace(".html", "");
    return fileName;
}

async function loadProjectData(projectId) {
    try {
        const response = await fetch(`../data/data.json?${Date.now()}`);
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const projects = data.projects || {};

        let project =
            projects[projectId] ||
            projects[projectId.replace(/-/g, "_")] ||
            projects[projectId.replace(/_/g, "-")];

        if (!project) {
            const normalizeId = (id) =>
                (id || "")
                    .toString()
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "");
            const normalizedTarget = normalizeId(projectId);
            const normalizedMap = Object.keys(projects).reduce((map, key) => {
                map[normalizeId(key)] = projects[key];
                return map;
            }, {});
            project = normalizedMap[normalizedTarget];
        }
        return project;
    } catch (error) {
        console.warn("Failed to load project data:", error);
        return null;
    }
}

function createBadge(iconClass, text, badgeType) {
    const badge = document.createElement("span");
    badge.className = `badge badge-${badgeType}`;
    const icon = document.createElement("i");
    icon.className = iconClass;
    const textSpan = document.createElement("span");
    textSpan.textContent = text;
    badge.appendChild(icon);
    badge.appendChild(textSpan);
    return badge;
}

function setupProject(project) {
    // ============================================
    // FONDO DINÁMICO (background-image directo)
    // ============================================
    const heroSection = document.getElementById("heroSection");
    if (heroSection) {
        if (project.backgroundImage || project.banner) {
            const bgImage = project.backgroundImage || project.banner;
            heroSection.style.backgroundImage = `url('${bgImage}')`;
            heroSection.style.backgroundSize = "cover";
            heroSection.style.backgroundPosition = "center";
            heroSection.style.backgroundRepeat = "no-repeat";
            heroSection.classList.add("dynamic-bg");
        } else {
            // Fondo por defecto si no hay definido
            heroSection.style.backgroundImage =
                "url('../images/banners/banner-empty.webp')";
            heroSection.classList.add("dynamic-bg");
        }
    } else {
        console.warn("Elemento #heroSection no encontrado en el DOM");
    }

    // ============================================
    // 2. BADGES (solo badges, sin texto extra)
    // ============================================
    const detailsContainer = document.getElementById("detailsList");
    if (detailsContainer) {
        const badgesWrapper = document.createElement("div");
        badgesWrapper.className = "project-badges";

        // Badge versión
        badgesWrapper.appendChild(
            createBadge(
                "ri-code-box-line",
                `v${project.version || "1.0.0"}`,
                "version",
            ),
        );
        // Badge soporte
        badgesWrapper.appendChild(
            createBadge(
                "ri-smartphone-line",
                project.versionSupport || "1.20+",
                "support",
            ),
        );
        // Badge plataforma
        if (project.platform) {
            badgesWrapper.appendChild(
                createBadge("ri-smartphone-line", project.platform, "platform"),
            );
        }
        // Badge estado
        if (project.status) {
            let icon =
                project.status.toLowerCase() === "stable"
                    ? "ri-checkbox-circle-line"
                    : "ri-flask-line";
            badgesWrapper.appendChild(
                createBadge(icon, project.status, "status"),
            );
        }
        // Badge open source
        if (project.openSource) {
            badgesWrapper.appendChild(
                createBadge("ri-github-fill", "Open Source", "opensource"),
            );
        }
        // Badge experimental
        if (project.experimental) {
            badgesWrapper.appendChild(
                createBadge("ri-alert-line", "Experimental", "experimental"),
            );
        }

        detailsContainer.innerHTML = "";
        detailsContainer.appendChild(badgesWrapper);
    }

    // ============================================
    // 3. Título, descripción e icono
    // ============================================
    document.title = `${project.title} - Preview`;
    const titleElement = document.getElementById("projectTitle");
    const descElement = document.getElementById("projectDescription");
    if (titleElement) titleElement.textContent = project.title;
    if (descElement) descElement.textContent = project.description;

    const icon = document.getElementById("projectIcon");
    if (icon) {
        icon.src =
            project.icon ||
            "https://via.placeholder.com/150?text=Image+not+found";
        icon.alt = project.title;
        icon.onerror = () => {
            icon.onerror = null;
            icon.src = "https://via.placeholder.com/150?text=Image+not+found";
        };
    }

    // ============================================
    // 4. Screenshots
    // ============================================
    const container = document.getElementById("projects-list");
    if (container) {
        container.innerHTML = "";
        if (project.screenshots && project.screenshots.length > 0) {
            const frag = document.createDocumentFragment();
            project.screenshots.forEach((screenshot, index) => {
                const card = document.createElement("div");
                card.className = "project-card";
                const img = document.createElement("img");
                img.src = screenshot.image || "";
                img.alt = screenshot.title || project.title || "";
                img.className = "project-image";
                img.loading = "lazy";
                const content = document.createElement("div");
                content.className = "project-card-content";
                const titleEl = document.createElement("h3");
                titleEl.className = "project-title";
                titleEl.textContent = screenshot.title || "Screenshot";
                const descEl = document.createElement("p");
                descEl.className = "project-description";
                descEl.textContent = screenshot.description || "";
                content.appendChild(titleEl);
                content.appendChild(descEl);
                card.appendChild(img);
                card.appendChild(content);
                frag.appendChild(card);
            });
            container.appendChild(frag);
        } else {
            container.innerHTML =
                '<p class="no-screenshots">No screenshots available</p>';
        }
    }

    // ============================================
    // 5. Downloads
    // ============================================
    const downloads = document.getElementById("download-list");
    if (downloads) {
        if (project.downloads && project.downloads.length > 0) {
            const fragmentDownloads = document.createDocumentFragment();
            project.downloads.forEach((download) => {
                const a = document.createElement("a");
                a.href = download.url || "#";
                a.className = "download-btn btn-secondary";
                a.title = "Download with " + (download.name || "File");
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                const icon = document.createElement("i");
                icon.className = "ri-download-line";
                const span = document.createElement("span");
                span.textContent = `${download.name || "Unnamed"}`;
                a.appendChild(icon);
                a.appendChild(span);
                fragmentDownloads.appendChild(a);
            });
            downloads.innerHTML = "";
            downloads.appendChild(fragmentDownloads);
        } else {
            downloads.innerHTML =
                '<p class="no-downloads">No downloads available</p>';
        }
    }
}

// Setup Image Modal (sin cambios importantes)
function setupImageModal() {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const closeBtn = document.getElementById("modalClose");
    const prevBtn = document.getElementById("modalPrev");
    const nextBtn = document.getElementById("modalNext");
    if (!modal || !modalImg || !closeBtn) return;
    let currentImages = [];
    let currentIndex = 0;

    document.addEventListener("click", (e) => {
        if (
            e.target.classList &&
            e.target.classList.contains("project-image")
        ) {
            const parentGrid =
                e.target.closest(".projects-grid") ||
                e.target.closest("#projects-list");
            if (parentGrid) {
                currentImages = Array.from(
                    parentGrid.querySelectorAll(".project-image"),
                ).map((img) => img.src);
                currentIndex = currentImages.indexOf(e.target.src);
                if (currentIndex === -1 && currentImages.length > 0)
                    currentIndex = 0;
            } else {
                currentImages = [e.target.src];
                currentIndex = 0;
            }
            updateModal();
            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    });

    const updateModal = () => {
        if (currentImages.length === 0) return;
        modalImg.src = currentImages[currentIndex];
        const caption = document.getElementById("modalCaption");
        if (caption)
            caption.textContent = `${currentIndex + 1} / ${currentImages.length}`;
        if (prevBtn)
            prevBtn.style.opacity = currentImages.length <= 1 ? "0.3" : "1";
        if (nextBtn)
            nextBtn.style.opacity = currentImages.length <= 1 ? "0.3" : "1";
    };

    const showNext = () => {
        if (currentImages.length > 1) {
            currentIndex = (currentIndex + 1) % currentImages.length;
            updateModal();
        }
    };
    const showPrev = () => {
        if (currentImages.length > 1) {
            currentIndex =
                (currentIndex - 1 + currentImages.length) %
                currentImages.length;
            updateModal();
        }
    };

    if (nextBtn)
        nextBtn.onclick = (e) => {
            e.stopPropagation();
            showNext();
        };
    if (prevBtn)
        prevBtn.onclick = (e) => {
            e.stopPropagation();
            showPrev();
        };

    const closeModal = () => {
        modal.classList.remove("active");
        document.body.style.overflow = "";
    };
    closeBtn.onclick = closeModal;
    modal.onclick = (e) => {
        if (e.target === modal || e.target.classList.contains("modal-overlay"))
            closeModal();
    };
    document.addEventListener("keydown", (e) => {
        if (!modal.classList.contains("active")) return;
        if (e.key === "Escape") closeModal();
        if (e.key === "ArrowRight") showNext();
        if (e.key === "ArrowLeft") showPrev();
    });
}

function showError() {
    const errorElement = document.getElementById("errorMessage");
    if (!errorElement) return;
    errorElement.style.display = "block";
    errorElement.innerHTML =
        '<div class="error-message"><h3>Error loading project data</h3><p>Please try again later or check your internet connection.</p></div>';
}
