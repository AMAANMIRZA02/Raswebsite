let cart = [];

function addToCart(item, price) {
  // Check if item already exists
  let existing = cart.find(x => x.item === item);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ item, price, qty: 1 });
  }
  showCart();
}

function showCart() {
  let cartDiv = document.getElementById('cart');
  cartDiv.innerHTML = "<h3>Your Order</h3>";

  let total = 0;

  cart.forEach(x => {
    let itemTotal = x.price * x.qty;
    total += itemTotal;
    cartDiv.innerHTML += `
      <p>${x.item} x ${x.qty} = ₹${itemTotal}
      <button onclick="increaseQty('${x.item}')">+</button>
      <button onclick="decreaseQty('${x.item}')">-</button>
      </p>
    `;
  });

  cartDiv.innerHTML += `<h4>Total: ₹${total}</h4>`;
}

function increaseQty(item) {
  let obj = cart.find(x => x.item === item);
  obj.qty++;
  showCart();
}

function decreaseQty(item) {
  let obj = cart.find(x => x.item === item);
  if (obj.qty > 1) obj.qty--;
  else cart = cart.filter(x => x.item !== item);
  showCart();
}

function placeOrder() {
    if (cart.length === 0) {
        alert("Please add items to your cart before placing an order!");
        return;
    }

    let name = document.getElementById('name').value.trim();
    let phone = document.getElementById('phone').value.trim();
    let address = document.getElementById('address').value.trim();
    let date = document.getElementById('date').value;

    if (!name || !phone || !address || !date) {
        alert("Please fill all fields!");
        return;
    }

    // Create order object
    let order = {
        name,
        phone,
        address,
        date,
        cart,
        total: cart.reduce((t, i) => t + i.price * i.qty, 0),
        time: new Date().toLocaleString()
    };

    // Save order to localStorage
    localStorage.setItem('latestOrder', JSON.stringify(order));

    document.getElementById('orderMessage').innerHTML = `
    <h3>🎉 Thank you, ${name}!</h3>
    <p>Your order has been placed successfully.</p>
    <p><strong>Total:</strong> ₹${order.total}</p>
    <p>Event on: ${new Date(order.date).toLocaleString()}</p>
  `;

    // Reset everything
    document.getElementById('orderForm').reset();
    cart = [];
    showCart();
}
function payNow() {
    if (cart.length === 0) {
        alert("Please add items to your cart before payment!");
        return;
    }

    let name = document.getElementById('name').value.trim();
    let phone = document.getElementById('phone').value.trim();
    let address = document.getElementById('address').value.trim();
    let date = document.getElementById('date').value;

    if (!name || !phone || !address || !date) {
        alert("Please fill all details before payment!");
        return;
    }

    let totalAmount = cart.reduce((t, i) => t + i.price * i.qty, 0) * 100; // Razorpay in paise

    let options = {
        key: "rzp_test_1DP5mmOlF5G5ag", // Razorpay test key
        amount: totalAmount,
        currency: "INR",
        name: "Hyderabad Catering Service",
        description: "Order Payment",
        image: "https://razorpay.com/favicon.png",
        handler: function (response) {
            alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
            placeOrder(); // Save the order after successful payment
        },
        prefill: {
            name: name,
            contact: phone,
        },
        notes: {
            address: address
        },
        theme: {
            color: "#e63946"
        }
    };

    let rzp = new Razorpay(options);
    rzp.open();
}
