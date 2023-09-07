// Función para obtener el valor del parámetro 'id' de la URL
function getProductIdFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Función para cargar los detalles del producto desde la API
async function fetchProductDetails(productId) {
  const productDataUrl = `https://japceibal.github.io/emercado-api/products/${productId}.json`;

  try {
      const response = await fetch(productDataUrl);
      const productDetails = await response.json();

    // Mostrar los detalles del producto en la página
      const productDetailsContainer = document.getElementById('productDetails');
      productDetailsContainer.innerHTML = `
        <br>
          <h2>${productDetails.name}</h2>
          <hr>
          <p>Precio: ${productDetails.currency} ${productDetails.cost}</p>
          <p>Descripción: ${productDetails.description}</p>
          <p>Categoria: ${productDetails.category}<p>
          <p>Cantidad vendidos: ${productDetails.soldCount}</p>
          
      `;
      const productImagesContainer = document.getElementById('productImages');
      productImagesContainer.innerHTML = '';
      productDetails.images.forEach((imageSrc) => {
        const productImagesContainer = document.getElementById('productImages');
        productImagesContainer.innerHTML = '';
        
        // Crear un título para las imágenes
        const imagesTitle = document.createElement('p');
        imagesTitle.textContent = 'Imagenes Ilustrativas';
        productImagesContainer.appendChild(imagesTitle);
        
        productDetails.images.forEach((imageSrc) => {
          // Crear un contenedor para cada imagen
          const imageContainer = document.createElement('div');
          imageContainer.className = 'image-container'; // Agregar una clase para aplicar estilos
          
          // Crear un elemento de imagen
          const imageElement = document.createElement('img');
          imageElement.src = imageSrc;
          imageElement.alt = productDetails.name;
          
          const handleClick = () => {
            if (imageElement.style.maxWidth === '100%') {
              // Si la imagen está ampliada, volver al tamaño original
              imageElement.style.maxWidth = '150px'; 
            } else {
              // Si la imagen está en tamaño original, hacer clic para ampliar
              imageElement.style.maxWidth = '100%';
            }}
            // Evento de clic para hacer zoom y restaurar el tamaño original
            imageElement.addEventListener('click', handleClick);
  
          
          // Agregar la imagen al contenedor de imágenes
          imageContainer.appendChild(imageElement);
          
          // Agregar el contenedor de imagen al contenedor de imágenes principal
          productImagesContainer.appendChild(imageContainer);
        });
      });



  } catch (error) {
      console.error('Error:', error);
  }
}

// Obtener el ID del producto de la URL y cargar los detalles
const productId = getProductIdFromURL();
if (productId) {
  fetchProductDetails(productId);
} else {
  console.error('ID de producto no encontrado en la URL.');
}


