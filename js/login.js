function authenticate() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username && password) {

    localStorage.setItem('authenticated', 'true'); 
    window.location.href = 'index.html';
  } else {
    alert('Por favor ingrese un usuario y contraseña válidos.');
  }
}

// Verificar la autenticación al cargar la página
window.addEventListener('load', function() {
  if (!isAuthenticated()) {

    window.location.href = 'login.html';
  }
});

function isAuthenticated() {
  return localStorage.getItem('authenticated') === 'true';
}

