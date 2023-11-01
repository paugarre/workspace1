// Verificar si los datos ya están almacenados en el almacenamiento local
document.addEventListener("DOMContentLoaded", function () {
  const userProfileForm = document.getElementById("user-profile-form");
  const nombreInput = document.getElementById("nombre");
  const segundoNombreInput = document.getElementById("segundo-nombre");
  const apellidoInput = document.getElementById("apellido");
  const segundoApellidoInput = document.getElementById("segundo-apellido");
  const usernameInput = document.getElementById("username");
  const telefonoInput = document.getElementById("telefono");
  const profileImage = document.getElementById('profileImage');

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

  // Verifica si la imagen de perfil está en el almacenamiento local
  if (localStorage.getItem('userProfileImage')) {
    profileImage.src = localStorage.getItem('userProfileImage');
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

    // Guardar la imagen de perfil si está presente
    if (profileImage.src !== '' && profileImage.src !== 'img/img_perfil.png') {
      localStorage.setItem('userProfileImage', profileImage.src);
    } else {
      localStorage.removeItem('userProfileImage'); // Si no hay imagen, eliminar del almacenamiento local
    }

    alert("Datos y/o imagen guardados en el almacenamiento local.");
  });

  // Agregar manejo de cambio de imagen de perfil
  const fileInput = document.getElementById("fileInput");
  fileInput.addEventListener("change", function () {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      profileImage.src = e.target.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  });
});
