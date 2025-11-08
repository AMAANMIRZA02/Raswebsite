// Load latest order from localStorage
let orderData = JSON.parse(localStorage.getItem('latestOrder'));

if (!orderData) {
    document.getElementById("orderDetails").innerHTML = "<p>No orders found.</p>";
} else {
    showOrder(orderData);
}

function showOrder(order) {
    document.getElementById("orderDetails").innerHTML = `
    <p><strong>Name:</strong> ${order.name}</p>
    <p><strong>Phone:</strong> ${order.phone}</p>
    <p><strong>Address:</strong> ${order.address}</p>
    <p><strong>Event:</strong> ${new Date(order.date).toLocaleString()}</p>
    <p><strong>Total:</strong> ₹${order.total}</p>
    <h3>Order Items:</h3>
    <ul>${order.cart.map(i => `<li>${i.name} x${i.qty} - ₹${i.price * i.qty}</li>`).join('')}</ul>

    <label for="status">Order Status:</label>
    <select id="status" onchange="updateStatus()">
        <option value="Received">Received</option>
        <option value="In Kitchen">In Kitchen</option>
        <option value="Out for Delivery">Out for Delivery</option>
        <option value="Delivered">Delivered</option>
    </select>

    <p id="statusMessage">Current Status: <strong>${order.status || 'Received'}</strong></p>
  `;
}

function updateStatus() {
    let status = document.getElementById("status").value;
    orderData.status = status;
    localStorage.setItem('latestOrder', JSON.stringify(orderData));

    document.getElementById("statusMessage").innerHTML = `Current Status: <strong>${status}</strong>`;
    alert("Order status updated to: " + status);
}
