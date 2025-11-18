document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobile-nav");
  const overlay = document.getElementById("menu-overlay");
  const userMenu = document.getElementById("user-menu");
  const userIcon = document.getElementById("user-icon");


  const toggleMenu = () => {
    hamburger.classList.toggle("active");
    mobileNav.classList.toggle("active");
    overlay.classList.toggle("active");
    userMenu.classList.remove("show");
  };

  hamburger.onclick = (e) => {
    e.stopPropagation();
    toggleMenu();
  };

  overlay.onclick = () => {
    toggleMenu();
    userMenu.classList.remove("show");
  };


  userIcon.onclick = (e) => {
    e.stopPropagation();
    userMenu.classList.toggle("show");
    hamburger.classList.remove("active");
    mobileNav.classList.remove("active");
    overlay.classList.remove("active");
  };

  document.onclick = () => {
    userMenu.classList.remove("show");
  };
});
