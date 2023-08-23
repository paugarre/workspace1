const productosDiv = document.getElementById("listaDeAutos");
const searchInput = document.getElementById('searchInput');

document.addEventListener('DOMContentLoaded', function() {
  const catID = localStorage.getItem("catID"); // Obtener el ID de categoría almacenado
  const productsData = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

  fetch(productsData)
    .then(response => response.json())
    .then(data => {
      const productos = data.products; // Obtener los productos del JSON

      // Función para filtrar productos por nombre y descripción
      function filtrarProductos(terminoBusqueda) {
        return productos.filter(producto =>
          producto.name.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
          producto.description.toLowerCase().includes(terminoBusqueda.toLowerCase())
        );
      }

      // Función para mostrar los productos en la lista
      function mostrarProductos(productosMostrados) {
        productosDiv.innerHTML = '';

        productosMostrados.forEach(producto => {
          const productoElement = document.createElement('div');
          productoElement.className = "row list-group-item d-flex justify-content-between";
          productoElement.innerHTML = `
            <div class="col-3">
              <img src="${producto.image}" alt="${producto.name}" class="img-thumbnail">
            </div>
            <div class="col-7">
              <h3>${producto.name} - ${producto.currency} ${producto.cost}</h3>
              <p>${producto.description}</p>
            </div>
            <div class="col-2">
              <small>
                ${producto.soldCount} vendidos
              </small>
            </div>`;
          productosDiv.appendChild(productoElement);
        });
      }

      // Agregamos el evento de escucha al campo de búsqueda
      searchInput.addEventListener('input', event => {
        const terminoBusqueda = event.target.value;
        const productosFiltrados = filtrarProductos(terminoBusqueda);
        mostrarProductos(productosFiltrados);
      });

      // Mostramos los productos inicialmente
      mostrarProductos(productos);
    })
    .catch(error => {
      console.error('Error:', error);
    });
});

