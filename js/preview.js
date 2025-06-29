document.addEventListener("DOMContentLoaded", () => {
    const previewItems = [
        {
            cover: "assets/img/Music Ore-Ui - Screenshot.png",
            title: "Music Ore-Ui v1.0",
            message:
                "Enhance your Minecraft experience with a brand-new screen featuring the elegant Ore-Ui Style, designed specifically for custom music integration.",
            url: "https://github.com/AntonyPss/Music-Ui/blob/ore-ui/README.md",
            page: "pages/music-ore-ui.html",
            date: "2025-03-19",
            view: "View",
        },
        {
            cover: "assets/img/Thony Ui - Screenshot.png",
            title: "Thony Ui v1.2.9",
            message:
                "Transform the default Minecraft user interface into a sleek, modern design that elevates your gameplay experience to the next level.",
            url: "https://github.com/AntonyPss/Thony-Ui/blob/main/README.md",
            page: "pages/thony-ui.html",
            date: "2025-06-07",
            view: "View",
        },
        {
            cover: "assets/img/Music Ui - Screenshot.png",
            title: "Music v2.9.2",
            message:
                "Bring your favorite tunes to life with a custom music screen, offering seamless integration and an intuitive user experience.",
            url: "https://github.com/AntonyPss/Music-Ui/blob/main/README.md",
            page: "pages/music-ui.html",
            date: "2025-04-15",
            view: "View",
        },
    ];

    const previewList = document.getElementById("previewList");
    if (!previewList) {
        console.error("Element with id 'previewList' not found!");
        return;
    }

    previewItems.forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.className = "card-item";
        itemElement.innerHTML = `
            <div class="card-header">
                <span class="card-date"><strong>Last Update:</strong> ${item.date}</span>
                <div class="card-btns">
                    <a href="${item.url}" class="card-btn page-btn"><i class="ri-github-fill"></i></a>
                    <a href="${item.page}" class="card-btn view-btn">${item.view}</a>
                </div>
            </div>
            <div class="card-content">
                <div class="card-miniature">
                    <img src="${item.cover}" alt="${item.title} Cover" class="card-image">
                </div>
                <div class="card-about">
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-description">${item.message}</p>
                </div>
            </div>
        `;
        previewList.appendChild(itemElement);
    });
});
