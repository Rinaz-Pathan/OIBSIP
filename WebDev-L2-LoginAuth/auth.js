// ----- Users are stored as a list in localStorage -----
function getUsers() {
  const saved = localStorage.getItem('users');
  return saved ? JSON.parse(saved) : [];
}

function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

function findUserByEmail(email) {
  const cleanEmail = email.trim().toLowerCase();
  return getUsers().find(function (user) {
    return user.email === cleanEmail;
  });
}

// ----- Password hashing (SHA-256 with a random salt) -----
function generateSalt() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes).map(function (b) {
    return b.toString(16).padStart(2, '0');
  }).join('');
}

async function hashPassword(password, salt) {
  const data = new TextEncoder().encode(salt + password);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer)).map(function (b) {
    return b.toString(16).padStart(2, '0');
  }).join('');
}

// ----- Session: remember who is logged in -----
function setLoggedInUser(email) {
  localStorage.setItem('loggedInUser', email);
}

function getLoggedInUser() {
  const email = localStorage.getItem('loggedInUser');
  if (!email) {
    return null;
  }
  return findUserByEmail(email) || null;
}

function logout() {
  localStorage.removeItem('loggedInUser');
}

// ----- Show a message under the form -----
function showMessage(element, text, type) {
  element.textContent = text;
  element.className = 'message ' + type;
}