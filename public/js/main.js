// ==========================
// AshMediaBoost Frontend JS
// ==========================

document.addEventListener('DOMContentLoaded', () => {

  // ----- Wallet Placeholder -----
  let walletBalance = 100; // placeholder value
  const walletEl = document.getElementById('walletBalance');
  if (walletEl) walletEl.textContent = `₦${walletBalance.toFixed(2)}`;

  // ----- OTP Flow for Forgotten User ID -----
  const sendOTPBtn = document.getElementById('sendOTP');
  const verifyOTPBtn = document.getElementById('verifyOTP');
  const otpSection = document.getElementById('otpSection');
  const userIdDisplay = document.getElementById('userIdDisplay');

  if (sendOTPBtn) {
    sendOTPBtn.addEventListener('click', () => {
      // placeholder OTP generation
      const otp = Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem('otp', otp);
      otpSection.style.display = 'block';
      alert(`OTP sent! (Placeholder: ${otp})`);
    });
  }

  if (verifyOTPBtn) {
    verifyOTPBtn.addEventListener('click', () => {
      const inputOtp = document.getElementById('otpInput').value;
      const savedOtp = localStorage.getItem('otp');
      if (inputOtp === savedOtp) {
        userIdDisplay.textContent = `Your User ID: user-1a2b3c4d`; // placeholder
      } else {
        alert('Invalid OTP, try again!');
      }
    });
  }

  // ----- Dynamic Price Calculation in New Order -----
  const orderForm = document.getElementById('orderForm');
  const quantityInput = document.getElementById('quantity');
  const orderPriceEl = document.getElementById('orderPrice');
  const platformSelect = document.getElementById('platform');
  const serviceSelect = document.getElementById('service');

  function calculatePrice() {
    const qty = Number(quantityInput?.value || 0);
    let basePrice = 0;

    // Placeholder pricing logic
    if (serviceSelect?.value === 'likes') basePrice = 0.01;
    if (serviceSelect?.value === 'views') basePrice = 0.005;
    if (serviceSelect?.value === 'followers') basePrice = 0.02;

    const profitMultiplier = 1.6; // normal user placeholder
    const price = qty * basePrice * profitMultiplier;

    if (orderPriceEl) orderPriceEl.textContent = `₦${price.toFixed(2)}`;
  }

  if (quantityInput) quantityInput.addEventListener('input', calculatePrice);
  if (serviceSelect) serviceSelect.addEventListener('change', calculatePrice);

  // ----- Order Form Submission Placeholder -----
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Order submitted! (Placeholder, backend integration required)');
      orderForm.reset();
      if (orderPriceEl) orderPriceEl.textContent = `₦0.00`;
    });
  }

  // ----- Orders Table Placeholder (Dashboard / Orders Page) -----
  const ordersBody = document.getElementById('ordersBody');
  if (ordersBody) {
    const placeholderOrders = [
      { id: 'order-123', platform: 'Instagram', service: 'Likes', qty: 500, price: 5, status: 'Completed' },
      { id: 'order-124', platform: 'TikTok', service: 'Views', qty: 1000, price: 10, status: 'Pending' },
    ];

    ordersBody.innerHTML = placeholderOrders.map(o =>
      `<tr>
        <td>${o.id}</td>
        <td>${o.platform}</td>
        <td>${o.service}</td>
        <td>${o.qty}</td>
        <td>₦${o.price}</td>
        <td>${o.status}</td>
      </tr>`).join('');
  }

  console.log('Frontend placeholder logic loaded ✅');
});
