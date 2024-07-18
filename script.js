document.addEventListener('DOMContentLoaded', function() {
    const buyButtons = document.querySelectorAll('.buy-button');
    const paymentForm = document.getElementById('payment-form');
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const paymentMethodInputs = document.querySelectorAll('input[name="payment-method"]');
    const ewalletDetails = document.getElementById('ewallet-details');
    const whatsappLink = document.getElementById('whatsapp-link');
    const instagramLink = document.getElementById('instagram-link');

    buyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const product = this.closest('.product');
            const productName = product.getAttribute('data-name');
            const productPrice = product.getAttribute('data-price');

            productNameInput.value = productName;
            productPriceInput.value = `Rp ${productPrice}`;
            window.location.href = '#payment';
        });
    });

    paymentMethodInputs.forEach(input => {
        input.addEventListener('change', function() {
            ewalletDetails.style.display = 'none';

            if (this.value === 'ovo' || this.value === 'gopay' || this.value === 'dana') {
                ewalletDetails.style.display = 'block';
            }
        });
    });

    paymentForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const productName = productNameInput.value;
        const productPrice = productPriceInput.value;
        let paymentDetails = {};

        if (paymentMethod === 'ovo' || paymentMethod === 'gopay' || paymentMethod === 'dana') {
            paymentDetails = {
                ewalletPhone: document.getElementById('ewallet-phone').value
            };
        }

        // Contoh pengiriman data ke server
        fetch('/api/payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productName,
                productPrice,
                name,
                email,
                address,
                paymentMethod,
                paymentDetails
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            alert('Pembayaran berhasil!');
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Pembayaran gagal!');
        });
    });

    document.getElementById('add-product-button').addEventListener('click', function() {
        const productList = document.getElementById('product-list');
        const newProduct = document.createElement('div');
        newProduct.className = 'product';
        newProduct.innerHTML = `
            <img src="product.jpg" alt="New Product">
            <h3>New Product</h3>
            <p>Rp 0</p>
            <button class="buy-button">Buy Now</button>
        `;
        productList.appendChild(newProduct);
    });

    document.getElementById('check-shipping').addEventListener('click', function() {
        const courier = document.getElementById('courier').value;
        const shippingDetails = document.getElementById('shipping-details');
        let cost;

        switch (courier) {
            case 'jne':
                cost = 'Rp 20,000';
                break;
            case 'tiki':
                cost = 'Rp 18,000';
                break;
            case 'pos':
                cost = 'Rp 15,000';
                break;
            case 'jnt':
                cost = 'Rp 22,000';
                break;
            case 'shopee':
                cost = 'Rp 25,000';
                break;
            default:
                cost = 'Rp 0';
        }

        shippingDetails.innerHTML = `Shipping cost with ${courier.toUpperCase()} is ${cost}.`;
    });

    // Update WhatsApp link with a default message
    const phoneNumber = '081322058740'; // Ganti dengan nomor WhatsApp Anda
    whatsappLink.href = `https://wa.me/${phoneNumber}?text=Hello, I would like to inquire about your products.`;

    // Update WhatsApp link with user message
    document.getElementById('contact-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const name = document.getElementById('contact-name').value;
        const email = document.getElementById('contact-email').value;
        const message = document.getElementById('contact-message').value;
        const whatsappMessage = `Name: ${name}%0AEmail: ${email}%0AMessage: ${message}`;
        whatsappLink.href = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
        whatsappLink.click();
    });

    // Update Instagram link
    const instagramUsername = 'twinsstoreciamis_'; // Ganti dengan nama pengguna Instagram Anda
    instagramLink.href = `https://www.instagram.com/${instagramUsername}`;
});