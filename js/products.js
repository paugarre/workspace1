const productosDiv = document.getElementById("listaDeAutos");
document.addEventListener('DOMContentLoaded', function() {
  const carsData = "https://japceibal.github.io/emercado-api/cats_products/101.json"; 

  fetch(carsData)
    .then(response => response.json())
    .then(data => {
      data.products.forEach(products => {
        productosDiv.innerHTML += `
          <div class="row list-group-item d-flex justify-content-between">
            <div class="col-3">
              <img src="${products.image}" alt="${products.name}" class="img-thumbnail">
            </div>
            <div class="col-7">
              <h3>${products.name} - ${products.currency} ${products.cost}</h3>
              <p>${products.description}</p>
            </div>
            <div class="col-2">
              <small>
                ${products.soldCount} vendidos
              </small>
            </div>
          </div>`;
      });

    })
    .catch(error => {
      console.error('Error:', error);
    });
});

function isAuthenticated() {
  return localStorage.getItem("authenticated") === "true";
}

document.addEventListener("DOMContentLoaded", function() {  
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

