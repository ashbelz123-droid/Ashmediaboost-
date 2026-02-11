// -----------------------------
// Admin login
// -----------------------------
const adminLoginForm = document.getElementById("adminLoginForm");
const adminDashboard = document.getElementById("adminDashboard");

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("adminUsername").value;
    const password = document.getElementById("adminPassword").value;

    // Simple frontend check (secure check in backend!)
    if (username === "admin" && password === "admin@123") {
      adminLoginForm.style.display = "none";
      adminDashboard.style.display = "block";
      loadAdminData();
    } else {
      alert("Invalid admin credentials");
    }
  });
}

// -----------------------------
// Load users and orders
// -----------------------------
async function loadAdminData() {
  // Load users
  const usersRes = await fetch("/admin/users");
  const users = await usersRes.json();
  const usersTbody = document.querySelector("#usersTable tbody");
  usersTbody.innerHTML = "";
  users.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.name}</td>
      <td>${u.country}</td>
      <td>${u.currency}</td>
      <td>${u.wallet}</td>
    `;
    usersTbody.appendChild(tr);
  });

  // Load orders
  const ordersRes = await fetch("/admin/orders");
  const orders = await ordersRes.json();
  const ordersTbody = document.querySelector("#ordersTable tbody");
  ordersTbody.innerHTML = "";
  orders.forEach(o => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${o.userId}</td>
      <td>${o.platform}</td>
      <td>${o.provider}</td>
      <td>${o.tier}</td>
      <td>${o.quantity}</td>
      <td>${o.price}</td>
      <td>${o.status}</td>
    `;
    ordersTbody.appendChild(tr);
  });

  // Load currency rates
  const currencyRatesRes = await fetch("/admin/currencies");
  const rates = await currencyRatesRes.json();
  const currencyDiv = document.getElementById("currencyRates");
  currencyDiv.innerHTML = "";
  for (const code in rates) {
    const p = document.createElement("p");
    p.innerText = `${code}: ${rates[code]}`;
    currencyDiv.appendChild(p);
  }
}

// -----------------------------
// Update currency
// -----------------------------
const updateCurrencyForm = document.getElementById("updateCurrencyForm");
if (updateCurrencyForm) {
  updateCurrencyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const currencyName = document.getElementById("currencyName").value;
    const currencyRate = parseFloat(document.getElementById("currencyRate").value);

    const res = await fetch("/admin/update-currency", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currencyName, currencyRate })
    });

    const data = await res.json();
    if (data.status === "success") {
      alert("Currency updated!");
      loadAdminData();
    } else {
      alert("Error updating currency");
    }
  });
}

// -----------------------------
// Admin logout
// -----------------------------
const adminLogoutBtn = document.getElementById("adminLogout");
if (adminLogoutBtn) {
  adminLogoutBtn.addEventListener("click", () => {
    adminDashboard.style.display = "none";
    adminLoginForm.style.display = "block";
  });
}
