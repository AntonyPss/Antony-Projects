const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const closeBtn = document.getElementById("modalClose");

function openModal(imgSrc) {
    modal.style.display = "block";
    modalImg.src = imgSrc;
}

function closeModal() {
    modal.style.display = "none";
}

document.querySelectorAll(".preview-list-item img").forEach((img) => {
    img.addEventListener("click", () => {
        openModal(img.src);
    });
});

closeBtn.addEventListener("click", closeModal);

window.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeModal();
    }
});
