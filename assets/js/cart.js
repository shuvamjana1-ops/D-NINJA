/**
 * D'NINJA — Cart Logic
 * Manages cart state using localStorage
 */

const CART_PRICES = {
    'logo': 24,
    'socialmedia': 19,
    'thumbnail': 16,
    'poster': 25,
    'invitation': 15,
    'icard': 17,
    'branding': 50,
    'greetings': 18,
    'accessories': 10,
    'default': 20
};

const COUPONS = {
    'NINJA20': 0.20,
    'STUDENT30': 0.30,
    'FIRSTORDER': 0.15
};

class Cart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('dninja_cart')) || [];
        this.coupon = localStorage.getItem('dninja_coupon') || null;
    }

    save() {
        localStorage.setItem('dninja_cart', JSON.stringify(this.items));
        localStorage.setItem('dninja_coupon', this.coupon);
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: this }));
    }

    addItem(item) {
        // item: { id, name, src, folder, price }
        const existing = this.items.find(i => i.id === item.id);
        if (existing) {
            existing.quantity += 1;
        } else {
            const price = item.price || CART_PRICES[item.folder] || CART_PRICES['default'];
            this.items.push({ ...item, price, quantity: 1 });
        }
        this.save();
        this.showToast(`Added "${item.name}" to cart!`);
    }

    removeItem(id) {
        this.items = this.items.filter(i => i.id !== id);
        this.save();
    }

    updateQuantity(id, delta) {
        const item = this.items.find(i => i.id === id);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                this.removeItem(id);
            } else {
                this.save();
            }
        }
    }

    applyCoupon(code) {
        code = code.toUpperCase().trim();
        if (COUPONS[code]) {
            this.coupon = code;
            this.save();
            return { success: true, discount: COUPONS[code] };
        }
        return { success: false, message: "Invalid coupon code" };
    }

    removeCoupon() {
        this.coupon = null;
        this.save();
    }

    getSubtotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    getDiscount() {
        if (!this.coupon) return 0;
        const rate = COUPONS[this.coupon] || 0;
        return this.getSubtotal() * rate;
    }

    getTotal() {
        return this.getSubtotal() - this.getDiscount();
    }

    getItemCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    showToast(message) {
        let toast = document.getElementById('cart-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'cart-toast';
            toast.className = 'cart-toast';
            document.body.appendChild(toast);
        }
        toast.innerHTML = `<i class="fas fa-shopping-cart"></i> ${message}`;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }

    async checkout() {
        if (this.items.length === 0) return;

        const customerName = prompt("Enter your Name for the order:");
        const customerEmail = prompt("Enter your Email for the order:");

        if (!customerName || !customerEmail) {
            this.showToast("Name and Email are required for orders! 🥷");
            return;
        }

        const orderData = {
            items: this.items,
            customerName,
            customerEmail,
            coupon: this.coupon
        };

        try {
            this.showToast("Submitting your order... 🥷");
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();
            if (result.success) {
                this.items = [];
                this.save();
                
                // Redirect to success page
                window.location.href = `success.html?orderId=${result.orderId}`;
                return true;
            } else {
                throw new Error(result.message);
            }
        } catch (err) {
            console.warn("Direct checkout failed.");
            this.showToast("Order failed. Please contact us directly. 🥷");
        }
        return false;
    }

    getCheckoutUrl() {
        const baseUrl = "https://docs.google.com/forms/d/e/1FAIpQLSfSTa2vXu7hfrneCq3plXLOIn9W68XQvZULHnSnfFl4dWRaVg/viewform";
        const entryId = "entry.123456789";
        
        let details = "CART ORDER:\n";
        this.items.forEach(item => {
            details += `- ${item.name} (x${item.quantity}) - ₹${item.price * item.quantity}\n`;
        });
        details += `\nSubtotal: ₹${this.getSubtotal()}\n`;
        if (this.coupon) details += `Coupon: ${this.coupon} (-₹${this.getDiscount().toFixed(2)})\n`;
        details += `TOTAL: ₹${this.getTotal().toFixed(2)}`;

        return `${baseUrl}?${entryId}=${encodeURIComponent(details)}`;
    }
}

window.dninjaCart = new Cart();

// Update UI elements that listen for cart updates
window.addEventListener('cartUpdated', (e) => {
    const countElements = document.querySelectorAll('.cart-count');
    countElements.forEach(el => {
        el.textContent = e.detail.getItemCount();
        el.style.display = e.detail.getItemCount() > 0 ? 'flex' : 'none';
    });
});

// Initial update for counters
document.addEventListener('DOMContentLoaded', () => {
    const countElements = document.querySelectorAll('.cart-count');
    const count = window.dninjaCart.getItemCount();
    countElements.forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'flex' : 'none';
    });
});
