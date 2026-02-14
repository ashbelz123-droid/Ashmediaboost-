const API_URL = "https://blozicmqsebprsfmrwwe.supabase.co";
const API_KEY = "sb_publishable_Mm5kCbXvtuDhse-EtMzYKA_Wu3CSLZu";

const mobileMoneyProviders = {
  UG: ["MTN", "Airtel", "Africell"],
  KE: ["M-Pesa", "Airtel Money", "Equitel"],
  TZ: ["M-Pesa TZ", "Tigo Pesa", "Airtel Money TZ"],
  RW: ["MTN Rw", "Airtel Money RW"]
};

// Wallet
let walletBalance = 10000;
if (document.getElementById("wallet-balance")) {
  document.getElementById("wallet-balance").textContent = walletBalance;
}

// Packages for users
const packages = [
  { id: 1, name: "Basic", price_usd: 1, profit_multiplier: 1 },
  { id: 2, name: "Standard", price_usd: 2, profit_multiplier: 1.2 },
  { id: 3, name: "Premium", price_usd: 5, profit_multiplier: 1.5 }
];

if (document.getElementById("packages")) {
  const packagesDiv = document.getElementById("packages");

  packages.forEach(pkg => {
    const card = document.createElement("div");
    card.className = "package-card";
    card.innerHTML = `
      <h3>${pkg.name}</h3>
      <p>Price (USD): ${pkg.price_usd}</p>
      <label>Quantity: <input type="number" min="1" value="1" class="quantity-input"></label><br>
      <label>Country:
        <select class="country-select">
          <option value="UG">Uganda 🇺🇬</option>
          <option value="KE">Kenya 🇰🇪</option>
          <option value="TZ">Tanzania 🇹🇿</option>
          <option value="RW">Rwanda 🇷🇼</option>
        </select>
      </label><br>
      <label>Provider:
        <select class="provider-select">
          <option value="">Select provider</option>
        </select>
      </label><br>
      <button class="order-btn">Order Now</button>
    `;
    packagesDiv.appendChild(card);

    const countrySelect = card.querySelector(".country-select");
    const providerSelect = card.querySelector(".provider-select");

    countrySelect.addEventListener("change", e => {
      const country = e.target.value;
      providerSelect.innerHTML = mobileMoneyProviders[country].map(p => `<option value="${p}">${p}</option>`).join("");
    });

    card.querySelector(".order-btn").addEventListener("click", () => {
      const quantity = parseInt(card.querySelector(".quantity-input").value);
      const country = countrySelect.value;
      const provider = providerSelect.value;
      if (!provider) return alert("Select a provider");

      const localPrice = Math.ceil(pkg.price_usd * pkg.profit_multiplier * quantity);
      if (walletBalance < localPrice) return alert("Insufficient balance");

      walletBalance -= localPrice;
      document.getElementById("wallet-balance").textContent = walletBalance;
      alert(`Order placed: ${quantity} x ${pkg.name} via ${provider} (${country}) - Total: ${localPrice} USD`);
    });
  });
}

// Admin
if (document.getElementById("update-rate-btn")) {
  document.getElementById("update-rate-btn").addEventListener("click", async () => {
    const currency_code = document.getElementById("currency-code").value;
    const rate = parseFloat(document.getElementById("currency-rate").value);
    const email = document.getElementById("admin-email").value;
    const password = document.getElementById("admin-password").value;

    const res = await fetch(`${API_URL}/admin/update-rate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currency_code, rate, email, password })
    });

    const data = await res.json();
    document.getElementById("message").textContent = data.message || data.error;
  });
                   }
