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



function isAuthenticated() {
  return localStorage.getItem('authenticated') === 'true';
}

