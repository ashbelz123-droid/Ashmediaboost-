const API_URL = "http://localhost:3000/api";

// REGISTER
async function register() {
  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  document.getElementById("regMessage").innerText = data.message;
}

// LOGIN
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("loginMessage").innerText = data.message;
  }
}

// CREATE ORDER
async function createOrder() {
  const service = document.getElementById("service").value;
  const quantity = document.getElementById("quantity").value;
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({ service, quantity })
  });

  const data = await res.json();
  alert(data.message);
}

// LOAD ORDERS
async function loadOrders() {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_URL}/orders/my`, {
    headers: {
      "Authorization": token
    }
  });

  const orders = await res.json();

  const list = document.getElementById("ordersList");
  list.innerHTML = "";

  orders.forEach(order => {
    const li = document.createElement("li");
    li.innerText = `${order.service} - ${order.quantity} - ${order.status}`;
    list.appendChild(li);
  });
}
