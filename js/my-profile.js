// Verificar si los datos ya están almacendos en el almacenamiento local
document.addEventListener("DOMContentLoaded", function () {
    const userProfileForm = document.getElementById("user-profile-form");
    const nombreInput = document.getElementById("nombre");
    const segundoNombreInput = document.getElementById("segundo-nombre");
    const apellidoInput = document.getElementById("apellido");
    const segundoApellidoInput = document.getElementById("segundo-apellido");
    const usernameInput = document.getElementById("username");
    const telefonoInput = document.getElementById("telefono");
  
    // Comprueba si los datos ya están en el almacenamiento local
    if (localStorage.getItem("userProfile")) {
      const userProfileData = JSON.parse(localStorage.getItem("userProfile"));
      nombreInput.value = userProfileData.nombre;
      segundoNombreInput.value = userProfileData.segundoNombre;
      apellidoInput.value = userProfileData.apellido;
      segundoApellidoInput.value = userProfileData.segundoApellido;
      usernameInput.value = userProfileData.username;
      telefonoInput.value = userProfileData.telefono;
    }
  
    // Manejar la validación y el evento de guardar cambios
    userProfileForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      // Valida campos obligatorios
      if (!nombreInput.value || !apellidoInput.value) {
        alert("Los campos Nombre y Apellido son obligatorios");
        return;
      }
  
      // Guarda los datos en el almacenamiento local
      const userProfileData = {
        nombre: nombreInput.value,
        segundoNombre: segundoNombreInput.value,
        apellido: apellidoInput.value,
        segundoApellido: segundoApellidoInput.value,
        username: usernameInput.value,
        telefono: telefonoInput.value,
      };
  
      localStorage.setItem("userProfile", JSON.stringify(userProfileData));
      alert("Datos guardados en el almacenamiento local.");
    });
  });
  