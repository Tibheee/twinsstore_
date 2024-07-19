document.addEventListener('DOMContentLoaded', () => {
    let userBalance = 0;
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Fungsi untuk memperbarui tampilan saldo saat ini
    function updateBalanceDisplay() {
        document.getElementById('current-balance').textContent = 'Saldo saat ini: Rp ' + userBalance;
    }

    // Fungsi untuk menambahkan produk ke keranjang
    function addToCart(product) {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }

    // Fungsi untuk memperbarui tampilan keranjang
    function updateCartDisplay() {
        const cartContainer = document.getElementById('cart-details');
        cartContainer.innerHTML = ''; // Kosongkan tampilan sebelumnya
        cart.forEach(item => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `<h3>${item.name}</h3><p>Rp ${item.price}</p>`;
            cartContainer.appendChild(productItem);
        });
    }

    // Event listener untuk form penambahan saldo
    document.getElementById('balance-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const amount = parseFloat(document.getElementById('balance-amount').value);
        userBalance += amount;
        updateBalanceDisplay();
        alert('Saldo berhasil ditambahkan: Rp ' + amount + '\nSaldo saat ini: Rp ' + userBalance);
    });

    // Event listener untuk tombol "Buy Now"
    document.querySelectorAll('.buy-button').forEach(button => {
        button.addEventListener('click', function() {
            const productPrice = parseFloat(this.parentElement.getAttribute('data-price'));
            if (userBalance >= productPrice) {
                userBalance -= productPrice;
                updateBalanceDisplay();
                alert('Pembelian berhasil! Saldo berkurang: Rp ' + productPrice + '\nSaldo saat ini: Rp ' + userBalance);
            } else {
                alert('Saldo tidak mencukupi untuk melakukan pembelian ini.');
            }
        });
    });

    // Fungsi untuk menghitung ongkir (contoh sederhana)
    function calculateShippingCost(courier, location) {
        const baseCost = 10000; // Ongkir dasar
        const locationFactor = location.length * 100; // Faktor lokasi berdasarkan panjang nama lokasi
        const courierFactor = {
            'jne': 1.2,
            'tiki': 1.1,
            'pos': 1.0,
            'jnt': 1.3,
            'shopee': 1.4
        }[courier] || 1.0;

        return baseCost + locationFactor * courierFactor;
    }

    // Event listener untuk tombol "Check Shipping Cost"
    document.getElementById('check-shipping').addEventListener('click', function() {
        const courier = document.getElementById('courier').value;
        const location = document.getElementById('location').value;

        if (courier && location) {
            const shippingCost = calculateShippingCost(courier, location);
            document.getElementById('shipping-details').textContent = 'Ongkir: Rp ' + shippingCost;
        } else {
            alert('Silakan pilih jasa kirim dan masukkan lokasi Anda.');
        }
    });

    // Event listener untuk form pembayaran
    document.getElementById('payment-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const productName = document.getElementById('product-name').value;
        const productPrice = parseFloat(document.getElementById('product-price').value);
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const address = document.getElementById('address').value;
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;

        // Logika untuk memproses pembayaran
        alert('Pembayaran berhasil untuk ' + productName + ' dengan harga Rp ' + productPrice + ' menggunakan metode ' + paymentMethod);
    });

    // Event listener untuk form tracking
    document.getElementById('tracking-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const trackingNumber = document.getElementById('tracking-number').value;
        // Logika untuk mendapatkan status pengiriman berdasarkan nomor resi
        // Misalnya, kita bisa menggunakan API dari kurir untuk mendapatkan status pengiriman
        // Di sini kita akan menggunakan data dummy untuk contoh
        const trackingStatus = "Paket sedang dalam perjalanan ke tujuan.";
        document.getElementById('tracking-status').textContent = 'Status Pengiriman: ' + trackingStatus;
    });

    // Event listener untuk tombol "Add to Cart"
    document.querySelectorAll('.add-to-cart-button').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.parentElement.getAttribute('data-name');
            const productPrice = parseFloat(this.parentElement.getAttribute('data-price'));
            addToCart({ name: productName, price: productPrice });
        });
    });

    // Memperbarui tampilan keranjang saat halaman dimuat
    updateCartDisplay();
});
