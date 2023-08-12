function authenticate() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
  
    if (username === "" || password === "") {
      alert("Por favor, completa ambos campos.");
    } else {
      window.location.href = "index.html";
    }
  }
  