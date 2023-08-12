/*const DATA_URL = "https://japceibal.github.io/emercado-api/cats_products/101.json"; 

const container = document.getElementByClassName("container"); 

/*function showProducts(productsArray) {
  for (const product of productsArray) {
      const productDiv = document.createElement("div");
      productDiv.classList.add("product");

      const productImage = document.createElement("img");
      productImage.src = product.image;
      productDiv.appendChild(productImage);

      const productName = document.createElement("h2");
      productName.textContent = product.name;
      productDiv.appendChild(productName);

      const productDescription = document.createElement("p");
      productDescription.textContent = product.description;
      productDiv.appendChild(productDescription);

      const productPrice = document.createElement("p");
      productPrice.textContent = `Precio: ${product.price}`;
      productDiv.appendChild(productPrice);

      const productSold = document.createElement("p");
      productSold.textContent = `Vendidos: ${product.sold}`;
      productDiv.appendChild(productSold);

      container.appendChild(productDiv);
  }
}

fetch(API_URL)
  .then(response => response.json())
  .then(data => {
      const products = data.products;
      showProducts(products);
  })
  .catch(error => console.error("Error:", error));

fetch(DATA_URL)
.then(function (response) {
  return response.json();
})
.then(function (data) {
  console.log(data.students);
  showData(data.students)
})
.catch(function (error) {
  console.log(error);
});



