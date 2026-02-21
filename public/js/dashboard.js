async function loadServices() {
    const res = await fetch('/api/services');
    const data = await res.json();
    const container = document.getElementById('services');
    container.innerHTML = '';

    data.services.forEach(service => {
        const box = document.createElement('div');
        box.className = 'service-box';
        box.innerHTML = `
            <h3>${service.service} on ${service.platform} <img src="icons/${service.platform.toLowerCase()}.png" alt="${service.platform}" style="width:20px;height:20px;"></h3>
            <p>Price: <span id="price-${service._id}">Calculating...</span> UGX</p>
            <p>Provider Tier: ${service.providerBox}</p>
            <img src="flags/${service.platform_country || 'ugx'}.png" style="width:25px; height:15px;" title="Service country">
            <button onclick="placeOrder('${service._id}','${service.providerBox}')">Order Now</button>
        `;
        container.appendChild(box);

        // Fetch live price dynamically
        fetch(`/api/orders/createPrice?serviceId=${service._id}`)
            .then(r=>r.json())
            .then(p => document.getElementById(`price-${service._id}`).innerText = p.priceUGX);
    });
}

async function placeOrder(serviceId, box) {
    const quantity = prompt('Enter quantity (e.g., 1000):');
    if(!quantity) return;

    const res = await fetch('/api/orders/create', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
            userId: 'CURRENT_USER_ID', // you can fetch from session/localStorage
            serviceId,
            box,
            quantity
        })
    });
    const data = await res.json();
    alert(data.message);
}

document.addEventListener('DOMContentLoaded', loadServices);
