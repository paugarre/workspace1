function isAuthenticated() {
  return localStorage.getItem("authenticated") === "true";
}

function createDropdown() {
  const navbarNav = document.querySelector(".navbar-nav");

  if (isAuthenticated()) {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      const dropdownContainer = document.createElement("li");
      dropdownContainer.classList.add("nav-item", "dropdown");

      const dropdownToggle = document.createElement("a");
      dropdownToggle.classList.add("nav-link", "dropdown-toggle");
      dropdownToggle.setAttribute("href", "#");
      dropdownToggle.setAttribute("role", "button");
      dropdownToggle.setAttribute("data-bs-toggle", "dropdown");
      dropdownToggle.textContent = `Hola, ${savedUsername}`;

      const dropdownMenu = document.createElement("div");
      dropdownMenu.classList.add("dropdown-menu");
      const drop1 = document.createElement("a");
      drop1.classList.add("dropdown-item");
      drop1.textContent = "Mi carrito";
      drop1.href = "cart.html";
      dropdownMenu.appendChild(drop1);
      const drop2 = document.createElement("a");
      drop2.classList.add("dropdown-item");
      drop2.textContent = "Mi perfil";
      drop2.href = "my-profile.html";
      dropdownMenu.appendChild(drop2);
      const drop3 = document.createElement("a");
      drop3.classList.add("dropdown-item");
      drop3.setAttribute("id", "dark-mode");
      drop3.textContent = "Modo Noche-Día";
      dropdownMenu.appendChild(drop3);
      const divider = document.createElement("hr");
      divider.classList.add("dropdown-divider");
      dropdownMenu.appendChild(document.createElement("li")).appendChild(divider);
      const drop4 = document.createElement("a");
      drop4.classList.add("dropdown-item");
      drop4.textContent = "Cerrar sesión";
      drop4.addEventListener("click", function () {
        CerrarSesion();
      });
      dropdownMenu.appendChild(drop4);


      dropdownContainer.appendChild(dropdownToggle);
      dropdownContainer.appendChild(dropdownMenu);

      navbarNav.appendChild(dropdownContainer);
    }
  }
}

document.addEventListener("DOMContentLoaded", function () {
  createDropdown();
});

// Verificar si el usuario está autenticado
if (!isAuthenticated() && !window.location.href.includes("login")) {
  // Si no estamos autenticados, redirigimos al formulario de inicio de sesión
  window.location.href = "login.html";
  alert("Debe ingresar para poder continuar");
}

function CerrarSesion() {
  localStorage.removeItem('username');
  window.location.href = 'login.html'
}
