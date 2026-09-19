// ============================================
// MENU TOGGLE
// ============================================
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if (menuToggle && mobileMenu) {
        const icon = menuToggle.querySelector("i");

        const setMenuState = (isOpen) => {
            mobileMenu.classList.toggle("active", isOpen);
            mobileMenu.hidden = !isOpen;
            menuToggle.setAttribute("aria-expanded", String(isOpen));

            if (icon) {
                icon.classList.toggle("ri-menu-line", !isOpen);
                icon.classList.toggle("ri-close-line", isOpen);
            }
        };

        const closeMenu = () => setMenuState(false);

        menuToggle.addEventListener("click", function () {
            const isOpen = mobileMenu.classList.contains("active");
            setMenuState(!isOpen);
        });

        const mobileLinks = mobileMenu.querySelectorAll("a");
        mobileLinks.forEach((link) => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && mobileMenu.classList.contains("active")) {
                closeMenu();
            }
        });
    }
});

// Header shadow effect scrolled
window.addEventListener("scroll", function () {
    const header = document.getElementById("header");
    if (!header) return;

    header.classList.toggle("header-scrolled", window.scrollY > 20);
});

// Scroll to top button
const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {
    const updateScrollTopButton = () => {
        const shouldShow = window.scrollY > 300;
        scrollTopBtn.hidden = !shouldShow;
        scrollTopBtn.setAttribute("aria-hidden", String(!shouldShow));
    };

    updateScrollTopButton();
    window.addEventListener("scroll", updateScrollTopButton, { passive: true });

    scrollTopBtn.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });
}
