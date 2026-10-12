// Runs immediately: if nobody is logged in, send them to the login page
const currentUser = getLoggedInUser();

if (!currentUser) {
  window.location.replace('index.html');
}

// Fill in the page once it has loaded
document.addEventListener('DOMContentLoaded', function () {
  if (!currentUser) {
    return;
  }

  document.getElementById('welcome').textContent = 'Hello, ' + currentUser.name + '!';
  document.getElementById('avatar').textContent = currentUser.name.charAt(0).toUpperCase();
  document.getElementById('user-email').textContent = currentUser.email;
  document.getElementById('user-since').textContent = currentUser.createdAt;

  document.getElementById('logout-btn').addEventListener('click', function () {
    logout();
    window.location.href = 'index.html';
  });
});