const productosDiv = document.getElementById("listaDeAutos");
const searchInput = document.getElementById('searchInput');
const clearRangeFilterButton = document.getElementById('clearRangeFilterButton');
const sortAscButton = document.getElementById('sortAsc');
const sortDescButton = document.getElementById('sortDesc');
const sortByCountButton = document.getElementById('sortByCount');

document.addEventListener('DOMContentLoaded', () => {
  
 
  const catID = localStorage.getItem("catID");
  const productsData = `https://japceibal.github.io/emercado-api/cats_products/${catID}.json`;

  const fetchProducts = async () => {
    try {
      const response = await fetch(productsData);
      const data = await response.json();
      const productos = data.products;

      const mostrarProductos = productosMostrados => {
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
              <small>${producto.soldCount} vendidos</small>
            </div>`;
            // Agregamos el atributo onclick al div del producto
             productoElement.onclick = function () {
             // Obtenemos el ID del producto desde el atributo personalizado
             const productoId = producto.id;
             // Redirigir a la página con los detalles, pasando el ID como parámetro
               window.location.href = `product-info.html?id=${productoId}`;
               };

              // Agregar el atributo personalizado 'data-id' al div con el ID del producto
                productoElement.setAttribute('data-id', producto.id);

          productosDiv.appendChild(productoElement);
        });
      };
      
      
    
      const filtrarProductos = terminoBusqueda =>
        productos.filter(producto =>
          producto.name.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
          producto.description.toLowerCase().includes(terminoBusqueda.toLowerCase())
        );

      const ordenarPorPrecio = (ascendente = true) =>
        productos.sort((a, b) => (ascendente ? a.cost - b.cost : b.cost - a.cost));

      const ordenarPorCantidadDesc = () =>
        productos.sort((a, b) => b.soldCount - a.soldCount);

      searchInput.addEventListener('input', event => {
        const terminoBusqueda = event.target.value;
        mostrarProductos(filtrarProductos(terminoBusqueda));
      });
      //Filtro por rangos
      filtroRangoButton.addEventListener('click', () => {
        const minPrice = minPriceInput.value;
        const maxPrice = maxPriceInput.value;
      
        const productosFiltradosPorRango = filtrarPorRango(productos, minPrice, maxPrice);
        mostrarProductos(productosFiltradosPorRango);
      });
      
       const filtrarPorRango = (productos, minPrice, maxPrice) => {
        return productos.filter(producto => {
            if (minPrice && maxPrice) {
                // Filtrar por ambos precios
                return producto.cost >= minPrice && producto.cost <= maxPrice;
            } else if (minPrice) {
                // Filtrar solo por precio mínimo
                return producto.cost >= minPrice;
            } else if (maxPrice) {
                // Filtrar solo por precio máximo
                return producto.cost <= maxPrice;
            }
            // Si no se proporciona ni precio mínimo ni máximo, no se filtra nada.
            return true;
        });
    };

      sortAscButton.addEventListener('click', () => {
        ordenarPorPrecio();
        mostrarProductos(productos);
      });

      sortDescButton.addEventListener('click', () => {
        ordenarPorPrecio(false);
        mostrarProductos(productos);
      });

      sortByCountButton.addEventListener('click', () => {
        ordenarPorCantidadDesc();
        mostrarProductos(productos);
      });

      clearRangeFilterButton.addEventListener('click', () => {
        searchInput.value = '';
        maxPriceInput.value = '';
        minPriceInput.value = '';
        mostrarProductos(productos);
      });

      mostrarProductos(productos);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  fetchProducts();
});
