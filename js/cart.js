const apiUrl = "https://japceibal.github.io/emercado-api/user_cart/25801.json";

function convertUYUtoUSD(amount, currency) {
  if (currency === "UYU") {
    return amount / 40;
  } else {
    return amount;
  }
}

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
      quantityInput.min = 1;
      quantityInput.addEventListener("input", (e) => {
        updateSubtotal(article.unitCost, e.target.value === '' ? 1 : parseInt(quantityInput.value), subtotalCell);
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

      row.appendChild(imageCell);
      row.appendChild(nameCell);
      row.appendChild(costCell);
      row.appendChild(quantityCell);
      row.appendChild(currencyCell);
      row.appendChild(subtotalCell);

      tableBody.appendChild(row);

      // Agregar un botón de eliminación
      const deleteButtonCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.classList.add("btn", "btn-outline-danger"); // Agrega clases de Bootstrap

      const iconSvg = document.createElement("svg");
      iconSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      iconSvg.setAttribute("width", "16");
      iconSvg.setAttribute("height", "16");
      iconSvg.setAttribute("fill", "currentColor");
      iconSvg.setAttribute("class", "bi bi-trash");
      iconSvg.setAttribute("viewBox", "0 0 16 16");

      const path1 = document.createElement("path");
      path1.setAttribute("d", "M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Z");

      const path2 = document.createElement("path");
      path2.setAttribute("d", "M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z");

      iconSvg.appendChild(path1);
      iconSvg.appendChild(path2);

      deleteButton.appendChild(iconSvg);
      deleteButton.innerHTML += " Eliminar";

      deleteButton.addEventListener("click", () => {
        // Elimina el artículo y la fila de la tabla
        tableBody.removeChild(row);
        // Actualiza el total
        updateTotal();
      });

      deleteButtonCell.appendChild(deleteButton);
      row.appendChild(deleteButtonCell);

      tableBody.appendChild(row);


    });
    // Obtén la referencia a la tabla donde deseas mostrar los productos en cart.html
    const cartTableBody = document.getElementById("product-table-body");

    // Recupera los IDs de productos del localStorage
    const cartProductIds = JSON.parse(localStorage.getItem("cartProductIds")) || [];
    const groupedProductsId = {};
    cartProductIds.forEach((productId) => {
      if (groupedProductsId[productId]) {
        groupedProductsId[productId] += 1;
      } else {
        groupedProductsId[productId] = 1;
      }
    });

    // Itera a través de los IDs de productos y agrega filas a la tabla
    Object.keys(groupedProductsId).forEach(productId => {
      // Realiza una solicitud AJAX para obtener los detalles del producto y su cantidad
      fetch(`https://japceibal.github.io/emercado-api/products/${productId}.json`)
        .then(response => {
          if (!response.ok) {
            throw new Error('No se pudo obtener los detalles del producto');
          }
          return response.json();
        })
        .then(product => {

          // Aplica la conversión de moneda a USD si es necesario
          const convertedCost = convertToUSD(product.cost, product.currency);

          const newRow = document.createElement("tr");


          const imageCell = document.createElement("td");
          imageCell.innerHTML = `<img src="${product.images[0]}" alt="${product.name}" width="50">`;

          const nameCell = document.createElement("td");
          nameCell.textContent = product.name;

          const costCell = document.createElement("td");
          costCell.textContent = convertUYUtoUSD(product.cost, product.currency).toFixed(2);

          const quantityCell = document.createElement("td");
          const quantityInput = document.createElement("input");
          quantityInput.type = "number";

          // Establece que el valor de la cantidad no sea menor a 1, y si el input está vacío que se mantenga con el precio de una unidad
          quantityInput.value = groupedProductsId[productId];
          quantityInput.min = 1;
          quantityInput.addEventListener("input", (e) => {
            // Actualiza el subtotal utilizando la cantidad del producto actual y NO permite escribir ni letras ni números negativos en el input (en caso de querer poner -4 la cantidad que se verá reflejada será siempre 1, lo mismo con cualquier otro caracter)
            if (isNaN(parseInt(quantityInput.value)) || parseInt(quantityInput.value) < 1) {
              quantityInput.value = 1;
            }
            updateSubtotal(convertUYUtoUSD(product.cost, product.currency), e.target.value === '' ? 1 : parseInt(quantityInput.value), subtotalCell);
            updateTotal();
          });

          quantityCell.appendChild(quantityInput);

          const currencyCell = document.createElement("td");
          currencyCell.textContent = "USD";

          const subtotalCell = document.createElement("td");
          // Agregar la clase "subtotal" a las celdas de subtotal
          subtotalCell.classList.add("subtotal");

          newRow.appendChild(imageCell);
          newRow.appendChild(nameCell);
          newRow.appendChild(costCell);
          newRow.appendChild(quantityCell);
          newRow.appendChild(currencyCell);
          newRow.appendChild(subtotalCell);

          tableBody.appendChild(newRow);
          updateSubtotal(convertUYUtoUSD(product.cost, product.currency), parseInt(quantityInput.value), subtotalCell);

          // Agregar un botón de eliminación
          const deleteButtonCell = document.createElement("td");
          const deleteButton = document.createElement("button");
          deleteButton.type = "button";
          deleteButton.classList.add("btn", "btn-outline-danger"); // Agrega clases de Bootstrap

          const iconSvg = document.createElement("svg");
          iconSvg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
          iconSvg.setAttribute("width", "16");
          iconSvg.setAttribute("height", "16");
          iconSvg.setAttribute("fill", "currentColor");
          iconSvg.setAttribute("class", "bi bi-trash");
          iconSvg.setAttribute("viewBox", "0 0 16 16");

          const path1 = document.createElement("path");
          path1.setAttribute("d", "M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Z");

          const path2 = document.createElement("path");
          path2.setAttribute("d", "M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z");

          iconSvg.appendChild(path1);
          iconSvg.appendChild(path2);

          deleteButton.appendChild(iconSvg);
          deleteButton.innerHTML += " Eliminar";

          deleteButton.addEventListener("click", () => {
            // Elimina el artículo y la fila de la tabla
            tableBody.removeChild(newRow);
            // Actualiza el total
            updateTotal();
          });

          deleteButtonCell.appendChild(deleteButton);
          newRow.appendChild(deleteButtonCell);

          tableBody.appendChild(newRow);
        })

        .catch(error => {
          console.error('Error al obtener los detalles del producto:', error);
        });
    });

    //funcion para convertir de Uyu a usd
    function convertToUSD(amount, currency) {
      if (currency === "UYU") {
        // Dividir la cantidad en UYU por el tipo de cambio (40)
        return amount / 40;
      } else {
        // Si la moneda no es UYU, devolver la cantidad sin cambios
        return amount;
      }
    }
    // Función para actualizar el subtotal de un producto
    function updateSubtotal(cost, count, subtotalCell) {
      if (count >= 0) {
        const subtotal = cost * count;
        // Actualiza el subtotal en la celda correspondiente
        subtotalCell.textContent = subtotal.toFixed(2);
        // Actualiza el total
        updateTotal();
      }
    }

    function updateTotal() {
      const subtotalCells = document.querySelectorAll("td.subtotal");
      let newTotal = 0;

      subtotalCells.forEach(subtotalCell => {
        newTotal += parseFloat(subtotalCell.textContent);
      });

      totalCell.textContent = ` ${newTotal.toFixed(2)}`;
      updateValues(); // Actualiza los valores de subtotal, costo de envío y total
    }
  });
// Función para calcular el subtotal general
function calculateSubtotalGeneral() {
  const subtotalCells = document.querySelectorAll("td.subtotal");
  let subtotalGeneral = 0;
  subtotalCells.forEach(subtotalCell => {
    subtotalGeneral += parseFloat(subtotalCell.textContent);
  });
  subtotalGeneral = subtotalGeneral.toFixed(2);
  return parseFloat(subtotalGeneral);
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

// Agregar un controlador de eventos para el cambio de elementos de radio
creditCardRadio.addEventListener('change', handlePaymentMethodChange);
bankTransferRadio.addEventListener('change', handlePaymentMethodChange);

handlePaymentMethodChange();


paymentMethodRadios.forEach(radio => {
  radio.addEventListener("change", (e) => {
    const selectedPaymentMethod = e.target.value;
    paymentMethodLabel.textContent = `Forma de Pago: ${selectedPaymentMethod}`;
  });
});

// Obtén una referencia al botón de confirmación de compra
const confirmPurchaseButton = document.getElementById("confirmPurchaseButton");

// Agrega un controlador de eventos para el clic en el botón
confirmPurchaseButton.addEventListener("click", () => {
  // Crea una variable para mantener un seguimiento de si hay errores
  let hasErrors = false;

  // Validación de campos de dirección
  const street = document.getElementById("street").value;
  const number = document.getElementById("number").value;
  const corner = document.getElementById("corner").value;

  if (street.trim() === "") {
    hasErrors = true;
    toggleErrorMessage(document.getElementById("street-error"), "Ingresa una calle.");
  } else {
    toggleErrorMessage(document.getElementById("street-error"), null);
  }

  if (number.trim() === "") {
    hasErrors = true;
    toggleErrorMessage(document.getElementById("number-error"), "Ingresa un número.");
  } else {
    toggleErrorMessage(document.getElementById("number-error"), null);
  }

  if (corner.trim() === "") {
    hasErrors = true;
    toggleErrorMessage(document.getElementById("corner-error"), "Ingresa una esquina.");
  } else {
    toggleErrorMessage(document.getElementById("corner-error"), null);
  }

  // Validación de forma de envío
  const selectedShippingMethod = document.querySelector("input[name='shipping']:checked");
  if (!selectedShippingMethod) {
    hasErrors = true;
    toggleErrorMessage(document.getElementById("shipping-error"), "Debes seleccionar una forma de envío.");
  } else {
    toggleErrorMessage(document.getElementById("shipping-error"), null);
  }

  // Validación de cantidad para cada artículo
  const quantityInputs = document.querySelectorAll("input[type='number']");
  for (const input of quantityInputs) {
    const quantity = parseInt(input.value);
    if (isNaN(quantity) || quantity <= 0) {
      hasErrors = true;
      alert("La cantidad para cada artículo debe ser mayor a 0.");
      break; // Sal del bucle en caso de un error
    }
  }

  // Validación de forma de pago
  const selectedPaymentMethod = document.querySelector("input[name='paymentMethod']:checked");
  if (!selectedPaymentMethod) {
    hasErrors = true;
    toggleErrorMessage(document.getElementById("payment-error"), "Debes seleccionar una forma de pago.");
  } else {
    toggleErrorMessage(document.getElementById("payment-error"), null);
  }

  if (hasErrors) {
    // Si hay errores, no continúes con la compra
    return;
  }

  // Si no hay errores, puedes continuar con la confirmación de compra
  const selectedPaymentMethodValue = selectedPaymentMethod.value;
  const selectedShippingMethodValue = selectedShippingMethod.value;

  // Después de confirmar la compra exitosamente, muestra el mensaje de confirmación
  const confirmationMessage = document.getElementById("confirmation-message");
  confirmationMessage.style.display = "block";

  // aqui se establece un temporizador para ocultar el mensaje después de 3 segundos
  setTimeout(function () {
    confirmationMessage.style.display = "none";
  }, 3000); // 3000 milisegundos (3 segundos)
});


function toggleErrorMessage(errorElement, message) {
  if (message) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  } else {
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }
}

