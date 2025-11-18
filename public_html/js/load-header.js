document.addEventListener("DOMContentLoaded", () => {
  fetch("components/header.html")
    .then(res => res.text())
    .then(html => {
      document.querySelector("header").innerHTML = html;


      const hamburger = document.querySelector(".hamburger");
      const menuOverlay = document.querySelector(".menu-overlay");
      const navPanel = document.querySelector(".nav-panel");

      if (hamburger) {
        hamburger.addEventListener("click", () => {
          hamburger.classList.toggle("active");
          menuOverlay.classList.toggle("active");
          navPanel.classList.toggle("active");
        });
      }


      if (menuOverlay) {
        menuOverlay.addEventListener("click", () => {
          hamburger.classList.remove("active");
          menuOverlay.classList.remove("active");
          navPanel.classList.remove("active");
        });
      }
    })
    .catch(err => console.error("Error cargando el header:", err));
});
