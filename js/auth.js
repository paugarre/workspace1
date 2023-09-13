function isAuthenticated() {
    return localStorage.getItem("authenticated") === "true";
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    const usernameDisplay = document.createElement("span");
    usernameDisplay.classList.add("nav-link");
  
    if (isAuthenticated()) {
        const savedUsername = localStorage.getItem("username");
        if (savedUsername) {
            usernameDisplay.textContent = `Hola, ${savedUsername}`;
            document.querySelector(".navbar-nav").appendChild(usernameDisplay);
        }
    }
  }); 
   // Verificar si el usuario está autenticado
   if (!isAuthenticated()) {
    // Si no estamos autenticados, redirigimos al formulario de inicio de sesión
    window.location.href = "login.html";
    alert("Debe ingresar para poder continuar");
  }
