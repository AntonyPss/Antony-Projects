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

// Show Neko Image Hover
document.addEventListener("DOMContentLoaded", () => {
    const trigger = document.querySelector(".neko-trigger");
    const nekoImg = document.getElementById("neko-img");

    // 1. Mostrar el Neko cuando entra el mouse
    trigger.addEventListener("mouseenter", () => {
        nekoImg.classList.add("is-visible");
    });

    // 2. Mover el Neko con el mouse
    trigger.addEventListener("mousemove", (e) => {
        // Ajustamos la posición (e.clientX es la X del mouse)
        // Le restamos la mitad del ancho para centrarlo y restamos en Y para que esté "encima"
        const x = e.clientX;
        const y = e.clientY;

        // Ajusta los números (-40 y -90) según el tamaño de tu imagen
        nekoImg.style.left = `${x - 40}px`;
        nekoImg.style.top = `${y - 90}px`;
    });

    // 3. Ocultar el Neko cuando sale el mouse
    trigger.addEventListener("mouseleave", () => {
        nekoImg.classList.remove("is-visible");
    });
});
