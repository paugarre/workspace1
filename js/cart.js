// URL del carrito de compras (reemplaza '25801' por el ID de usuario correcto)
const CART_URL = "https://japceibal.github.io/emercado-api/user_cart/25801.json";

// Función para cargar los datos del carrito y mostrarlos en la página
function loadCartData() {
  const cartInfo = document.getElementById('cart-info');
  const quantityInput = document.getElementById('quantity');
  const shippingOptions = document.getElementsByName('shipping');
  const streetInput = document.getElementById('street');
  const numberInput = document.getElementById('number');
  const cornerInput = document.getElementById('corner');
  const updateSubtotalButton = document.getElementById('update-subtotal');
  const productImage = document.getElementById('product-image');
  const productName = document.getElementById('product-name');
  const productCost = document.getElementById('product-cost');
  const productCurrency = document.getElementById('product-currency');
  const subtotal = document.getElementById('subtotal');

  // Realizar la solicitud GET al carrito de compras
  getJSONData(CART_URL)
    .then(function (response) {
      if (response.status === 'ok') {
        const cartData = response.data;

        // Obtener los datos del producto del carrito
        const productData = cartData.product;
        if (productData) {
          productImage.src = productData.image;
          productName.textContent = productData.name;
          productCost.textContent = `${productData.currency} ${productData.cost.toFixed(2)}`;
          productCurrency.textContent = productData.currency;

          // Inicializar la cantidad en el input
          quantityInput.value = cartData.count;

          // Calcular y mostrar el subtotal inicial
          updateSubtotal();

          // Escuchar cambios en la cantidad para actualizar el subtotal en tiempo real
          quantityInput.addEventListener('input', updateSubtotal);
        }

        // Mostrar opciones de tipo de envío
        const shippingData = cartData.shipping;
        if (shippingData) {
          shippingOptions.forEach((option) => {
            option.disabled = false;
            option.addEventListener('change', updateSubtotal);
          });
        }

        // Mostrar dirección de envío
        const addressData = cartData.address;
        if (addressData) {
          streetInput.value = addressData.street;
          numberInput.value = addressData.number;
          cornerInput.value = addressData.corner;
        }
      }
    });
}

// Función para actualizar el subtotal
function updateSubtotal() {
  const productCost = parseFloat(document.getElementById('product-cost').textContent.replace('$', ''));
  const quantity = parseInt(document.getElementById('quantity').value);
  const shippingOptions = document.getElementsByName('shipping');
  let shippingCost = 0;

  // Calcular el costo de envío según la opción seleccionada
  shippingOptions.forEach((option) => {
    if (option.checked) {
      const shippingValue = parseFloat(option.value);
      shippingCost = shippingValue * productCost;
    }
  });

  const subtotal = document.getElementById('subtotal');
  const totalCost = productCost * quantity + shippingCost;
  subtotal.textContent = `$${totalCost.toFixed(2)}`;
}

// Cargar los datos del carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  loadCartData();
});
