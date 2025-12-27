document.addEventListener("DOMContentLoaded", () => {
    const previewItems = [
        {
            cover: "images/covers/cover-music-oreui.webp",
            title: "Music Ore-UI v1.0",
            message:
                "Enhance your Minecraft experience with a brand-new screen featuring the elegant Ore-Ui Style, designed specifically for custom music integration.",
            page: "pages/music-oreui.html",
            date: "March 19, 2025",
        },
        {
            cover: "images/covers/cover-thony-ui.webp",
            title: "Thony UI v1.3.0",
            message:
                "Transform the default Minecraft user interface into a sleek, modern design that elevates your gameplay experience to the next level.",
            page: "pages/thony-ui.html",
            date: "June 7, 2025",
        },
        {
            cover: "images/covers/cover-music-ui.webp",
            title: "Music UI v2.9.0",
            message:
                "Bring your favorite tunes to life with a custom music screen, offering seamless integration and an intuitive user experience.",
            page: "pages/music-ui.html",
            date: "April 15, 2025",
        },
        {
            cover: "images/covers/cover-notfound.webp",
            title: "Nocturn UI v1.0",
            message:
                "Soon...",
            page: "#",
            date: "Undefined",
        }
    ];

    const previewList = document.getElementById("projects-grid");
    if (!previewList) {
        console.error("Element with id 'projects-grid' not found!");
        return;
    }

    // Use a DocumentFragment for better performance when appending multiple nodes
    const fragment = document.createDocumentFragment();
    previewItems.forEach((item) => {
        // Main Div
        const card = document.createElement("div");
        card.className = "project-card";

        // Image Cover
        const img = document.createElement("img");
        img.src = item.cover;
        img.alt = item.title;
        img.className = "project-image";
        card.appendChild(img);

        // Title
        const title = document.createElement("h3");
        title.className = "project-title";
        title.textContent = item.title;
        card.appendChild(title);

        // Description
        const description = document.createElement("p");
        description.className = "project-description";
        description.textContent = item.message;
        card.appendChild(description);

        // Footer
        const footer = document.createElement("div");
        footer.className = "card-footer";

        // Link Button
        const link = document.createElement("a");
        link.href = item.page;
        link.className = "project-link btn-secondary";
        link.title = `View ${item.title}`;
        link.textContent = "View Project";
        footer.appendChild(link);

        // Date Tag
        const dateTag = document.createElement("div");
        dateTag.className = "card-date-tag";

        const dateIcon = document.createElement("i");
        dateIcon.className = "ri-calendar-fill";

        const dateSpan = document.createElement("span");
        dateSpan.textContent = item.date;

        dateTag.appendChild(dateIcon);
        dateTag.appendChild(dateSpan);
        footer.appendChild(dateTag);

        // All together
        card.appendChild(footer);
        fragment.appendChild(card);

        return fragment;
    });

    previewList.appendChild(fragment);

    // Load Collaboration Items
    const collaborationList = document.getElementById("collabs-list");
    const collaborations = [
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
    ];

    const collFragment = document.createDocumentFragment();
    collaborations.forEach((col) => {
        const a = document.createElement("a");
        a.href = col.href;
        a.className = "collaboration-card";
        a.title = col.title || col.name;
        a.role = "article";
        a.target = "_blank";
        a.rel = "noopener noreferrer";

        const img = document.createElement("img");
        img.src = col.img;
        img.alt = col.name;
        a.appendChild(img);

        const info = document.createElement("div");
        info.className = "collaboration-info";

        const h3 = document.createElement("h3");
        h3.textContent = col.name;
        const p = document.createElement("p");
        p.textContent = col.description;

        info.appendChild(h3);
        info.appendChild(p);
        a.appendChild(info);

        collFragment.appendChild(a);
    });

    collaborationList.appendChild(collFragment);
});
