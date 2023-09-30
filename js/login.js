function authenticate() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (username && password) {

    localStorage.setItem('authenticated', 'true');
    localStorage.setItem('username', username); //se guarda en el localstorage el nombre de usuario 
    window.location.href = 'index.html';
  } else {
    alert('Por favor ingrese un usuario y contraseña válidos.');
  }
}

function CerrarSesion () {
  localStorage.removeItem('username');
  window.location.href = 'login.html'
}

function isAuthenticated() {
  return localStorage.getItem('authenticated') === 'true';
}
