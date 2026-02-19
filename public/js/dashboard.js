// ===== SELECT ELEMENTS =====
const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');
const getUsersBtn = document.getElementById('getUsers');
const getServicesBtn = document.getElementById('getServices');
const createChildOrderForm = document.getElementById('childOrderForm');
const getOrdersBtn = document.getElementById('getOrders');
const output = document.getElementById('output');

// ===== UTILITY =====
function showResult(data) {
  output.textContent = JSON.stringify(data, null, 2);
}

// ===== SIGNUP =====
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const email = document.getElementById('signupEmail').value;

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    });

    const data = await res.json();
    showResult(data);
  });
}

// ===== LOGIN =====
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    showResult(data);
  });
}

// ===== GET USERS =====
if (getUsersBtn) {
  getUsersBtn.addEventListener('click', async () => {
    const res = await fetch('/api/users');
    const data = await res.json();
    showResult(data);
  });
}

// ===== GET SERVICES =====
if (getServicesBtn) {
  getServicesBtn.addEventListener('click', async () => {
    const res = await fetch('/api/services');
    const data = await res.json();
    showResult(data);
  });
}

// ===== CREATE CHILD ORDER =====
if (createChildOrderForm) {
  createChildOrderForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const childUsername = document.getElementById('childUsername').value;
    const order = document.getElementById('childOrder').value;

    const res = await fetch('/api/child/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ childUsername, order })
    });

    const data = await res.json();
    showResult(data);
  });
}

// ===== GET ORDERS =====
if (getOrdersBtn) {
  getOrdersBtn.addEventListener('click', async () => {
    const res = await fetch('/api/child/orders');
    const data = await res.json();
    showResult(data);
  });
}
