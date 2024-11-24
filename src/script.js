// Función para cargar las traducciones desde el archivo JSON
function loadTranslations(language) {
  fetch('src/translations.json')
    .then(response => response.json())
    .then(translations => {
      const elements = document.querySelectorAll('[data-translate]');
      elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[language][key]) {
          element.innerText = translations[language][key];
        }
      });
    });
}

// Cambiar el idioma al hacer clic en el botón
function setLanguage(language) {
  loadTranslations(language);
  localStorage.setItem('language', language); // Guardar el idioma seleccionado en localStorage
}

// Establecer el idioma por defecto o el guardado
document.addEventListener('DOMContentLoaded', () => {
  const savedLanguage = localStorage.getItem('language') || 'es'; // Por defecto 'es'
  setLanguage(savedLanguage);
});
