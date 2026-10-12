const registerForm = document.getElementById('register-form');
const message = document.getElementById('message');

// Returns an error text, or '' if the password is fine
function validatePassword(password) {
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }
  if (!/\d/.test(password)) {
    return 'Password must contain at least 1 number.';
  }
  return '';
}

registerForm.addEventListener('submit', async function (event) {
  event.preventDefault(); // stop the page from reloading

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value;

  // 1. No empty fields
  if (name === '' || email === '' || password === '') {
    showMessage(message, 'Please fill in all fields.', 'error');
    return;
  }

  // 2. Password rules
  const passwordProblem = validatePassword(password);
  if (passwordProblem !== '') {
    showMessage(message, passwordProblem, 'error');
    return;
  }

  // 3. Duplicate email check
  if (findUserByEmail(email)) {
    showMessage(message, 'An account with this email already exists.', 'error');
    return;
  }

  // 4. Hash the password and save the new user
  const salt = generateSalt();
  const passwordHash = await hashPassword(password, salt);

  const users = getUsers();
  users.push({
    name: name,
    email: email,
    salt: salt,
    passwordHash: passwordHash,
    createdAt: new Date().toLocaleDateString()
  });
  saveUsers(users);

  showMessage(message, 'Account created! Redirecting to login...', 'success');
  setTimeout(function () {
    window.location.href = 'index.html';
  }, 1500);
});