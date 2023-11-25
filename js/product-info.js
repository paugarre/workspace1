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
      <div class="card mb-3">
        <div class="card-body">
          <h2 class="card-title">${productDetails.name}</h2>
          <hr>
          <p class="card-text"><strong>Precio:</strong> ${productDetails.currency} ${productDetails.cost}</p>
          <p class="card-text"><strong>Descripción:</strong> ${productDetails.description}</p>
          <p class="card-text"><strong>Categoría:</strong> ${productDetails.category}</p>
          <p class="card-text"><strong>Cantidad vendida:</strong> ${productDetails.soldCount}</p>
        </div>
      </div>
    `;

    const productImagesContainer = document.getElementById('productImages');
    productImagesContainer.className = 'carousel slide'; // Asegurarse de que el contenedor tiene las clases de carrusel de Bootstrap
    productImagesContainer.setAttribute('data-bs-ride', 'carousel');
    productImagesContainer.innerHTML = '';

    const carouselIndicators = document.createElement('ol');
    carouselIndicators.className = 'carousel-indicators';

    const carouselInner = document.createElement('div');
    carouselInner.className = 'carousel-inner';

    productDetails.images.forEach((imageSrc, index) => {
      const carouselItem = document.createElement('div');
      carouselItem.className = `carousel-item ${index === 0 ? 'active' : ''}`;
      carouselItem.innerHTML = `<img src="${imageSrc}" class="d-block w-100" alt="${productDetails.name}">`;
      carouselInner.appendChild(carouselItem);

      const indicator = document.createElement('li');
      indicator.setAttribute('data-bs-target', '#productImages');
      indicator.setAttribute('data-bs-slide-to', index.toString());
      if (index === 0) {
        indicator.classList.add('active');
      }
      carouselIndicators.appendChild(indicator);
    });

    productImagesContainer.appendChild(carouselIndicators);
    productImagesContainer.appendChild(carouselInner);

    // Agregar controles de carrusel si es necesario
    // ...

    // Configurar el carrusel utilizando Bootstrap
    new bootstrap.Carousel(productImagesContainer);

    // Agregar productos relacionados
    const prodRel = document.getElementById('productosRelacionados');
    prodRel.className = 'row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3'; // Grilla con 1, 2 o 3 columnas dependiendo del tamaño de la pantalla
    prodRel.innerHTML = '';

    productDetails.relatedProducts.forEach((proR) => {
      const prodRelacionado = document.createElement('div');
      prodRelacionado.className = 'col'; // Cada producto ocupará el espacio de una columna

      const card = document.createElement('div');
      card.className = 'card h-100'; // Clase card de Bootstrap para la altura completa

      const cardBody = document.createElement('div');
      cardBody.className = 'card-body d-flex flex-column'; // Clase card-body y flex para distribución del espacio

      const botonProd = document.createElement('button');
      botonProd.className = 'btn btn-outline-primary w-100 mb-2'; // Clases de botón de Bootstrap
      botonProd.onclick = () => {
        window.location.href = `product-info.html?id=${proR.id}`;
      };

      const ProdR = document.createElement('img');
      ProdR.className = 'card-img-top img-fluid'; // Clase para imágenes de tarjeta y responsivas
      ProdR.src = proR.image;
      ProdR.alt = proR.name;

      const nombreProdR = document.createElement('h5');
      nombreProdR.className = 'card-title'; // Clase para el título de la tarjeta
      nombreProdR.textContent = proR.name;

      cardBody.appendChild(nombreProdR);
      card.appendChild(ProdR);
      card.appendChild(cardBody);
      botonProd.appendChild(card);
      prodRelacionado.appendChild(botonProd);
      prodRel.appendChild(prodRelacionado);
    });

  } catch (error) {
    console.error('Error:', error);
  }
}


// Función para cargar los comentarios del producto desde la API
async function fetchProductComments(productId) {
  const commentsDataUrl = `https://japceibal.github.io/emercado-api/products_comments/${productId}.json`;

  try {
    const commentsResponse = await fetch(commentsDataUrl);
    const comments = await commentsResponse.json();

    // Mostrar los comentarios en la página
    const commentsContainer = document.getElementById('commentsContainer');
    commentsContainer.innerHTML = '';

    // Agregar un título para los comentarios
    const commentsTitle = document.createElement('h3');
    commentsTitle.textContent = 'Comentarios de los usuarios';
    commentsContainer.appendChild(commentsTitle);

    comments.forEach((comment) => {
      // Crear un contenedor para cada comentario
      const commentContainer = document.createElement('div');
      commentContainer.className = 'comment-container'; // Agregar una clase para aplicar estilos

      // Crear un elemento para mostrar la puntuación con estrellas
      const ratingStarsContainer = document.createElement('div');
      ratingStarsContainer.className = 'rating-stars';

      // Crear estrellas en función de la puntuación (aquí se pueden agregar más estilos)
      for (let i = 0; i < comment.score; i++) {
        const starIcon = document.createElement('i');
        starIcon.className = 'fas fa-star'; // Clase de FontAwesome para una estrella llena
        starIcon.style.color = 'gold'; // Cambiar el color de las estrellas a dorado
        ratingStarsContainer.appendChild(starIcon);
      }

      commentContainer.appendChild(ratingStarsContainer);

      // Mostrar el usuario y la fecha del comentario
      const commentInfo = document.createElement('p');
      commentInfo.textContent = `Usuario: ${comment.user}, Fecha: ${comment.dateTime}`;
      commentContainer.appendChild(commentInfo);

      // Mostrar el contenido del comentario
      const commentContent = document.createElement('p');
      commentContent.textContent = `Comentario: ${comment.description}`;
      commentContainer.appendChild(commentContent);

      // Agregar el contenedor de comentario al contenedor de comentarios principal
      commentsContainer.appendChild(commentContainer);
    });
  } catch (error) {
    console.error('Error:', error);
  }
}

// Evento de carga de la página
document.addEventListener('DOMContentLoaded', () => {
  // Obtener el ID del producto de la URL
  const productId = getProductIdFromURL();

  if (productId) {
    // Cargar los detalles del producto
    fetchProductDetails(productId);

    // Cargar los comentarios del producto
    fetchProductComments(productId);

    // Agregar un evento de clic al botón "Enviar Comentario"
    const submitCommentButton = document.getElementById('submitComment');
    submitCommentButton.addEventListener('click', () => {
      // Obtener los valores del nuevo comentario
      const savedUsername = localStorage.getItem('username');
      const commentRating = document.getElementById('commentRating').value;
      const commentDescription = document.getElementById('commentDescription').value;

      // Validar que los campos no estén vacíos
      if (!commentRating || !commentDescription) {
        alert('Por favor, complete todos los campos del comentario.');
        return;
      }

      // Limitar los valores posibles de puntuación entre 1 y 5.
      if (commentRating < 0 || commentRating > 5) {
        alert('Por favor, seleccione un valor entre 1 y 5 en el campo de puntuación.');
        return;
      }

      // Crear un nuevo comentario
      const newComment = {
        score: parseInt(commentRating),
        user: savedUsername,
        description: commentDescription,
        dateTime: new Date().toLocaleString(),
      };

      // Agregar el nuevo comentario a la lista de comentarios y mostrarlo en la página
      const commentsContainer = document.getElementById('commentsContainer');
      const newCommentContainer = document.createElement('div');
      newCommentContainer.className = 'comment-container';

      // Crear un elemento para mostrar la puntuación con estrellas del nuevo comentario
      const newCommentRatingStarsContainer = document.createElement('div');
      newCommentRatingStarsContainer.className = 'rating-stars';

      // Crear estrellas en función de la puntuación del nuevo comentario
      for (let i = 0; i < newComment.score; i++) {
        const starIcon = document.createElement('i');
        starIcon.className = 'fas fa-star';
        starIcon.style.color = 'gold';
        newCommentRatingStarsContainer.appendChild(starIcon);
      }

      newCommentContainer.appendChild(newCommentRatingStarsContainer);

      // Mostrar el usuario y la fecha del nuevo comentario
      const newCommentInfo = document.createElement('p');
      newCommentInfo.textContent = `Usuario: ${newComment.user}, Fecha: ${newComment.dateTime}`;
      newCommentContainer.appendChild(newCommentInfo);

      // Mostrar el contenido del nuevo comentario
      const newCommentContent = document.createElement('p');
      newCommentContent.textContent = `Comentario: ${newComment.description}`;
      newCommentContainer.appendChild(newCommentContent);

      // Agregar el contenedor del nuevo comentario al contenedor de comentarios principal
      commentsContainer.appendChild(newCommentContainer);

      // Limpiar los campos del formulario
      document.getElementById('commentRating').value = '';
      document.getElementById('commentDescription').value = '';

      // Scroll hasta el nuevo comentario
      newCommentContainer.scrollIntoView({ behavior: 'smooth' });
    });
  } else {
    console.error('ID de producto no encontrado en la URL.');
  }
});

const addToCartButton = document.getElementById("addToCart");

addToCartButton?.addEventListener("click", () => {
  const productId = getProductIdFromURL();

  if (productId) {
    // Realiza una solicitud AJAX para obtener los detalles del producto
    fetch(`https://japceibal.github.io/emercado-api/products/${productId}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error('No se pudo obtener los detalles del producto');
        }
        return response.json();
      })
      .then(product => {
        // Almacena solo el ID del producto en el almacenamiento local
        const cartProductIds = JSON.parse(localStorage.getItem("cartProductIds")) || [];
        cartProductIds.push(productId);
        localStorage.setItem("cartProductIds", JSON.stringify(cartProductIds));

        // Redirige a la página "cart.html"
        window.location.href = "cart.html";
      })
      .catch(error => {
        console.error('Error al obtener los detalles del producto:', error);
      });
  } else {
    console.log("No se pudo obtener el ID del producto de la URL.");
  }
});