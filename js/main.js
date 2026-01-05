// Menu Hide Header
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const menuIcon = menuToggle.querySelector("i");

menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");

    if (navMenu.classList.contains("active")) {
        menuIcon.classList.replace("ri-menu-line", "ri-close-line");
    } else {
        menuIcon.classList.replace("ri-close-line", "ri-menu-line");
    }
});

document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        menuIcon.classList.replace("ri-close-line", "ri-menu-line");
    });
});

// Header Scroll Effect
window.addEventListener("scroll", function () {
    const header = document.getElementById("header");

    if (window.scrollY > 20) {
        header.classList.add("header-scrolled");
    } else {
        header.classList.remove("header-scrolled");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    // Neko Image Cursor
    const trigger = document.querySelector(".neko-trigger");
    const nekoImg = document.getElementById("neko-img");

    trigger.addEventListener("mouseenter", () => {
        nekoImg.classList.add("is-visible");
    });

    trigger.addEventListener("mousemove", (e) => {
        const x = e.clientX;
        const y = e.clientY;

        nekoImg.style.left = `${x - 40}px`;
        nekoImg.style.top = `${y - 90}px`;
    });

    //
    trigger.addEventListener("mouseleave", () => {
        nekoImg.classList.remove("is-visible");
    });

    // HTML Anims
    const observerOptions = {
        threshold: 0.2,
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
            }
        });
    }, observerOptions);

    const sections = ["projects", "collaborations", "contact"];
    sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
    });

    setTimeout(() => {
        document.getElementById("hero-content").classList.add("is-visible");
    }, 100);
});
