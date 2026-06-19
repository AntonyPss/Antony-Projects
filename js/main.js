// ============================================
// MENU TOGGLE
// ============================================
document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menuToggle");
    const mobileMenu = document.getElementById("mobileMenu");

    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener("click", function () {
            mobileMenu.classList.toggle("active");
            const isOpen = mobileMenu.classList.contains("active");
            menuToggle.setAttribute("aria-expanded", String(isOpen));

            const icon = menuToggle.querySelector("i");
            if (isOpen) {
                icon.classList.remove("ri-menu-line");
                icon.classList.add("ri-close-line");
            } else {
                icon.classList.remove("ri-close-line");
                icon.classList.add("ri-menu-line");
            }
        });

        const mobileLinks = mobileMenu.querySelectorAll("a");
        mobileLinks.forEach((link) => {
            link.addEventListener("click", function () {
                mobileMenu.classList.remove("active");
                menuToggle.setAttribute("aria-expanded", "false");
                const icon = menuToggle.querySelector("i");
                icon.classList.remove("ri-close-line");
                icon.classList.add("ri-menu-line");
            });
        });
    }
});

// Header shadow effect scrolled
window.addEventListener("scroll", function () {
    const header = document.getElementById("header");
    if (!header) return;

    if (window.scrollY > 20) {
        header.classList.add("header-scrolled");
    } else {
        header.classList.remove("header-scrolled");
    }
});

// Scroll to top button
const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {
    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = "block";
        } else {
            scrollTopBtn.style.display = "none";
        }
    });

    scrollTopBtn.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    });
}
