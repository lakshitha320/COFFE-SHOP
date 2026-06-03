/* ===========================
   BREWSCAPE – script.js
   Loader, Navbar, Scroll Reveals,
   Menu Tabs, Counter, Back-to-Top,
   Particles, Form handling
   =========================== */

document.addEventListener('DOMContentLoaded', () => {
  // ─── LOADER ───
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 1200);
  });
  // Fallback – hide after 3 s even if 'load' already fired
  setTimeout(() => loader.classList.add('hidden'), 3000);

  // ─── NAVBAR SCROLL EFFECT ───
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section, .hero');

  function onScroll() {
    // Shrink navbar
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Active link
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });

    // Back to top
    const btt = document.getElementById('backToTop');
    btt.classList.toggle('visible', window.scrollY > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ─── HAMBURGER ───
  const hamburger = document.getElementById('hamburger');
  const navLinksUl = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksUl.classList.toggle('open');
  });
  // Close mobile menu on link click
  navLinksUl.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksUl.classList.remove('open');
    });
  });

  // ─── SCROLL REVEAL ───
  const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // ─── COUNTER ANIMATION ───
  const counters = document.querySelectorAll('.stat-num[data-target]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = +el.dataset.target;
        let count = 0;
        const increment = Math.ceil(target / 60);
        const timer = setInterval(() => {
          count += increment;
          if (count >= target) { count = target; clearInterval(timer); }
          el.textContent = count;
        }, 30);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));

  // ─── MENU TABS ───
  const tabs = document.querySelectorAll('.tab');
  const cards = document.querySelectorAll('.menu-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.tab;
      cards.forEach(card => {
        if (card.dataset.category === category) {
          card.style.display = '';
          // Re-trigger animation
          card.classList.remove('visible');
          void card.offsetWidth;           // reflow
          card.classList.add('visible');
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ─── HERO PARTICLES ───
  const particlesContainer = document.getElementById('heroParticles');
  if (particlesContainer) {
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.classList.add('particle');
      p.style.left = Math.random() * 100 + '%';
      p.style.top = (50 + Math.random() * 50) + '%';
      p.style.animationDelay = (Math.random() * 6) + 's';
      p.style.animationDuration = (4 + Math.random() * 4) + 's';
      p.style.width = (2 + Math.random() * 3) + 'px';
      p.style.height = p.style.width;
      particlesContainer.appendChild(p);
    }
  }

  // ─── BACK TO TOP ───
  document.getElementById('backToTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ─── CONTACT FORM ───
  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('formSubmit');
    btn.textContent = '✓ Message Sent!';
    btn.style.background = 'linear-gradient(135deg, #2d5a27, #4a8a40)';
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  });

  // ─── NEWSLETTER ───
  const newsletterForm = document.getElementById('newsletterForm');
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = newsletterForm.querySelector('button');
    btn.textContent = '✓';
    setTimeout(() => {
      btn.textContent = '→';
      newsletterForm.reset();
    }, 2500);
  });

  // ─── SMOOTH PARALLAX ON HERO ───
  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-visual');
    if (hero) {
      const scrolled = window.scrollY;
      hero.style.transform = `translateY(${scrolled * 0.12}px)`;
    }
  }, { passive: true });

  // ─── SIMPLE CART / CHECKOUT ───
  // Inject cart link into navbar
  (function injectCartLink() {
    const nav = document.getElementById('navbar');
    if (!nav) return;
    let cartLink = document.getElementById('navCart');
    if (!cartLink) {
      cartLink = document.createElement('a');
      cartLink.href = 'checkout.html';
      cartLink.id = 'navCart';
      cartLink.className = 'nav-cta nav-cart';
      cartLink.innerHTML = 'Cart (<span id="cartCount">0</span>)';
      nav.appendChild(cartLink);
    }
    updateCartCount();
  })();

  function getCart() {
    try {
      return JSON.parse(localStorage.getItem('brewscape_cart') || '[]');
    } catch (e) {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem('brewscape_cart', JSON.stringify(cart));
    updateCartCount();
  }

  function addToCart(item, qty = 1) {
    const cart = getCart();
    const existing = cart.find(i => i.name === item.name && i.price === item.price);
    if (existing) existing.qty = (existing.qty || 0) + qty;
    else cart.push({ ...item, qty });
    saveCart(cart);
  }

  function updateCartItemQty(index, qty) {
    const cart = getCart();
    if (cart[index]) {
      cart[index].qty = qty;
      if (cart[index].qty <= 0) cart.splice(index, 1);
      saveCart(cart);
    }
  }

  function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
  }

  function updateCartCount() {
    const countEl = document.getElementById('cartCount');
    if (!countEl) return;
    const cart = getCart();
    const qty = cart.reduce((s, i) => s + (i.qty || 0), 0);
    countEl.textContent = qty;
  }

  // Add buttons + qty controls to menu cards dynamically (so pages don't need manual edits)
  const menuCards = document.querySelectorAll('.menu-card');
  menuCards.forEach(card => {
    const info = card.querySelector('.card-info');
    if (!info) return;
    // avoid duplicating controls
    if (info.querySelector('.add-to-cart')) return;
    const btnWrap = document.createElement('div');
    btnWrap.className = 'card-actions';

    const qtyWrap = document.createElement('div');
    qtyWrap.className = 'qty-control';
    qtyWrap.innerHTML = '<button class="qty-btn qty-decrease">-</button><span class="qty-value">1</span><button class="qty-btn qty-increase">+</button>';

    const btn = document.createElement('button');
    btn.className = 'btn btn-add add-to-cart';
    btn.textContent = 'Add to cart';

    btnWrap.appendChild(qtyWrap);
    btnWrap.appendChild(btn);
    info.appendChild(btnWrap);
  });

  // Delegate clicks for qty buttons and add-to-cart buttons
  document.addEventListener('click', (e) => {
    const dec = e.target.closest('.qty-decrease');
    if (dec) {
      const wrap = dec.closest('.card-actions');
      const val = wrap.querySelector('.qty-value');
      let n = parseInt(val.textContent, 10) || 1;
      n = Math.max(1, n - 1);
      val.textContent = n;
      return;
    }
    const inc = e.target.closest('.qty-increase');
    if (inc) {
      const wrap = inc.closest('.card-actions');
      const val = wrap.querySelector('.qty-value');
      let n = parseInt(val.textContent, 10) || 1;
      n = Math.min(99, n + 1);
      val.textContent = n;
      return;
    }

    const btn = e.target.closest('.add-to-cart');
    if (!btn) return;
    const card = btn.closest('.menu-card');
    if (!card) return;
    const nameEl = card.querySelector('h3');
    const priceEl = card.querySelector('.price');
    const name = nameEl ? nameEl.textContent.trim() : 'Item';
    const priceText = priceEl ? priceEl.textContent.replace(/[^0-9.]/g, '') : '0';
    const price = parseFloat(priceText) || 0;
    const qtyVal = card.querySelector('.qty-value');
    const qty = qtyVal ? (parseInt(qtyVal.textContent, 10) || 1) : 1;
    addToCart({ name, price }, qty);
    // small feedback
    btn.textContent = 'Added';
    setTimeout(() => btn.textContent = 'Add to cart', 900);
  });

  // If on checkout page, render cart and handle payment
  if (window.location.pathname.endsWith('checkout.html') || window.location.href.includes('checkout.html')) {
    const cartList = document.getElementById('cartList');
    const emptyMessage = document.getElementById('emptyMessage');
    const totalEl = document.getElementById('cartTotal');
    const totalFinalEl = document.getElementById('cartTotalFinal');
    const payButton = document.getElementById('payButton');
    const paymentHint = document.getElementById('paymentHint');
    const payForm = document.getElementById('paymentForm');
    const cardFields = document.getElementById('cardFields');

    function updateCheckoutState(cart) {
      const hasItems = cart.length > 0;
      if (emptyMessage) emptyMessage.style.display = hasItems ? 'none' : '';
      if (cartList) cartList.style.display = hasItems ? '' : 'none';
      if (payButton) {
        payButton.disabled = !hasItems;
        payButton.textContent = hasItems ? 'Pay Now' : 'Add items to checkout';
      }
      const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
      if (totalEl) totalEl.textContent = '$' + total.toFixed(2);
      if (totalFinalEl) totalFinalEl.textContent = '$' + total.toFixed(2);
    }

    function renderCheckout() {
      const cart = getCart();
      if (!cartList || !totalEl || !totalFinalEl) return;
      cartList.innerHTML = '';
      if (!cart.length) {
        updateCheckoutState(cart);
        return;
      }

      cart.forEach((item, i) => {
        const row = document.createElement('div');
        row.className = 'checkout-item';
        row.innerHTML = `
          <div class="ci-left">
            <strong>${item.name}</strong>
            <div class="ci-controls">
              <button class="qty-btn checkout-decrease" data-index="${i}">-</button>
              <span class="ci-qty">${item.qty}</span>
              <button class="qty-btn checkout-increase" data-index="${i}">+</button>
            </div>
          </div>
          <div class="ci-right">
            $${(item.price * item.qty).toFixed(2)}
            <button class="remove-item" data-index="${i}">Remove</button>
          </div>
        `;
        cartList.appendChild(row);
      });
      updateCheckoutState(cart);
    }

    function togglePaymentFields(method) {
      if (!cardFields || !paymentHint) return;
      if (method === 'Card') {
        cardFields.style.display = '';
        paymentHint.textContent = 'Card payments are processed securely. For Cash on Delivery, your order will be confirmed immediately.';
      } else {
        cardFields.style.display = 'none';
        paymentHint.textContent = 'You will pay when your order is delivered. Please keep the exact amount ready.';
      }
    }

    document.addEventListener('click', (e) => {
      const rem = e.target.closest('.remove-item');
      if (rem) {
        const idx = parseInt(rem.dataset.index, 10);
        removeFromCart(idx);
        renderCheckout();
        return;
      }
      const inc = e.target.closest('.checkout-increase');
      if (inc) {
        const idx = parseInt(inc.dataset.index, 10);
        const cart = getCart();
        if (cart[idx]) { updateCartItemQty(idx, (cart[idx].qty || 0) + 1); renderCheckout(); }
        return;
      }
      const dec = e.target.closest('.checkout-decrease');
      if (dec) {
        const idx = parseInt(dec.dataset.index, 10);
        const cart = getCart();
        if (cart[idx]) { updateCartItemQty(idx, (cart[idx].qty || 0) - 1); renderCheckout(); }
        return;
      }
    });

    if (payForm) {
      payForm.addEventListener('change', () => {
        togglePaymentFields(payForm.paymentMethod.value);
      });
      payForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cart = getCart();
        if (!cart.length) return;

        const method = payForm.paymentMethod.value;
        if (method === 'Card') {
          const cardNumber = payForm.cardNumber.value.trim();
          const expiry = payForm.expiry.value.trim();
          const cvc = payForm.cvc.value.trim();
          if (!cardNumber || !expiry || !cvc) {
            alert('Please fill in card details');
            return;
          }
        }

        const btn = payForm.querySelector('button[type="submit"]');
        if (btn) {
          btn.disabled = true;
          btn.textContent = 'Processing...';
        }
        setTimeout(() => {
          localStorage.removeItem('brewscape_cart');
          updateCartCount();
          if (btn) btn.textContent = 'Paid ✓';
          alert('Payment successful via ' + method + '. Thank you!');
          window.location.href = 'index.html';
        }, 1200);
      });
    }

    renderCheckout();
    if (payForm) togglePaymentFields(payForm.paymentMethod.value);
  }

  initAIAssistant();

  function initAIAssistant() {
    if (document.getElementById('aiAssistantWidget')) return;
    document.body.insertAdjacentHTML('beforeend', `
      <div id="aiAssistantWidget" class="ai-widget closed">
        <button class="ai-toggle" aria-label="Open assistant">💬</button>
        <div class="ai-panel">
          <div class="ai-header">
            <div>
              <p>AI Assistant</p>
              <span>Get help with menu items, orders, or leave feedback.</span>
            </div>
            <button class="ai-close" aria-label="Close assistant">✕</button>
          </div>
          <div class="ai-tabs">
            <button class="ai-tab active" data-tab="chat">Chat</button>
            <button class="ai-tab" data-tab="feedback">Feedback</button>
          </div>
          <div class="ai-body">
            <div class="ai-chat tab-pane active" data-tab="chat">
              <div class="ai-messages">
                <div class="ai-message ai-bot">Hi! I’m Brewscape Assistant. Ask me about our menu, gallery, or checkout.</div>
              </div>
              <form class="ai-form">
                <input type="text" placeholder="Ask a question..." aria-label="Ask a question" required />
                <button type="submit">Send</button>
              </form>
            </div>
            <div class="ai-feedback tab-pane" data-tab="feedback">
              <div class="ai-feedback-text">Share your feedback with us and we’ll review it right away.</div>
              <form class="ai-feedback-form">
                <textarea placeholder="Write your feedback..." aria-label="Feedback message" required></textarea>
                <button type="submit">Send Feedback</button>
              </form>
              <div class="ai-feedback-confirmation" aria-live="polite"></div>
            </div>
          </div>
        </div>
      </div>
    `);

    const widget = document.getElementById('aiAssistantWidget');
    const toggle = widget.querySelector('.ai-toggle');
    const closeBtn = widget.querySelector('.ai-close');
    const chatForm = widget.querySelector('.ai-form');
    const input = chatForm.querySelector('input');
    const messages = widget.querySelector('.ai-messages');
    const tabs = widget.querySelectorAll('.ai-tab');
    const panes = widget.querySelectorAll('.tab-pane');
    const feedbackForm = widget.querySelector('.ai-feedback-form');
    const feedbackConfirmation = widget.querySelector('.ai-feedback-confirmation');

    toggle.addEventListener('click', () => {
      widget.classList.toggle('closed');
    });

    closeBtn.addEventListener('click', () => {
      widget.classList.add('closed');
    });

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        tabs.forEach((btn) => btn.classList.toggle('active', btn === tab));
        panes.forEach((pane) => pane.classList.toggle('active', pane.dataset.tab === tab.dataset.tab));
      });
    });

    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const question = input.value.trim();
      if (!question) return;
      addChatMessage('user', question);
      input.value = '';
      setTimeout(() => addChatMessage('bot', getAIResponse(question)), 300);
    });

    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const feedback = feedbackForm.querySelector('textarea').value.trim();
      if (!feedback) return;
      feedbackForm.reset();
      feedbackConfirmation.textContent = 'Thanks for your feedback — we appreciate it!';
      setTimeout(() => {
        feedbackConfirmation.textContent = '';
      }, 5000);
    });

    function addChatMessage(type, text) {
      const message = document.createElement('div');
      message.className = `ai-message ai-${type}`;
      message.textContent = text;
      messages.appendChild(message);
      messages.scrollTop = messages.scrollHeight;
    }

    function getAIResponse(text) {
      const query = text.toLowerCase();
      if (/menu|drink|latte|coffee|pastry|special/.test(query)) {
        return 'Our menu page has all items organized by hot drinks, cold drinks, pastries, and specials. Feel free to browse and add anything to your cart!';
      }
      if (/gallery|photo|image|pictures/.test(query)) {
        return 'Visit the gallery page to see our cozy shop, latte art, and fresh pastries in more detail.';
      }
      if (/hours|open|close|time/.test(query)) {
        return 'We are open Mon–Fri 7am–9pm and Sat–Sun 8am–10pm. Stop by soon for a fresh cup!';
      }
      if (/order|checkout|cart|payment/.test(query)) {
        return 'Add items to your cart from the menu page, then proceed to checkout to complete your order and choose card or cash payment.';
      }
      if (/contact|email|reach/.test(query)) {
        return 'You can reach us at hello@brewscape.com or use the contact page to send a message directly.';
      }
      return 'I’m here to help with your order, menu questions, gallery info, and feedback. What would you like to know?';
    }
  }
});
