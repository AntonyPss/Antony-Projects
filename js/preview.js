// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
    // DOM ELEMENTS
    selectors: {
        projectsGrid: "#projects-grid",
        collabsList: "#collabs-list",
        tagButtons: "button.tag-btn",
        searchInput: ".search-element",
        nekoTrigger: ".neko-trigger",
        nekoImg: "#neko-img",
        heroContent: "#hero-content",
        animatedElements: ".fade-anim",
    },

    // ANIMS
    animations: {
        observerThreshold: 0.2,
        heroDelay: 100,
        nekoOffsetX: -40,
        nekoOffsetY: -90,
    },

    // MESSAGES
    messages: {
        emptyProjects: "No projects found in this category.",
        placeholderAlt: "(Image not found)",
        viewProject: "View Project",
        soon: "Soon",
    },

    // COVER PLACEHOLDER
    defaultImage: "images/covers/cover-notfound.webp",
};

// ============================================
// DATA
// ============================================
const DATA = {
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
            img: "images/icons/galaxite.webp",
            name: "Galaxity (@Galaxybrine_Playz)",
            description: "Creator of BetterChat and other projects.",
            title: "Galaxybrine Collaboration",
        },
        {
            href: "https://github.com/OlcanoDev",
            img: "https://avatars.githubusercontent.com/u/321031975?s=200&v=4",
            name: "OlcanoDev",
            description: "Official GitHub organization for the Olcano Minecraft Bedrock server",
            title: "OlcanoDev Collaboration",
        }
    ],
};

// Tarjeta placeholder "Soon"
const SOON_PROJECT = {
    title: "Soon",
    cover: "images/covers/cover-notfound.webp",
    description: "Soon...",
    link: "",
    date: "",
    tag: "Other",
};

// Carga la lista de proyectos desde data.json (única fuente de datos)
async function fetchProjects() {
    try {
        const response = await fetch("data/data.json");
        if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        return Object.entries(data.projects || {}).map(([id, project]) => ({
            id,
            ...project,
        }));
    } catch (error) {
        console.warn("Failed to load projects data:", error);
        return [];
    }
}

// ============================================
// UTILITIES
// ============================================
const Utils = {
    debounce(fn, delay = 16) {
        let timeoutId;
        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    },

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

    // Save to localStorage
    saveToStorage(key, value) {
        try {
            localStorage.setItem(`thonyui_${key}`, JSON.stringify(value));
        } catch (e) {
            console.warn("localStorage not available:", e);
        }
    },

    // Read localStorage
    loadFromStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(`thonyui_${key}`);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },

    // Create elements with atributes
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
// COMPONENTS
// ============================================

// Render projects
const ProjectsRenderer = {
    container: null,
    projects: [],

    init(projects) {
        this.container = document.querySelector(CONFIG.selectors.projectsGrid);
        if (!this.container) {
            console.error("Projects grid not found");
            return false;
        }
        this.projects = projects || [];
        this.render();
        return true;
    },

    createProjectCard(project) {
        const card = Utils.createElement("div", "project-card");
        card.dataset.tag = (project.tag || "other").toLowerCase();

        // ===== Image container and Badges =====
        const imageContainer = Utils.createElement("div", "image-container");

        const img = Utils.createElement("img", "project-image", {
            src: project.cover || CONFIG.defaultImage,
            alt: `${project.title} project cover`,
            width: "640",
            height: "360",
            loading: "lazy",
            decoding: "async",
        });

        img.onerror = () => {
            img.onerror = null;
            img.src = CONFIG.defaultImage;
            img.alt = `${project.title} ${CONFIG.messages.placeholderAlt}`;
        };

        imageContainer.appendChild(img);
        card.appendChild(imageContainer);

        // ===== Titles and Tags =====
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

        // Set class to lowerCase
        if (project.tag) {
            const tagClass = project.tag.toLowerCase().replace(/\s+/g, "-");
            tag.classList.add(tagClass);
        }

        titleTagContainer.appendChild(tag);
        card.appendChild(titleTagContainer);

        // ===== DESCRIPTION =====
        const description = Utils.createElement("p", "project-description", {
            text: project.description,
        });
        card.appendChild(description);

        // ===== FOOTER =====
        const footer = Utils.createElement("div", "card-footer");

        const projectUrl =
            project.link ||
            (project.id
                ? `pages/project.html?id=${encodeURIComponent(project.id)}`
                : "");
        const hasProjectLink = Boolean(projectUrl);
        const link = Utils.createElement("a", "project-link btn-secondary", {
            href: hasProjectLink ? projectUrl : "#",
            text: hasProjectLink
                ? project.linkText || CONFIG.messages.viewProject
                : CONFIG.messages.soon,
            title: hasProjectLink
                ? `Ver ${project.title}`
                : `${project.title} ${CONFIG.messages.soon}`,
        });
        if (!hasProjectLink) {
            link.classList.add("project-link-disabled");
            link.setAttribute("aria-disabled", "true");
            link.addEventListener("click", (e) => e.preventDefault());
        }

        // Add icons types
        const linkIcon =
            project.tag === "UI"
                ? Utils.createElement("i", "ri-layout-grid-line")
                : Utils.createElement("i", "ri-download-line");

        link.prepend(linkIcon);
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
        this.projects.forEach((project) => {
            fragment.appendChild(this.createProjectCard(project));
        });
        this.container.appendChild(fragment);
    },
};

const LatestProjectRenderer = {
    init(projects) {
        const section = document.querySelector("#latest-release");
        const container = document.querySelector("#latest-project-feature");
        if (!section || !container) return;

        const latestProject = (projects || [])
            .filter((project) => project.date && Number.isFinite(Date.parse(project.date)))
            .sort((first, second) => Date.parse(second.date) - Date.parse(first.date))[0];

        if (!latestProject) return;

        const projectUrl =
            latestProject.link ||
            `pages/project.html?id=${encodeURIComponent(latestProject.id)}`;
        const article = Utils.createElement("article", "latest-project-feature");
        const imageLink = Utils.createElement("a", "latest-project-media", {
            href: projectUrl,
            "aria-label": `View ${latestProject.title}`,
        });
        const image = Utils.createElement("img", "latest-project-image", {
            src: latestProject.cover || CONFIG.defaultImage,
            alt: `${latestProject.title} project cover`,
            width: "1280",
            height: "720",
            loading: "eager",
            decoding: "async",
            fetchpriority: "high",
        });
        image.onerror = () => {
            image.onerror = null;
            image.src = CONFIG.defaultImage;
            image.alt = `${latestProject.title} ${CONFIG.messages.placeholderAlt}`;
        };
        imageLink.appendChild(image);

        const content = Utils.createElement("div", "latest-project-content");
        const meta = Utils.createElement("div", "latest-project-meta");
        meta.appendChild(
            Utils.createElement("span", "latest-project-tag", {
                text: latestProject.tag || "Project",
            }),
        );
        const date = new Date(latestProject.date);
        meta.appendChild(
            Utils.createElement("time", "", {
                datetime: date.toISOString().slice(0, 10),
                text: latestProject.date,
            }),
        );

        const title = Utils.createElement("h3", "latest-project-title", {
            text: latestProject.title,
        });
        const description = Utils.createElement("p", "latest-project-description", {
            text: latestProject.description || "",
        });
        const viewLink = Utils.createElement("a", "btn-primary press-button latest-project-link", {
            href: projectUrl,
            title: `View ${latestProject.title}`,
        });
        viewLink.appendChild(
            Utils.createElement("span", "", { text: CONFIG.messages.viewProject }),
        );
        viewLink.appendChild(Utils.createElement("i", "ri-arrow-right-line", {
            "aria-hidden": "true",
        }));

        content.append(meta, title, description, viewLink);
        article.append(imageLink, content);
        container.replaceChildren(article);
        section.hidden = false;
    },
};

// TAGS FILTERS
const TagFilter = {
    buttons: [],
    container: null,
    currentTag: "all",
    searchQuery: "",

    init() {
        this.buttons = document.querySelectorAll(CONFIG.selectors.tagButtons);
        this.container = document.querySelector(CONFIG.selectors.projectsGrid);

        if (!this.buttons.length || !this.container) return false;

        this.container.setAttribute("aria-live", "polite");

        // Load tag saved
        const savedTag = Utils.loadFromStorage("selectedTag", "all");
        const hasSavedTag = Array.from(this.buttons).some(
            (button) =>
                button.dataset.tag === savedTag &&
                button.getAttribute("aria-disabled") !== "true",
        );
        this.currentTag = hasSavedTag ? savedTag : "all";

        const searchInput = document.querySelector(
            CONFIG.selectors.searchInput,
        );
        if (searchInput) {
            searchInput.addEventListener(
                "input",
                Utils.debounce(() => {
                    this.searchQuery = searchInput.value.trim().toLowerCase();
                    this.filter(this.currentTag);
                }),
            );
        }

        this.setupEventListeners();
        this.updateActiveButton();
        this.filter(this.currentTag);

        return true;
    },

    setupEventListeners() {
        this.buttons.forEach((btn) => {
            if (btn.getAttribute("aria-disabled") === "true") return;
            btn.setAttribute("aria-controls", "projects-grid");
            btn.addEventListener("click", () => {
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
            btn.setAttribute("aria-pressed", String(isActive));
        });
    },

    filter(tag) {
        if (!this.container) return;

        const cards = this.container.querySelectorAll(".project-card");
        let visibleCount = 0;

        cards.forEach((card) => {
            const tagMatch = tag === "all" || card.dataset.tag === tag;
            const text = `${card.querySelector(".project-title")?.textContent || ""} ${card.querySelector(".project-description")?.textContent || ""}`.toLowerCase();
            const searchMatch =
                !this.searchQuery || text.includes(this.searchQuery);
            const match = tagMatch && searchMatch;
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
                    <span class="empty-state-icon">
                        <i class="ri-folder-open-line"></i>
                    </span>
                    <p>${CONFIG.messages.emptyProjects}</p>
                `;
                this.container.appendChild(emptyState);
            }
        } else if (emptyState) {
            emptyState.remove();
        }
    },
};

// Render collaborations
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
            loading: "lazy",
            decoding: "async",
            width: "60",
            height: "60",
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

// NEKO Cursos (Lol)
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

        this.trigger.addEventListener("focus", () => {
            this.image.classList.add("is-visible");
        });

        this.trigger.addEventListener("blur", () => {
            this.image.classList.remove("is-visible");
        });

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

// SCROLL ANIMATIONS
const ScrollAnimations = {
    observer: null,

    init() {
        const elements = document.querySelectorAll(
            CONFIG.selectors.animatedElements,
        );
        if (!elements.length) return false;

        if (!("IntersectionObserver" in window)) {
            elements.forEach((element) => element.classList.add("is-visible"));
            return true;
        }

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

        elements.forEach((element) => this.observer.observe(element));
        return true;
    },
};

// HERO ANIMATION
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
// INITIALIZATION
// ============================================
document.addEventListener("DOMContentLoaded", () => {
    fetchProjects().then((projects) => {
        LatestProjectRenderer.init(projects);
        ProjectsRenderer.init([...projects, SOON_PROJECT]);
        TagFilter.init();
    });
    CollaborationsRenderer.init();
    NekoCursor.init();
    ScrollAnimations.init();
    HeroAnimation.init();

    console.log("Portal Initialized");
});
