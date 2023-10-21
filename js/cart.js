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

    totalCell.textContent = ` ${totalCost}`;

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
      let newTotal = "";
      const subtotalCells = document.querySelectorAll("td[subtotal]");
      subtotalCells.forEach(subtotalCell => {
        newTotal += parseFloat(subtotalCell.textContent);
      });
      totalCell.textContent = ` ${newTotal}`;
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

// Agregar un controlador de eventos para el cambio de elementos de radio
const paymentMethodRadios = document.querySelectorAll("input[name='paymentMethod']");
const paymentMethodLabel = document.getElementById("paymentMethodLabel");

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
  // Realiza todas las validaciones antes de confirmar la compra

  // Validación de campos de dirección
  const street = document.getElementById("street").value;
  const number = document.getElementById("number").value;
  const corner = document.getElementById("corner").value;
  
  if (street.trim() === "" || number.trim() === "" || corner.trim() === "") {
    toggleErrorMessage(document.getElementById("street-error"), "Ingresa una calle.");
    toggleErrorMessage(document.getElementById("number-error"), "Ingresa un número.");
    toggleErrorMessage(document.getElementById("corner-error"), "Ingresa una esquina.");
    return;
  } else {
  // Ocultar el mensaje de error
    toggleErrorMessage(document.getElementById("street-error"), null);
    toggleErrorMessage(document.getElementById("number-error"), null);
    toggleErrorMessage(document.getElementById("corner-error"), null);
  }

  // Validación de forma de envío
  const selectedShippingMethod = document.querySelector("input[name='shipping']:checked");
  if (!selectedShippingMethod) {
    alert("Debes seleccionar una forma de envío.");
    return;
  }

  // Validación de cantidad para cada artículo
  const quantityInputs = document.querySelectorAll("input[type='number']");
  for (const input of quantityInputs) {
    const quantity = parseInt(input.value);
    if (isNaN(quantity) || quantity <= 0) {
      alert("La cantidad para cada artículo debe ser mayor a 0.");
      return;
    }
  }

   // Validación de forma de pago
   const selectedPaymentMethod = document.querySelector("input[name='paymentMethod']:checked");
   if (!selectedPaymentMethod) {
     alert("Debes seleccionar una forma de pago.");
     return;
   }
 
   // Validación de campos para la forma de pago seleccionada
   const creditCardNumber = document.getElementById("creditCardNumber");
   const creditCardCode = document.getElementById("creditCardCode");
   const creditCardExpiry = document.getElementById("creditCardExpiry");
   const bankAccount = document.getElementById("bankAccount");
 
   if (selectedPaymentMethod.value === "creditCard" && (creditCardNumber.value.trim() === "" || creditCardCode.value.trim() === "" || creditCardExpiry.value.trim() === "")) {
    toggleErrorMessage(document.getElementById("number-card"), "Ingresa el número de la tarjeta.")
    toggleErrorMessage(document.getElementById("card-code"), "Ingresa el codigo de la tarjeta.")
    toggleErrorMessage(document.getElementById("card-expiry"), "Ingresa la fecha de vencimiento.")
     return;}
     else {
      // Ocultar el mensaje de error
        toggleErrorMessage(document.getElementById("number-card"), null);
        toggleErrorMessage(document.getElementById("card-code"), null);
        toggleErrorMessage(document.getElementById("card-expiry"), null);
      }

   if (selectedPaymentMethod.value === "bankTransfer" && bankAccount.value.trim() === "") {
    toggleErrorMessage(document.getElementById("number-account"), "Ingresa el número de la cuenta bancaria.")
     return;
   }
   else {
    // Ocultar el mensaje de error
      toggleErrorMessage(document.getElementById("number-account"), null);
    }
  // Si todas las validaciones pasaron, puedes continuar con la confirmación de compra
  const selectedPaymentMethodValue = selectedPaymentMethod.value;
  const selectedShippingMethodValue = selectedShippingMethod.value;

  // Después de confirmar la compra exitosamente, muestra el mensaje de confirmación
  const confirmationMessage = document.getElementById("confirmation-message");
  confirmationMessage.style.display = "block";
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