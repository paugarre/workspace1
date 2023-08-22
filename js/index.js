document.addEventListener("DOMContentLoaded", function() {
  // Verificar si el usuario está autenticado
  if (!isAuthenticated()) {
    // Si no estamos autenticados, redirigimos al formulario de inicio de sesión
    window.location.href = "login.html";
    alert("Debe ingresar para poder continuar")
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
});

// Función para verificar si el usuario está autenticado
function isAuthenticated() {
  return localStorage.getItem("authenticated") === "true";
}
document.addEventListener("DOMContentLoaded", function() { 
  const usernameDisplay = document.createElement("span"); //se crea una constante de tipo span vacia
  usernameDisplay.classList.add("nav-link"); //esto es para dale el estilo que tiene la clase nav-link al tipo span

  if (isAuthenticated()) {
      const savedUsername = localStorage.getItem("username"); //se crea la const en donde va a ir el nombre de usuario que esta guardado en el localstorage
      if (savedUsername) {
          usernameDisplay.textContent = `${savedUsername}`; //se le añade la const donde esta el nombre de usuario a la constante que va en la barra de navegacion
          document.querySelector(".navbar-nav").appendChild(usernameDisplay); //y aca se terminaria de agregar la constante tipo span con el nombre de usuario a la barra de navegacion nabvar-nav usando el apendchild
      }
  }
});