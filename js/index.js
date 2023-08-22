document.addEventListener("DOMContentLoaded", function() {
  // Verificar si el usuario está autenticado
  if (!isAuthenticated()) {
    // Si no estamos autenticados, redirigimos al formulario de inicio de sesión
    window.location.href = "login.html";
    alert("Debe ingresar para poder continuar");
  }

  document.getElementById("autos").addEventListener("click", function() {
    localStorage.setItem("catID", 101);
    window.location = "products.html";
  });
  document.getElementById("juguetes").addEventListener("click", function() {
    localStorage.setItem("catID", 102);
    window.location = "products.html";
  });
  document.getElementById("muebles").addEventListener("click", function() {
    localStorage.setItem("catID", 103);
    window.location = "products.html";
  });

  // Mostrar saludo con nombre de usuario en la barra de navegación
  const usernameDisplay = document.createElement("span");
  usernameDisplay.classList.add("nav-link");

  if (isAuthenticated()) {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      usernameDisplay.textContent = `Hola, ${savedUsername}`; // Modificado para incluir el saludo
      document.querySelector(".navbar-nav").appendChild(usernameDisplay);
    }
  }
});

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
  return localStorage.getItem("authenticated") === "true";
}
