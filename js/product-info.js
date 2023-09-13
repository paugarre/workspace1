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
      <p>Categoría: ${productDetails.category}</p>
      <p>Cantidad vendida: ${productDetails.soldCount}</p>
    `;

    const productImagesContainer = document.getElementById('productImages');
    productImagesContainer.innerHTML = '';
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
        }
      };

      // Evento de clic para hacer zoom y restaurar el tamaño original
      imageElement.addEventListener('click', handleClick);

      // Agregar la imagen al contenedor de imágenes
      imageContainer.appendChild(imageElement);

      // Agregar el contenedor de imagen al contenedor de imágenes principal
      productImagesContainer.appendChild(imageContainer);
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
      const savedUsername = localStorage.getItem("username");
      const commentRating = document.getElementById('commentRating').value;
      const commentDescription = document.getElementById('commentDescription').value;

      // Validar que los campos no estén vacíos
      if (!commentRating || !commentDescription) {
        alert('Por favor, complete todos los campos del comentario.');
        return;
      }

      //Limitar los valores posibles de puntuación entre 1 y  5.
      if(commentRating < 0 || commentRating > 5){
        alert("Por favor, seleccione un valor entre 1 y 5 en el campo de puntuación.");
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
