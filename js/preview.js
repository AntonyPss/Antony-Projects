document.addEventListener("DOMContentLoaded", () => {
    const previewItems = [
        {
            cover: "assets/img/Music Ore-Ui - Screenshot.png",
            title: "Music Ore-Ui v1.0",
            message: "Enhance your Minecraft experience with a brand-new screen featuring the elegant Ore-Ui Style, designed specifically for custom music integration.",
            url: "https://github.com/AntonyPss/Music-Ui/blob/ore-ui/README.md",
            page: "html/music-ore-ui.html",
        },
        {
            cover: "assets/img/Thony Ui - Screenshot.png",
            title: "Thony Ui v1.2.9",
            message: "Transform the default Minecraft user interface into a sleek, modern design that elevates your gameplay experience to the next level.",
            url: "https://github.com/AntonyPss/Thony-Ui/blob/main/README.md",
            page: "html/thony-ui.html",
        },
        {
            cover: "assets/img/Music Ui - Screenshot.png",
            title: "Music v2.9.2",
            message: "Bring your favorite tunes to life with a custom music screen, offering seamless integration and an intuitive user experience.",
            url: "https://github.com/AntonyPss/Music-Ui/blob/main/README.md",
            page: "html/music-ui.html",
        },
    ];

    const previewList = document.getElementById("previewList");
    if (!previewList) {
        console.error("Element with id 'previewList' not found!");
        return;
    }

    previewItems.forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.className = "preview-card";
        itemElement.innerHTML = `
            <div>
                <img src="${item.cover}" alt="${item.title}" class="preview-card-cover" />
            </div>
            <div class="preview-card-content">
                <div class="preview-card-header">
                    <h3>${item.title}</h3>
                    <p>${item.message}</p>
                </div>
                <div class="preview-footer">
                    <a href="${item.url}" class="preview-btn" id="previewAbout">
                        <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                    </a>
                    <a href="${item.page}" class="preview-btn" id="previewPage">
                        <svg role="img" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 512 512"><path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32l82.7 0L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3l0 82.7c0 17.7 14.3 32 32 32s32-14.3 32-32l0-160c0-17.7-14.3-32-32-32L320 0zM80 32C35.8 32 0 67.8 0 112L0 432c0 44.2 35.8 80 80 80l320 0c44.2 0 80-35.8 80-80l0-112c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 112c0 8.8-7.2 16-16 16L80 448c-8.8 0-16-7.2-16-16l0-320c0-8.8 7.2-16 16-16l112 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L80 32z"/></svg>
                        <span>See More</span>
                    </a>
                </div>
            </div>
        `;
        previewList.appendChild(itemElement);
    });
});
