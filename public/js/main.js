// Main JavaScript for the landing page

document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("current-year").textContent = new Date().getFullYear()

  // Mobile menu toggle
  const navbarToggle = document.querySelector(".navbar-toggle")
  const navbarMenu = document.querySelector(".navbar-menu")

  if (navbarToggle && navbarMenu) {
    navbarToggle.addEventListener("click", () => {
      navbarMenu.style.display = navbarMenu.style.display === "block" ? "none" : "block"
      navbarToggle.classList.toggle("active")
    })
  }

  // Close menu on window resize
  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768 && navbarMenu) {
      navbarMenu.style.display = ""
      if (navbarToggle) navbarToggle.classList.remove("active")
    }
  })
})
