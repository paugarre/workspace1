const DATA_URL = "https://japceibal.github.io/emercado-api/cats_products/101.json"; 

const container = document.getElementByClassName("container"); 

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

/* arreglar


