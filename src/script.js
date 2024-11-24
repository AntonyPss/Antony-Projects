const toggleButton = document.getElementById('darkModeToggle');
const icon = document.getElementById('icon');

// Función para cargar las traducciones desde el archivo JSON
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

// Cambiar el idioma al hacer clic en el botón o seleccionar del dropdown
function setLanguage(language) {
    loadTranslations(language);
    localStorage.setItem('language', language); // Guardar el idioma seleccionado en localStorage
}

// Establecer el idioma por defecto o el guardado
document.addEventListener('DOMContentLoaded', () => {
    const savedLanguage = localStorage.getItem('language') || 'es'; // Por defecto 'es'
    setLanguage(savedLanguage);

    // Vincular el cambio de idioma al dropdown
    const languageDropdown = document.querySelector('.language-selector select');
    if (languageDropdown) {
        languageDropdown.value = savedLanguage; // Establecer el valor inicial del dropdown
        languageDropdown.addEventListener('change', (event) => {
            setLanguage(event.target.value); // Cambiar idioma al seleccionar del dropdown
        });
    }
});

toggleButton.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Cambiar el icono de acuerdo al tema
    if (document.body.classList.contains('dark-mode')) {
        icon.src = "assets/icons/light-mode-ic.png";  // Icono de modo claro
        icon.alt = "Icono de modo claro";
    } else {
        icon.src = "assets/icons/dark-mode-ic.png";  // Icono de modo oscuro
        icon.alt = "Icono de modo oscuro";
    }
});