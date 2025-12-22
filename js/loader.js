document.addEventListener("DOMContentLoaded", async () => {
    try {
        // Check if the project ID is valid
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
});

// Helper functions
function getProjectIdFromUrl() {
    // Priorizar el parámetro ?id= en la URL (p. ej. pages/project.html?id=thony-ui)
    const params = new URLSearchParams(window.location.search);
    let projectId = params.get("id");
    if (projectId) {
        console.log("Extracted project ID from query:", projectId);
        return projectId;
    }

    // Fallback: inferir desde el nombre del archivo
    const path = window.location.pathname;
    const fileName = path.split("/").pop().replace(".html", "");
    projectId = fileName;
    console.log("Extracted project ID from filename:", projectId);
    return projectId;
}

async function loadProjectData(projectId) {
    try {
        const response = await fetch(`../data/data.json?${Date.now()}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Intentar encontrar el proyecto con diferentes variaciones
        // Buscar distintas variantes: tal cual, con underscores y con guiones
        const projects = data.projects || {};
        let project =
            projects[projectId] ||
            projects[projectId.replace(/-/g, "_")] ||
            projects[projectId.replace(/_/g, "-")];

        // If exact/variant keys didn't match, try a normalized lookup
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

            // Still not found: try fallback definitions
            if (!project) {
                project =
                    getFallbackData(projectId) ||
                    getFallbackData(projectId.replace(/-/g, "_")) ||
                    getFallbackData(projectId.replace(/_/g, "-"));
            }
        }

        return project;
    } catch (error) {F
        console.warn(
            "Failed to load project data from JSON, using fallback:",
            error
        );
        return getFallbackData(projectId);
    }
}

function getFallbackData(projectId) {
    const fallbacks = {
        thony_ui: {
            title: "Thony Ui v1.2.9",
            description: "Modern UI with smooth animations",
            icon: "../assets/icons/Thony-Ui.png",
            versionSupport: "1.20+",
            screenshots: [
                {
                    image: "../assets/img/Thony-Ui (1).png",
                    title: "Fallback Image",
                    description: "Default description",
                },
            ],
            downloads: [
                {
                    name: "MediaFire",
                    url: "#",
                    image: "../assets/icons/MediaFire.png",
                },
            ],
        },
        music_ore_ui: {
            title: "Music Ore UI",
            description: "Music-themed UI pack",
            icon: "../assets/icons/Music-Ore-UI.png",
            versionSupport: "1.20+",
            screenshots: [
                {
                    image: "../assets/img/Music-Ore-UI (1).png",
                    title: "Fallback Image",
                    description: "Default description",
                },
            ],
            downloads: [
                {
                    name: "MediaFire",
                    url: "#",
                    image: "../assets/icons/MediaFire.png",
                },
            ],
        },
        music_ui: {
            title: "Music UI",
            description: "Another music UI pack",
            icon: "../assets/icons/Music-UI.png",
            versionSupport: "1.20+",
            screenshots: [
                {
                    image: "../assets/img/Music-UI (1).png",
                    title: "Fallback Image",
                    description: "Default description",
                },
            ],
            downloads: [
                {
                    name: "MediaFire",
                    url: "#",
                    image: "../assets/icons/MediaFire.png",
                },
            ],
        },
    };

    // También buscar por ID con guiones
    const alternativeId = projectId.replace(/_/g, "-");
    return fallbacks[projectId] || fallbacks[alternativeId];
}

function setupProject(project) {
    const detailsContainer = document.getElementById("detailsList");
    const fragment = document.createDocumentFragment();

    const createDetailItem = (labelText, valueId, valueText) => {
        const item = document.createElement("div");
        item.className = "detail-item";

        const label = document.createElement("span");
        label.className = "detail-label";
        label.textContent = labelText;

        const value = document.createElement("span");
        value.className = "detail-value";
        value.id = valueId;
        value.textContent = valueText;

        item.appendChild(label);
        item.appendChild(value);
        return item;
    };

    fragment.appendChild(
        createDetailItem(
            "Version:",
            "projectVersion",
            project.version || "1.0.0"
        )
    );
    fragment.appendChild(
        createDetailItem(
            "Version Support:",
            "projectVersionSupport",
            project.versionSupport || "1.20+"
        )
    );

    detailsContainer.innerHTML = "";
    detailsContainer.appendChild(fragment);

    // Set Document Title and Project Details
    document.title = `${project.title} - Preview`;
    document.getElementById("projectTitle").textContent = project.title;
    document.getElementById("projectDescription").textContent =
        project.description;

    // Show Project Icon
    const icon = document.getElementById("projectIcon");
    icon.src = project.icon;
    icon.alt = project.title;

    // Use a DocumentFragment for better performance when appending multiple nodes
    const container = document.getElementById("projects-list");
    container.innerHTML = "";

    if (project.screenshots && project.screenshots.length > 0) {
        const frag = document.createDocumentFragment();

        project.screenshots.forEach((screenshot) => {
            const card = document.createElement("div");
            card.className = "project-card";

            const img = document.createElement("img");
            img.src = screenshot.image || "";
            img.alt = screenshot.title || project.title || "";
            img.className = "project-image";

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

    // Load Downloads Items
    const downloads =
        document.getElementById("download-list") ||
        document.getElementById("downloadsList");
    if (project.downloads && project.downloads.length > 0) {
        const fragment = document.createDocumentFragment();
        project.downloads.forEach((download) => {
            const a = document.createElement("a");
            a.href = download.url || "#";
            a.className = "btn-secondary";
            a.title = "Download " + (download.name || "File");
            a.target = "_blank";

            const icon = document.createElement("i");
            icon.className = "ri-download-line";

            const span = document.createElement("span");
            span.textContent = `Download with ${download.name || ""}`;

            a.appendChild(icon);
            a.appendChild(span);
            fragment.appendChild(a);
        });

        downloads.innerHTML = "";
        downloads.appendChild(fragment);
    } else {
        downloads.innerHTML =
            '<p class="no-downloads">No downloads available</p>';
    }
}

// Setup Image Modal for Screenshots
function setupImageModal() {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const closeBtn = document.getElementById("modalClose");
    const prevBtn = document.getElementById("modalPrev"); // Botones nuevos del rediseño
    const nextBtn = document.getElementById("modalNext");

    if (!modal || !modalImg || !closeBtn) return;

    let currentImages = [];
    let currentIndex = 0;

    // Abrir modal al hacer clic en cualquier imagen de proyecto
    document.addEventListener("click", (e) => {
        if (
            e.target.classList &&
            e.target.classList.contains("project-image")
        ) {
            // Obtenemos todas las imágenes del mismo contenedor para crear la galería
            const parentGrid =
                e.target.closest(".gallery-grid") ||
                e.target.closest(".projects-grid");
            currentImages = Array.from(
                parentGrid.querySelectorAll(".project-image")
            ).map((img) => img.src);
            currentIndex = currentImages.indexOf(e.target.src);

            updateModal();
            modal.classList.add("active"); // Usamos clases en lugar de .style.display
        }
    });

    // Función para actualizar contenido del modal
    const updateModal = () => {
        modalImg.src = currentImages[currentIndex];
        // Opcional: añadir contador (ej: 1 / 5)
        const caption = document.getElementById("modalCaption");
        if (caption)
            caption.textContent = `${currentIndex + 1} / ${
                currentImages.length
            }`;
    };

    // Navegación
    const showNext = () => {
        currentIndex = (currentIndex + 1) % currentImages.length;
        updateModal();
    };

    const showPrev = () => {
        currentIndex =
            (currentIndex - 1 + currentImages.length) % currentImages.length;
        updateModal();
    };

    // Eventos de botones
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

    // Cerrar modal
    const closeModal = () => modal.classList.remove("active");
    closeBtn.onclick = closeModal;

    // Cerrar al hacer clic en el fondo (overlay)
    modal.onclick = (e) => {
        if (
            e.target === modal ||
            e.target.classList.contains("modal-overlay")
        ) {
            closeModal();
        }
    };

    // Control por teclado (Esc y Flechas)
    document.addEventListener("keydown", (e) => {
        if (!modal.classList.contains("active")) return;

        if (e.key === "Escape") closeModal();
        if (e.key === "ArrowRight") showNext();
        if (e.key === "ArrowLeft") showPrev();
    });
}

// Show Error Message if Project Data Fails to Load
function showError() {
    const errorElement = document.getElementById("errorMessage");
    if (!errorElement) return;

    errorElement.style.display = "block";
    errorElement.innerHTML = "";

    const frag = document.createDocumentFragment();

    const wrapper = document.createElement("div");
    wrapper.className = "error-message";

    const title = document.createElement("h2");
    title.textContent = "Error loading project data";

    const msg = document.createElement("p");
    msg.textContent =
        "Please try again later or check your internet connection.";

    wrapper.appendChild(title);
    wrapper.appendChild(msg);
    frag.appendChild(wrapper);

    errorElement.appendChild(frag);
}
