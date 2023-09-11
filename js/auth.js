function isAuthenticated() {
    return localStorage.getItem("authenticated") === "true";
  }
  
  document.addEventListener("DOMContentLoaded", function() {
    const usernameDisplay = document.createElement("span");
    usernameDisplay.classList.add("nav-link");
  
    if (isAuthenticated()) {
        const savedUsername = localStorage.getItem("username");
        if (savedUsername) {
            usernameDisplay.textContent = `${savedUsername}`;
            document.querySelector(".navbar-nav").appendChild(usernameDisplay);
        }
    }
  }); //aca se repite la misma funcion para que aparezca en categories.html el nombre de usuario