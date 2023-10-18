const apiUrl = "https://japceibal.github.io/emercado-api/user_cart/25801.json";

// Realizar la solicitud a la URL
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    // Acceder a la información del carrito
    const user = data.user;
    const articles = data.articles;

    // Actualizar la tabla HTML con la información del carrito
    const tableBody = document.getElementById("product-table-body");
    const totalCell = document.getElementById("total");
    let totalCost = 0;

    articles.forEach(article => {
      const row = document.createElement("tr");

      const imageCell = document.createElement("td");
      imageCell.innerHTML = `<img src="${article.image}" alt="${article.name}" width="50">`;

      const nameCell = document.createElement("td");
      nameCell.textContent = article.name;

      const costCell = document.createElement("td");
      costCell.textContent = article.unitCost;

      const quantityCell = document.createElement("td");
      const quantityInput = document.createElement("input");
      quantityInput.type = "number";
      quantityInput.value = article.count;

      // Agregar un atributo "id" al input
      quantityInput.id = `quantityInput_${article.productId}`;
      quantityInput.addEventListener("input", (e) => {
        updateSubtotal(article.unitCost, e.target.value === '' ? 0 : parseInt(quantityInput.value), subtotalCell);
        updateTotal();
      });
      quantityCell.appendChild(quantityInput);

      const currencyCell = document.createElement("td");
      currencyCell.textContent = article.currency;

      const subtotalCell = document.createElement("td");
      // Agregar la clase "subtotal" a las celdas de subtotal
      subtotalCell.classList.add("subtotal");

      // Agregar un atributo "id" al subtotalCell
      subtotalCell.id = `subtotalCell_${article.productId}`;
      updateSubtotal(article.unitCost, parseInt(quantityInput.value), subtotalCell);
      totalCost += article.unitCost * article.count;

      row.appendChild(imageCell);
      row.appendChild(nameCell);
      row.appendChild(costCell);
      row.appendChild(quantityCell);
      row.appendChild(currencyCell);
      row.appendChild(subtotalCell);

      tableBody.appendChild(row);
    });
    // Obtén la referencia a la tabla donde deseas mostrar los productos en cart.html
    const cartTableBody = document.getElementById("product-table-body");

    // Recupera los IDs de productos del localStorage
    const cartProductIds = JSON.parse(localStorage.getItem("cartProductIds")) || [];

    // Itera a través de los IDs de productos y agrega filas a la tabla
    cartProductIds.forEach(productId => {
      // Realiza una solicitud AJAX para obtener los detalles del producto
      fetch(`https://japceibal.github.io/emercado-api/products/${productId}.json`)
        .then(response => {
          if (!response.ok) {
            throw new Error('No se pudo obtener los detalles del producto');
          }
          return response.json();
        })
        .then(product => {
          const newRow = document.createElement("tr");

          const imageCell = document.createElement("td");
          imageCell.innerHTML = `<img src="${product.images[0]}" alt="${product.name}" width="50">`;

          const nameCell = document.createElement("td");
          nameCell.textContent = product.name;

          const costCell = document.createElement("td");
          costCell.textContent = product.cost;

          const quantityCell = document.createElement("td");
          const quantityInput = document.createElement("input");
          quantityInput.type = "number";

          // Establecer el valor inicial en "1"
          quantityInput.value = 1;

          quantityInput.addEventListener("input", (e) => {
            // Actualiza el subtotal utilizando la cantidad del producto actual
            updateSubtotal(product.cost, e.target.value === '' ? 0 : parseInt(quantityInput.value), subtotalCell);
            updateTotal();
          });

          quantityCell.appendChild(quantityInput);

          const currencyCell = document.createElement("td");
          currencyCell.textContent = product.currency;

          const subtotalCell = document.createElement("td");
          // Agregar la clase "subtotal" a las celdas de subtotal
          subtotalCell.classList.add("subtotal");
          updateSubtotal(product.cost, parseInt(quantityInput.value), subtotalCell);
          totalCost += product.cost * 1; // Inicialmente, la cantidad es 1

          newRow.appendChild(imageCell);
          newRow.appendChild(nameCell);
          newRow.appendChild(costCell);
          newRow.appendChild(quantityCell);
          newRow.appendChild(currencyCell);
          newRow.appendChild(subtotalCell);

          tableBody.appendChild(newRow);
        })
        .catch(error => {
          console.error('Error al obtener los detalles del producto:', error);
        });
    });

    totalCell.textContent = `Total: ${totalCost}`;

    // Función para actualizar el subtotal de un producto
    function updateSubtotal(cost, count, subtotalCell) {
      if (count >= 0) {
        const subtotal = cost * count;
        // Actualiza el subtotal en la celda correspondiente
        subtotalCell.textContent = subtotal;
        // Actualiza el total
        updateTotal();
      }
    }

    // Función para actualizar el total
    function updateTotal() {
      let newTotal = 0;
      const subtotalCells = document.querySelectorAll("td[subtotal]");
      subtotalCells.forEach(subtotalCell => {
        newTotal += parseFloat(subtotalCell.textContent);
      });
      totalCell.textContent = `Total: ${newTotal}`;
    }
  });
  // Función para calcular el subtotal general
function calculateSubtotalGeneral() {
  const subtotalCells = document.querySelectorAll("td.subtotal");
  let subtotalGeneral = 0;
  subtotalCells.forEach(subtotalCell => {
    subtotalGeneral += parseFloat(subtotalCell.textContent);
  });
  return subtotalGeneral;
}

// Función para calcular el costo de envío
function calculateShippingCost(subtotal) {
  const shippingRadioButtons = document.querySelectorAll("input[name='shipping']");
  let shippingCost = 0;

  shippingRadioButtons.forEach(radioButton => {
    if (radioButton.checked) {
      const shippingRate = parseFloat(radioButton.value);
      shippingCost = subtotal * shippingRate;
    }
  });

  return shippingCost;
}

// Función para actualizar los valores mostrados en el HTML
function updateValues() {
  const subtotalGeneral = calculateSubtotalGeneral();
  const shippingCost = calculateShippingCost(subtotalGeneral);
  const totalToPay = subtotalGeneral + shippingCost;

  const subtotalAmount = document.getElementById("subtotal-amount");
  const shippingAmount = document.getElementById("shipping-amount");
  const totalAmount = document.getElementById("total-amount");

  // Actualizar los valores en dólares
  subtotalAmount.textContent = `USD ${subtotalGeneral.toFixed(2)}`;
  shippingAmount.textContent = `USD ${shippingCost.toFixed(2)}`;
  totalAmount.textContent = `USD ${totalToPay.toFixed(2)}`;
}
// Llamar a updateValues() después de calcular los subtotales
updateValues();

// Agregar un evento para escuchar cambios en los radios de envío
const shippingRadioButtons = document.querySelectorAll("input[name='shipping']");
shippingRadioButtons.forEach(radioButton => {
  radioButton.addEventListener("change", () => {
    updateValues();
  });
});

// Función para habilitar o deshabilitar los campos según la selección
function handlePaymentMethodChange() {
  if (creditCardRadio.checked) {
    // Si se selecciona "Tarjeta de Crédito"
    bankAccount.disabled = true;
    creditCardNumber.disabled = false;
    creditCardExpiry.disabled = false;
    creditCardCode.disabled = false;
  } else if (bankTransferRadio.checked) {
    // Si se selecciona "Transferencia Bancaria"
    creditCardNumber.disabled = true;
    creditCardExpiry.disabled = true;
    creditCardCode.disabled = true;
    bankAccount.disabled = false;
  }
}

// Escucha los cambios en la selección de forma de pago
creditCardRadio.addEventListener('change', handlePaymentMethodChange);
bankTransferRadio.addEventListener('change', handlePaymentMethodChange);
