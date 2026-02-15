const token = localStorage.getItem('token');
if(!token) window.location.href='index.html';

document.getElementById('logoutBtn').addEventListener('click', ()=>{localStorage.removeItem('token'); window.location.href='index.html'});

const quantityInput = document.getElementById('quantityInput');
const packagesDiv = document.getElementById('packages');
const ordersTable = document.getElementById('ordersTable').querySelector('tbody');

async function loadPackagesAndOrders(){
  // Get user info (country currency)
  const resUser = await fetch('/me', {headers:{Authorization: token}});
  const user = await resUser.json();
  const currency = user.country_currency;

  // Packages
  const quantity = parseInt(quantityInput.value)||0;
  const resPackages = await fetch(`/packages/${currency}`);
  const packages = await resPackages.json();
  packagesDiv.innerHTML='';
  packages.forEach(pkg=>{
    const total = Math.ceil(pkg.local_price * quantity /1000);
    packagesDiv.innerHTML+=`
      <div class="card">
        <h3>${pkg.name} (${pkg.platform})</h3>
        <p>Unit Price: ${pkg.local_price} ${pkg.currency} /1000</p>
        <p>Quantity: ${quantity}</p>
        <p><strong>Total: ${total} ${pkg.currency}</strong></p>
        <button onclick="placeOrder('${pkg.id}',${quantity})">Place Order</button>
      </div>`;
  });

  // Orders
  const resOrders = await fetch('/my-orders', {headers:{Authorization: token}});
  const orders = await resOrders.json();
  ordersTable.innerHTML='';
  orders.forEach(o=>{
    ordersTable.innerHTML+=`<tr>
      <td>${o.id}</td>
      <td>${o.package_name}</td>
      <td>${o.quantity}</td>
      <td>${o.total_price} ${currency}</td>
      <td>${o.status || 'Pending'}</td>
    </tr>`;
  });
}

async function placeOrder(pkgId, qty){
  if(qty<=0){alert("Enter valid quantity"); return;}
  const res = await fetch('/order', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({token,package_id:pkgId,quantity:qty})
  });
  const data = await res.json();
  if(data.order) alert("Order placed!");
  loadPackagesAndOrders();
}

quantityInput.addEventListener('input', loadPackagesAndOrders);
loadPackagesAndOrders();
