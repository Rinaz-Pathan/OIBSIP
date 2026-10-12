const loginForm = document.getElementById('login-form');
const message = document.getElementById('message');

// If already logged in, go straight to the dashboard
if (getLoggedInUser()) {
  window.location.replace('dashboard.html');
}

loginForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;

  if (email === '' || password === '') {
    showMessage(message, 'Please enter both email and password.', 'error');
    return;
  }

  // Same message for every failure, so nobody can tell which part was wrong
  const genericError = 'Invalid email or password.';

  const user = findUserByEmail(email);
  if (!user) {
    showMessage(message, genericError, 'error');
    return;
  }

  const hash = await hashPassword(password, user.salt);
  if (hash !== user.passwordHash) {
    showMessage(message, genericError, 'error');
    return;
  }

  // Success: remember the user and open the dashboard
  setLoggedInUser(user.email);
  window.location.href = 'dashboard.html';
});