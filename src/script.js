const toggleButton = document.getElementById('darkModeToggle');
const icon = document.getElementById('icon');
const menuToggle = document.querySelector('.menu-toggle');
const headerNav = document.querySelector('.header-nav');

function loadTranslations(language) {
    fetch('src/translations.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar las traducciones: ${response.status}`);
            }
            return response.json();
        })
        .then(translations => {
            const elements = document.querySelectorAll('[data-translate]');
            elements.forEach(element => {
                const key = element.getAttribute('data-translate');
                if (translations[language][key]) {
                    element.innerText = translations[language][key];
                } else {
                    console.warn(`No se encontró la clave '${key}' para el idioma '${language}'`);
                }
            });
        })
        .catch(error => console.error('Error al cargar traducciones:', error));
}

function setLanguage(language) {
    loadTranslations(language);
    localStorage.setItem('language', language);
}

document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('language') || 'es';
    setLanguage(savedLanguage);

    const languageDropdown = document.querySelector('.language-selector select');
    if (languageDropdown) {
        languageDropdown.value = savedLanguage;
        languageDropdown.addEventListener('change', (event) => {
            setLanguage(event.target.value);
        });
    }
});

toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        icon.src = "assets/icons/light-mode-ic.png";
        icon.alt = "Icono de modo claro";
    } else {
        icon.src = "assets/icons/dark-mode-ic.png";
        icon.alt = "Icono de modo oscuro";
    }
});

menuToggle.addEventListener('click', () => {
    headerNav.classList.toggle('active');
});