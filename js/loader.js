document.addEventListener("DOMContentLoaded", async () => {
    const backButton = document.getElementById("backButton");
    backButton?.addEventListener("click", (event) => {
        const plainClick =
            event.button === 0 &&
            !event.metaKey &&
            !event.ctrlKey &&
            !event.shiftKey &&
            !event.altKey;
        if (plainClick && window.history.length > 1) {
            event.preventDefault();
            window.history.back();
        }
    });

    try {
        const projectId = getProjectIdFromUrl();
        const project = await loadProjectData(projectId);

        if (!project) {
            console.warn("Project data not available for ID:", projectId);
            showError();
            return;
        }

        setupProject(project, projectId);
        setupImageModal();
    } catch (error) {
        console.error("Error:", error);
        showError();
    }

    setupScrollAnimations();
});

function setupScrollAnimations() {
    const elements = document.querySelectorAll(".fade-anim");
    if (!elements.length) return;

    if (!("IntersectionObserver" in window)) {
        elements.forEach((element) => element.classList.add("is-visible"));
        return;
    }

    const observerOptions = {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px",
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    elements.forEach((element) => observer.observe(element));
}

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
        const response = await fetch("../data/data.json");
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

function setMetaContent(selector, content) {
    const element = document.querySelector(selector);
    if (element) {
        element.setAttribute("content", content);
    }
}

const DEFAULT_OG_IMAGE =
    "https://antony-portafolio.vercel.app/images/hero-bg.jpg";

function toAbsoluteUrl(url) {
    if (!url) return DEFAULT_OG_IMAGE;
    try {
        return new URL(url, window.location.origin).href;
    } catch {
        return DEFAULT_OG_IMAGE;
    }
}

function updateMetaTags(project, projectId) {
    const title = project?.title || "Antony Labs Project";
    const shareImage = project?.cover || project?.icon;
    const description =
        project?.description ||
        "Explore Antony Labs project previews with screenshots, version details, and direct download links for polished Minecraft Bedrock UI concepts.";
    const shortDescription =
        description.length > 160
            ? `${description.slice(0, 157)}...`
            : description;
    const currentUrl = projectId
        ? `${window.location.origin}${window.location.pathname}?id=${encodeURIComponent(projectId)}`
        : `${window.location.origin}${window.location.pathname}`;

    document.title = `${title} - Antony Labs`;
    setMetaContent('meta[name="description"]', shortDescription);
    setMetaContent('meta[property="og:title"]', `${title} - Antony Labs`);
    setMetaContent('meta[property="og:description"]', shortDescription);
    setMetaContent('meta[property="og:image"]', toAbsoluteUrl(shareImage));
    setMetaContent('meta[property="og:url"]', currentUrl);
    setMetaContent('meta[name="twitter:title"]', `${title} - Antony Labs`);
    setMetaContent('meta[name="twitter:description"]', shortDescription);
    setMetaContent('meta[name="twitter:image"]', toAbsoluteUrl(shareImage));

    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
        canonicalLink.setAttribute("href", currentUrl);
    }

    const schemaScript = document.querySelector(
        'script[type="application/ld+json"]',
    );
    if (schemaScript) {
        const schema = {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: title,
            description: shortDescription,
            image: toAbsoluteUrl(shareImage),
            url: currentUrl,
            author: {
                "@type": "Person",
                name: "Antony Calvo",
            },
        };
        schemaScript.textContent = JSON.stringify(schema);
    }
}

function setupProject(project, projectId) {
    updateMetaTags(project, projectId);

    // ============================================
    // BADGES
    // ============================================
    const detailsContainer = document.getElementById("detailsList");
    if (detailsContainer) {
        const badgesWrapper = document.createElement("div");
        badgesWrapper.className = "project-badges";

        // Badge version
        badgesWrapper.appendChild(
            createBadge(
                "ri-code-box-line",
                `v${project.version || "1.0.0"}`,
                "version",
            ),
        );
        // Badge support
        badgesWrapper.appendChild(
            createBadge(
                "ri-smartphone-line",
                `v${project.versionSupport || "1.21+"}`,
                "support",
            ),
        );
        // Badge platform
        if (project.platform) {
            badgesWrapper.appendChild(
                createBadge("ri-smartphone-line", project.platform, "platform"),
            );
        }
        // Badge status
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
        if (project.tag) {
            badgesWrapper.prepend(
                createBadge("ri-price-tag-3-line", project.tag, "category"),
            );
        }
        if (project.date) {
            badgesWrapper.appendChild(
                createBadge("ri-calendar-line", project.date, "release"),
            );
        }

        detailsContainer.innerHTML = "";
        detailsContainer.appendChild(badgesWrapper);
    }

    // ============================================
    // CARD ELEMENT
    // ============================================
    const titleElement = document.getElementById("projectTitle");
    const descElement = document.getElementById("projectDescription");
    if (titleElement) titleElement.textContent = project.title;
    if (descElement) descElement.textContent = project.description;

    const reviewDescription = document.getElementById("reviewDescription");
    if (reviewDescription) {
        const screenshotCount = project.screenshots?.length || 0;
        reviewDescription.textContent = screenshotCount
            ? `${screenshotCount} screens from ${project.title}, with notes on the interface details shown in each.`
            : `Screenshots and interface details for ${project.title}.`;
    }

    const overviewDescription = document.getElementById("overviewDescription");
    if (overviewDescription) {
        overviewDescription.textContent =
            project.description ||
            "This project combines a refined Bedrock interface with clear structure and modern visual styling.";
    }

    const overviewHighlights = document.getElementById("overviewHighlights");
    if (overviewHighlights) {
        const highlights = [
            {
                icon: "ri-code-box-line",
                text: `Version ${project.version || "1.0.0"}`,
            },
            {
                icon: "ri-smartphone-line",
                text: `Compatibility ${project.versionSupport || "1.20+"}`,
            },
            {
                icon: "ri-cpu-line",
                text: project.platform
                    ? `${project.platform} build`
                    : "Bedrock experience",
            },
            {
                icon: project.openSource
                    ? "ri-github-fill"
                    : "ri-community-line",
                text: project.openSource
                    ? "Open source project"
                    : "Community-focused project",
            },
        ];

        overviewHighlights.innerHTML = highlights
            .map(
                (item) => `
                    <li>
                        <i class="${item.icon}" aria-hidden="true"></i>
                        <span>${item.text}</span>
                    </li>
                `,
            )
            .join("");
    }

    const cover = document.getElementById("projectCover");
    if (cover) {
        const fallbackCover = "../images/covers/cover-notfound.webp";
        const coverPath = project.cover || "images/covers/cover-notfound.webp";
        cover.src =
            coverPath.startsWith("../") || /^https?:\/\//i.test(coverPath)
                ? coverPath
                : `../${coverPath.replace(/^\/+/, "")}`;
        cover.alt = `${project.title} cover`;
        cover.onerror = () => {
            cover.onerror = null;
            cover.src = fallbackCover;
        };
    }

    // ============================================
    // Screenshots
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
                img.width = 640;
                img.height = 360;
                img.loading = "lazy";
                img.decoding = "async";
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
    // Downloads
    // ============================================
    const downloads = document.getElementById("download-list");
    if (downloads) {
        const validDownloads = (project.downloads || []).filter(
            (download) =>
                download.url &&
                download.url !== "#none" &&
                download.url !== "#",
        );

        const downloadDescription = document.getElementById(
            "downloadDescription",
        );
        if (downloadDescription) {
            const versionLabel = project.version
                ? ` version ${project.version}`
                : "";
            const compatibility = project.versionSupport
                ? ` Compatible with Minecraft ${project.versionSupport}.`
                : " Check the project details for compatibility.";
            downloadDescription.textContent = validDownloads.length
                ? `Choose a trusted source to get ${project.title}${versionLabel}.${compatibility}`
                : `There are no download links available for ${project.title} yet.`;
        }

        if (validDownloads.length > 0) {
            const fragmentDownloads = document.createDocumentFragment();
            validDownloads.forEach((download) => {
                const a = document.createElement("a");
                a.href = download.url;
                a.className = "btn-secondary download-button";
                const provider = (download.name || "")
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, "");
                const providerClass = {
                    linkvertise: "download-linkvertise",
                    mcpedl: "download-mcpedl",
                    modbay: "download-modbay",
                    olcanomods: "download-olcanomods",
                }[provider];
                if (providerClass) a.classList.add(providerClass);
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

// Setup Image Modal
function setupImageModal() {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");
    const closeBtn = document.getElementById("modalClose");
    const prevBtn = document.getElementById("modalPrev");
    const nextBtn = document.getElementById("modalNext");
    if (!modal || !modalImg || !closeBtn) return;
    let currentImages = [];
    let currentIndex = 0;
    let lastFocusedElement = null;

    const focusableElements = [closeBtn, prevBtn, nextBtn].filter(Boolean);

    const openModal = () => {
        lastFocusedElement = document.activeElement;
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        closeBtn.focus();
    };

    const closeModal = () => {
        modal.classList.remove("active");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (lastFocusedElement) lastFocusedElement.focus();
    };

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
            openModal();
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
        if (e.key === "Tab" && focusableElements.length > 0) {
            e.preventDefault();
            const current = focusableElements.indexOf(document.activeElement);
            const next = e.shiftKey
                ? current <= 0
                    ? focusableElements.length - 1
                    : current - 1
                : current === focusableElements.length - 1 || current === -1
                  ? 0
                  : current + 1;
            focusableElements[next].focus();
        }
    });
}

function showError() {
    const errorElement = document.getElementById("errorMessage");
    if (!errorElement) return;
    errorElement.style.display = "block";
    errorElement.innerHTML =
        '<div class="error-message"><h3>Error loading project data</h3><p>Please try again later or check your internet connection.</p></div>';
}
