// ============================================
// CONFIGURACIÓN CENTRAL (Fácil de modificar)
// ============================================
const CONFIG = {
    // Selectores DOM
    selectors: {
        projectsGrid: "#projects-grid",
        collabsList: "#collabs-list",
        tagButtons: ".tag-btn",
        nekoTrigger: ".neko-trigger",
        nekoImg: "#neko-img",
        heroContent: "#hero-content",
        sections: ["skills", "projects", "collaborations", "contact"],
    },

    // Configuración de animaciones
    animations: {
        observerThreshold: 0.2,
        heroDelay: 100,
        nekoOffsetX: -40,
        nekoOffsetY: -90,
    },

    // Textos y mensajes
    messages: {
        emptyProjects: "No projects found in this category.",
        placeholderAlt: "(Image not found)",
        viewProject: "View Project",
        soon: "Soon",
    },

    // Imagen por defecto
    defaultImage: "images/covers/placeholder.webp",
};

// ============================================
// DATOS (Fáciles de añadir/modificar)
// ============================================
const DATA = {
    projects: [
        {
            cover: "images/covers/cover-thony-ui.webp",
            title: "Thony UI v1.3.0",
            description:
                "Transform the default Minecraft user interface into a sleek, modern design...",
            link: "pages/project.html?id=thony-ui",
            date: "June 7, 2025",
            tag: "UI",
        },
        {
            cover: "images/covers/cover-music-ui.webp",
            title: "Music UI v2.9.0",
            description:
                "Bring your favorite tunes to life with a custom music screen...",
            link: "pages/project.html?id=music-ui",
            date: "April 15, 2025",
            tag: "UI",
        },
        {
            cover: "images/covers/cover-music-oreui.webp",
            title: "Music Ore-UI v1.0",
            description:
                "Enhance your Minecraft experience with a brand-new screen...",
            link: "pages/project.html?id=music-oreui",
            date: "March 19, 2025",
            tag: "UI",
        },
        {
            cover: "images/covers/cover-notfound.webp",
            title: "Nocturn UI v1.0",
            description: "Soon...",
            link: "#",
            date: "",
            tag: "Other",
        },
    ],

    collaborations: [
        {
            href: "https://github.com/Xelo-Client/",
            img: "https://avatars.githubusercontent.com/u/213269799?s=200&v=4",
            name: "Xelo Client",
            description:
                "Open-Source Minecraft Bedrock Edition experience with advanced features.",
            title: "Xelo Client Collaboration",
        },
        {
            href: "https://galaxiteprojects.carrd.co/",
            img: "images/icons/galaxite.jpg",
            name: "Galaxity (@Galaxybrine_Playz)",
            description: "Creator of BetterChat and other projects.",
            title: "Galaxybrine Collaboration",
        },
    ],
};

// ============================================
// UTILITIES (Funciones reutilizables)
// ============================================
const Utils = {
    // Debounce para eventos que se disparan muchas veces
    debounce(fn, delay = 16) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    },

    // Throttle con requestAnimationFrame
    throttleRAF(fn) {
        let rafId = null;
        return function (...args) {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                fn.apply(this, args);
                rafId = null;
            });
        };
    },

    // Guardar en localStorage
    saveToStorage(key, value) {
        try {
            localStorage.setItem(`thonyui_${key}`, JSON.stringify(value));
        } catch (e) {
            console.warn("localStorage not available:", e);
        }
    },

    // Leer de localStorage
    loadFromStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(`thonyui_${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },

    // Crear elemento con atributos
    createElement(tag, className, attributes = {}) {
        const element = document.createElement(tag);
        if (className) element.className = className;
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === "text") element.textContent = value;
            else if (key === "html") element.innerHTML = value;
            else element.setAttribute(key, value);
        });
        return element;
    },
};

// ============================================
// COMPONENTES (Módulos independientes)
// ============================================

// 1. RENDERIZADOR DE PROYECTOS
const ProjectsRenderer = {
    container: null,

    init() {
        this.container = document.querySelector(CONFIG.selectors.projectsGrid);
        if (!this.container) {
            console.error("Projects grid not found");
            return false;
        }
        this.render();
        return true;
    },

    createProjectCard(project) {
        const card = Utils.createElement("div", "project-card");
        card.dataset.tag = (project.tag || "other").toLowerCase();

        // Image with lazy loading and error fallback
        const img = Utils.createElement("img", "project-image", {
            src: project.cover,
            alt: project.title,
            loading: "lazy",
        });
        img.onerror = () => {
            img.src = CONFIG.defaultImage;
            img.alt = `${project.title} ${CONFIG.messages.placeholderAlt}`;
        };
        card.appendChild(img);

        // Title + Tag container
        const titleTagContainer = Utils.createElement(
            "div",
            "title-tag-container",
        );

        const title = Utils.createElement("h3", "project-title", {
            text: project.title,
        });
        titleTagContainer.appendChild(title);

        const tag = Utils.createElement("span", "project-tag", {
            text: project.tag || "Other",
        });
        titleTagContainer.appendChild(tag);

        card.appendChild(titleTagContainer);

        // Description
        const description = Utils.createElement("p", "project-description", {
            text: project.description,
        });
        card.appendChild(description);

        // Footer
        const footer = Utils.createElement("div", "card-footer");

        const link = Utils.createElement("a", "project-link btn-secondary", {
            href: project.link,
            text: CONFIG.messages.viewProject,
            title: `View ${project.title}`,
        });
        footer.appendChild(link);

        const dateTag = Utils.createElement("div", "card-date-tag");
        const dateIcon = Utils.createElement("i", "ri-calendar-fill");
        const dateSpan = Utils.createElement("span", "", {
            text: project.date || CONFIG.messages.soon,
        });

        dateTag.appendChild(dateIcon);
        dateTag.appendChild(dateSpan);
        footer.appendChild(dateTag);

        card.appendChild(footer);
        return card;
    },

    render() {
        const fragment = document.createDocumentFragment();
        DATA.projects.forEach((project) => {
            fragment.appendChild(this.createProjectCard(project));
        });
        this.container.appendChild(fragment);
    },
};

// 2. FILTRO DE TAGS
const TagFilter = {
    buttons: [],
    container: null,
    currentTag: "all",

    init() {
        this.buttons = document.querySelectorAll(CONFIG.selectors.tagButtons);
        this.container = document.querySelector(CONFIG.selectors.projectsGrid);

        if (!this.buttons.length || !this.container) return false;

        // Cargar tag guardado
        const savedTag = Utils.loadFromStorage("selectedTag", "all");
        this.currentTag = savedTag;

        this.setupEventListeners();
        this.updateActiveButton();
        this.filter(savedTag);

        return true;
    },

    setupEventListeners() {
        this.buttons.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const tag = btn.dataset.tag;
                if (!tag) return;

                this.currentTag = tag;
                Utils.saveToStorage("selectedTag", tag);
                this.updateActiveButton();
                this.filter(tag);
            });
        });
    },

    updateActiveButton() {
        this.buttons.forEach((btn) => {
            const isActive = btn.dataset.tag === this.currentTag;
            btn.classList.toggle("active", isActive);
        });
    },

    filter(tag) {
        if (!this.container) return;

        const cards = this.container.querySelectorAll(".project-card");
        let visibleCount = 0;

        cards.forEach((card) => {
            const match = tag === "all" || card.dataset.tag === tag;
            card.style.display = match ? "" : "none";
            if (match) visibleCount++;
        });

        this.updateEmptyState(visibleCount === 0);
    },

    updateEmptyState(isEmpty) {
        let emptyState = this.container.querySelector(".empty-state");

        if (isEmpty) {
            if (!emptyState) {
                emptyState = Utils.createElement("div", "empty-state");
                emptyState.innerHTML = `
                    <i class="ri-folder-open-line"></i>
                    <p>${CONFIG.messages.emptyProjects}</p>
                `;
                this.container.appendChild(emptyState);
            }
        } else if (emptyState) {
            emptyState.remove();
        }
    },
};

// 3. RENDERIZADOR DE COLABORACIONES
const CollaborationsRenderer = {
    container: null,

    init() {
        this.container = document.querySelector(CONFIG.selectors.collabsList);
        if (!this.container) return false;
        this.render();
        return true;
    },

    createCollaborationCard(collab) {
        const link = Utils.createElement("a", "collaboration-card", {
            href: collab.href,
            title: collab.title || collab.name,
            target: "_blank",
            rel: "noopener noreferrer",
            role: "article",
        });

        const img = Utils.createElement("img", "", {
            src: collab.img,
            alt: collab.name,
        });
        link.appendChild(img);

        const info = Utils.createElement("div", "collaboration-info");
        const title = Utils.createElement("h3", "", { text: collab.name });
        const desc = Utils.createElement("p", "", { text: collab.description });

        info.appendChild(title);
        info.appendChild(desc);
        link.appendChild(info);

        return link;
    },

    render() {
        const fragment = document.createDocumentFragment();
        DATA.collaborations.forEach((collab) => {
            fragment.appendChild(this.createCollaborationCard(collab));
        });
        this.container.appendChild(fragment);
    },
};

// 4. NEKO CURSOR (con optimización de rendimiento)
const NekoCursor = {
    trigger: null,
    image: null,

    init() {
        this.trigger = document.querySelector(CONFIG.selectors.nekoTrigger);
        this.image = document.querySelector(CONFIG.selectors.nekoImg);

        if (!this.trigger || !this.image) return false;

        this.setupEventListeners();
        return true;
    },

    setupEventListeners() {
        this.trigger.addEventListener("mouseenter", () => {
            this.image.classList.add("is-visible");
        });

        // Throttle con requestAnimationFrame para mejor rendimiento
        const throttledMove = Utils.throttleRAF((e) => {
            const x = e.clientX;
            const y = e.clientY;
            this.image.style.left = `${x + CONFIG.animations.nekoOffsetX}px`;
            this.image.style.top = `${y + CONFIG.animations.nekoOffsetY}px`;
        });

        this.trigger.addEventListener("mousemove", throttledMove);

        this.trigger.addEventListener("mouseleave", () => {
            this.image.classList.remove("is-visible");
        });
    },
};

// 5. SCROLL ANIMATIONS (Intersection Observer)
const ScrollAnimations = {
    observer: null,

    init() {
        const options = {
            threshold: CONFIG.animations.observerThreshold,
            rootMargin: "0px 0px -50px 0px",
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    this.observer.unobserve(entry.target);
                }
            });
        }, options);

        CONFIG.selectors.sections.forEach((id) => {
            const element = document.getElementById(id);
            if (element) this.observer.observe(element);
        });
    },
};

// 6. HERO ANIMATION
const HeroAnimation = {
    init() {
        const heroContent = document.querySelector(
            CONFIG.selectors.heroContent,
        );
        if (heroContent) {
            setTimeout(() => {
                heroContent.classList.add("is-visible");
            }, CONFIG.animations.heroDelay);
        }
    },
};

// ============================================
// INICIALIZACIÓN (Un solo punto de entrada)
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    // Inicializar todos los módulos
    ProjectsRenderer.init();
    TagFilter.init();
    CollaborationsRenderer.init();
    NekoCursor.init();
    ScrollAnimations.init();
    HeroAnimation.init();

    console.log("Portal Initialized");
});
