  // Función para mostrar u ocultar mensajes de error
  function toggleErrorMessage(errorElement, message) {
    if (message) {
      errorElement.textContent = message;
      errorElement.style.display = "block";
    } else {
      errorElement.textContent = "";
      errorElement.style.display = "none";
    }
  }

  function cargarDatosGuardados() {
    var userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      document.getElementById("nombre").value = userData.nombre;
      document.getElementById("apellido").value = userData.apellido;
      document.getElementById("segundo-nombre").value = userData["segundo-nombre"];
      document.getElementById("segundo-apellido").value = userData["segundo-apellido"];
      document.getElementById("telefono").value = userData.telefono;
    }
  }
  
  document.getElementById("guardar-button").addEventListener("click", function () {
    var nombre = document.getElementById("nombre").value;
    var apellido = document.getElementById("apellido").value;
    var segundoNombre = document.getElementById("segundo-nombre").value;
    var segundoApellido = document.getElementById("segundo-apellido").value;
    var telefono = document.getElementById("telefono").value;
    
    var errorElement = document.getElementById("error-message");
  
    if (!nombre || !apellido) {
      toggleErrorMessage(errorElement, "Los campos obligatorios deben completarse.");
    } else {
      var userData = {
        nombre: nombre,
        apellido: apellido,
        "segundo-nombre": segundoNombre,
        "segundo-apellido": segundoApellido,
        telefono: telefono,
      };
      localStorage.setItem("userData", JSON.stringify(userData));
      toggleErrorMessage(errorElement, "");
    }
  });
  
  cargarDatosGuardados();