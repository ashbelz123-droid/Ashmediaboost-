// -----------------------------
// Helpers
// -----------------------------
function getUserId() {
  return localStorage.getItem("userId");
}

function setUserId(id) {
  localStorage.setItem("userId", id);
}

function setCurrency(currency) {
  localStorage.setItem("currency", currency);
}

function getCurrency() {
  return localStorage.getItem("currency") || "UGX";
}

// -----------------------------
// Signup
// -----------------------------
const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = signupForm.name.value;
    const country = signupForm.country.value;

    const res = await fetch("/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, country })
    });
    const data = await res.json();
    if (data.status === "success") {
      setUserId(data.userId);
      setCurrency(data.currency);
      alert("Signup successful! User ID saved.");
      window.location.href = "dashboard.html";
    } else {
      alert("Error: " + data.msg);
    }
  });
}

// -----------------------------
// Login
// -----------------------------
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const userId = loginForm.userId.value;
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId })
    });
    const data = await res.json();
    if (data.status === "success") {
      setUserId(data.userId);
      setCurrency(data.currency);
      alert("Login successful!");
      window.location.href = "dashboard.html";
    } else {
      alert("Error: " + data.msg);
    }
  });
}

// -----------------------------
// Dashboard
// -----------------------------
async function loadDashboard() {
  const userId = getUserId();
  if (!userId) {
    window.location.href = "login.html";
    return;
  }

  const currency = getCurrency();

  // Load wallet & name
  const res = await fetch(`/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId })
  });
  const userData = await res.json();
  if (userData.status === "success") {
    document.getElementById("userName").innerText = userData.userId;
    document.getElementById("walletBalance").innerText = userData.currency;
  }

  // Load services
  const servicesRes = await fetch(`/services/${currency}`);
  const services = await servicesRes.json();
  const servicesList = document.getElementById("servicesList");
  servicesList.innerHTML = "";
  services.forEach(s => {
    const div = document.createElement("div");
    div.classList.add("service-item");
    div.innerHTML = `
      <strong>${s.platform} (${s.provider})</strong><br>
      Tier: ${s.tier}<br>
      Price: ${s.price} ${currency}<br>
      Speed: ${s.speedHours} hours<br>
      Lifetime: ${s.lifetime ? "Yes" : "No"}
    `;
    servicesList.appendChild(div);
  });

  // Service search
  const searchInput = document.getElementById("serviceSearch");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const term = searchInput.value.toLowerCase();
      document.querySelectorAll(".service-item").forEach(item => {
        item.style.display = item.innerText.toLowerCase().includes(term) ? "block" : "none";
      });
    });
  }
}

// -----------------------------
// Order page
// -----------------------------
const orderForm = document.getElementById("orderForm");
if (orderForm) {
  const userId = getUserId();
  const currency = getCurrency();

  // Populate service select
  fetch(`/services/${currency}`)
    .then(res => res.json())
    .then(services => {
      const select = document.getElementById("serviceSelect");
      services.forEach(s => {
        const option = document.createElement("option");
        option.value = s.id;
        option.text = `${s.platform} (${s.provider}) - ${s.tier} - ${s.price} ${currency}`;
        select.add(option);
      });
    });

  orderForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const serviceId = document.getElementById("serviceSelect").value;
    const quantity = parseInt(document.getElementById("quantity").value);

    const res = await fetch("/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, serviceId, quantity })
    });
    const data = await res.json();
    const msgDiv = document.getElementById("orderMsg");
    if (data.status === "success") {
      msgDiv.innerText = `Order placed! Order ID: ${data.orderId}`;
      msgDiv.style.color = "green";
    } else {
      msgDiv.innerText = `Error: ${data.msg}`;
      msgDiv.style.color = "red";
    }
  });
}

// -----------------------------
// Logout
// -----------------------------
const logoutBtns = document.querySelectorAll("#logoutBtn");
logoutBtns.forEach(btn => btn.addEventListener("click", () => {
  localStorage.removeItem("userId");
  window.location.href = "login.html";
}));

// Run dashboard loader if on dashboard page
if (document.getElementById("userName")) loadDashboard();
