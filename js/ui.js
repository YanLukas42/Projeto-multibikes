class UIManager {
    constructor(db, cartManager) {
        this.db = db;
        this.cart = cartManager;
        this.swiper = null;
        this.accSwiper = null;
        this.currentCategory = 'todas';
        this.searchQuery = '';
        this.activeModalBike = null;
    }

    init() {
        this.renderCategories();
        this.renderBikes();
        this.renderAccessories();
        this.renderFAQ();
        this.setupSearch();
        this.setupEventListeners();
        this.updateCart();
    }

    setupEventListeners() {
        document.getElementById('close-modal').addEventListener('click', () => this.closeProductModal());
        
        document.getElementById('add-to-cart-modal').addEventListener('click', () => {
            if (this.activeModalBike) {
                this.cart.add(this.activeModalBike);
                this.closeProductModal();
                this.openCart();
            }
        });

        document.getElementById('cart-btn').addEventListener('click', () => this.openCart());
        document.getElementById('close-cart').addEventListener('click', () => this.closeCart());
        document.getElementById('sidebar-overlay').addEventListener('click', () => this.closeCart());

        document.getElementById('checkout-whatsapp').addEventListener('click', () => {
            if (this.cart.items.length > 0) {
                window.open(this.cart.getWhatsAppLink(), '_blank');
            } else {
                alert('Seu carrinho está vazio!');
            }
        });
    }

    getAllProducts() {
        return [...(this.db.bikes || []), ...(this.db.accessories || [])];
    }

    getProductById(id) {
        return this.db.bikes.find(b => String(b.id) === String(id)) || 
               this.db.accessories.find(a => String(a.id) === String(id));
    }

    normalizeText(str) {
        if (!str) return '';
        return str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();
    }

    matchesSearch(product) {
        if (!this.searchQuery) return true;
        const queryNorm = this.normalizeText(this.searchQuery);
        const nameNorm = this.normalizeText(product.name);

        // 1. Busca estrita pelo nome do produto
        if (nameNorm.includes(queryNorm)) return true;

        // 2. Busca pelo termo "acessorio" ou "acessorios"
        if ((queryNorm === 'acessorio' || queryNorm === 'acessorios') && product.category === 'acessorios') {
            return true;
        }

        // 3. Busca pelo termo "bike", "bikes" ou "bicicleta"
        if ((queryNorm === 'bike' || queryNorm === 'bikes' || queryNorm === 'bicicleta') && product.category !== 'acessorios') {
            return true;
        }

        return false;
    }

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        const clearBtn = document.getElementById('clear-search');
        if (!searchInput) return;

        searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value.trim();
            if (clearBtn) {
                clearBtn.style.display = this.searchQuery.length > 0 ? 'block' : 'none';
            }
            this.renderBikes();
            this.renderAccessories();
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                this.searchQuery = '';
                clearBtn.style.display = 'none';
                this.renderBikes();
                this.renderAccessories();
            });
        }
    }

    renderCategories() {
        const list = document.getElementById('category-list');
        if (!list) return;
        list.innerHTML = '';
        
        this.db.categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = `category-pill ${this.currentCategory === cat.id ? 'active' : ''}`;
            btn.textContent = cat.name;
            btn.addEventListener('click', () => {
                this.currentCategory = cat.id;
                this.renderCategories();
                this.renderBikes();
                this.renderAccessories();
            });
            list.appendChild(btn);
        });
    }

    renderBikes() {
        const wrapper = document.getElementById('bike-carousel');
        if (!wrapper) return;
        wrapper.innerHTML = '';

        let productsToShow = [];

        if (this.searchQuery) {
            // Busca ativa: procura em todos os produtos (bikes e acessórios) e mostra direto na vitrine principal
            productsToShow = this.getAllProducts().filter(p => this.matchesSearch(p));
        } else if (this.currentCategory === 'todas') {
            productsToShow = this.db.bikes;
        } else if (this.currentCategory === 'acessorios') {
            productsToShow = this.db.accessories;
        } else {
            productsToShow = this.db.bikes.filter(b => b.category === this.currentCategory);
        }

        if (productsToShow.length === 0) {
            const emptySlide = document.createElement('div');
            emptySlide.className = 'empty-search-container';
            emptySlide.innerHTML = `
                <div class="empty-search-box">
                    <p>Nenhum produto encontrado para "<strong>${this.searchQuery}</strong>".</p>
                    <button class="btn-primary reset-search-trigger" style="margin-top:15px;padding:10px 20px;">Ver todos os produtos</button>
                </div>
            `;
            wrapper.appendChild(emptySlide);

            const resetBtn = wrapper.querySelector('.reset-search-trigger');
            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    const searchInput = document.getElementById('search-input');
                    const clearBtn = document.getElementById('clear-search');
                    if (searchInput) searchInput.value = '';
                    if (clearBtn) clearBtn.style.display = 'none';
                    this.searchQuery = '';
                    this.currentCategory = 'todas';
                    this.renderCategories();
                    this.renderBikes();
                    this.renderAccessories();
                });
            }
            this.initSwiper();
            return;
        }

        productsToShow.forEach(item => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            
            const imgFallback = `onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22600%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20600%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22800%22%20height%3D%22600%22%20fill%3D%22%23333%22%3E%3C%2Frect%3E%3Ctext%20x%3D%22350%22%20y%3D%22300%22%20fill%3D%22%23666%22%20font-family%3D%22sans-serif%22%20font-size%3D%2240%22%3EPRODUTO%3C%2Ftext%3E%3C%2Fsvg%3E'"`;

            const badgeHtml = item.badge ? `<span class="bike-badge">${item.badge}</span>` : '';

            slide.innerHTML = `
                <div class="bike-card-image-wrap">
                    ${badgeHtml}
                    <img src="${item.image}" alt="${item.name}" class="bike-card-image" ${imgFallback}>
                </div>
                <div class="bike-card-content">
                    <h3 class="bike-card-title">${item.name}</h3>
                    <p class="bike-card-price">R$ ${item.price.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <button class="btn-primary w-100 view-details" data-id="${item.id}">Ver e Comprar</button>
                </div>
            `;
            wrapper.appendChild(slide);
        });

        wrapper.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const product = this.getProductById(id);
                if (product) {
                    this.openProductModal(product);
                }
            });
        });

        this.initSwiper();
    }

    initSwiper() {
        if (this.swiper) {
            this.swiper.destroy(true, true);
        }
        
        this.swiper = new Swiper('.mySwiper', {
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: 16,
            pagination: {
                el: '.mySwiper .swiper-pagination',
                clickable: true,
            },
            effect: 'coverflow',
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 100,
                modifier: 1,
                slideShadows: false,
            },
        });
    }

    renderAccessories() {
        const wrapper = document.getElementById('accessories-carousel');
        const accSection = document.querySelector('.accessories-section');
        if (!wrapper || !accSection) return;

        // Se houver busca ativa ou o usuário já clicou na aba 'Acessórios', oculta a vitrine secundária para não duplicar
        if (this.searchQuery || this.currentCategory === 'acessorios') {
            accSection.style.display = 'none';
            if (this.accSwiper) {
                this.accSwiper.destroy(true, true);
                this.accSwiper = null;
            }
            return;
        }

        accSection.style.display = 'block';
        wrapper.innerHTML = '';

        const imgFallback = `onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22600%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20600%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22800%22%20height%3D%22600%22%20fill%3D%22%23333%22%3E%3C%2Frect%3E%3Ctext%20x%3D%22350%22%20y%3D%22300%22%20fill%3D%22%23666%22%20font-family%3D%22sans-serif%22%20font-size%3D%2240%22%3EPRODUTO%3C%2Ftext%3E%3C%2Fsvg%3E'"`;

        this.db.accessories.forEach(acc => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide accessory-card';
            slide.innerHTML = `
                <div class="accessory-card-image-wrap">
                    <img src="${acc.image}" alt="${acc.name}" class="accessory-card-image" ${imgFallback}>
                </div>
                <div class="accessory-card-content">
                    <div>
                        <h3 class="accessory-card-title">${acc.name}</h3>
                        <p class="accessory-card-price">R$ ${acc.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                    </div>
                    <button class="btn-primary accessory-card-btn view-acc-btn" data-id="${acc.id}">Ver e Comprar</button>
                </div>
            `;
            wrapper.appendChild(slide);
        });

        wrapper.querySelectorAll('.view-acc-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const acc = this.db.accessories.find(a => a.id === id);
                this.openProductModal(acc);
            });
        });

        this.initAccessoriesSwiper();
    }

    initAccessoriesSwiper() {
        if (this.accSwiper) {
            this.accSwiper.destroy(true, true);
        }
        
        this.accSwiper = new Swiper('.accessoriesSwiper', {
            slidesPerView: 'auto',
            centeredSlides: true,
            spaceBetween: 16,
            grabCursor: true,
            pagination: {
                el: '.accessoriesSwiper .swiper-pagination',
                clickable: true,
            },
            effect: 'coverflow',
            coverflowEffect: {
                rotate: 0,
                stretch: 0,
                depth: 60,
                modifier: 1,
                slideShadows: false,
            },
        });
    }

    renderFAQ() {
        const container = document.getElementById('faq-container');
        if (!container || !this.db.faqs) return;
        container.innerHTML = '';

        this.db.faqs.forEach((faq, index) => {
            const item = document.createElement('div');
            item.className = 'faq-item';
            item.innerHTML = `
                <button class="faq-question" aria-expanded="false">
                    <span>${faq.question}</span>
                    <svg class="faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </button>
                <div class="faq-answer">
                    <p>${faq.answer}</p>
                </div>
            `;

            const btn = item.querySelector('.faq-question');
            btn.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');
                // Fechar outros para manter limpo
                container.querySelectorAll('.faq-item').forEach(i => {
                    i.classList.remove('active');
                    i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                });

                if (!isOpen) {
                    item.classList.add('active');
                    btn.setAttribute('aria-expanded', 'true');
                }
            });

            container.appendChild(item);
        });
    }

    openProductModal(product) {
        this.activeModalBike = product;
        const body = document.getElementById('modal-body');
        
        const specsHtml = product.specs ? product.specs.map(spec => `<li>${spec}</li>`).join('') : '';
        const specsSection = specsHtml ? `<h3 style="margin-top:16px;">Especificações Técnicas:</h3><ul class="specs-list">${specsHtml}</ul>` : '';
        const imgFallback = `onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22600%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20600%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22800%22%20height%3D%22600%22%20fill%3D%22%23333%22%3E%3C%2Frect%3E%3Ctext%20x%3D%22350%22%20y%3D%22300%22%20fill%3D%22%23666%22%20font-family%3D%22sans-serif%22%20font-size%3D%2240%22%3EIMG%3C%2Ftext%3E%3C%2Fsvg%3E'"`;

        const pixPrice = product.price * 0.95;
        const rates = (this.db.paymentConfig && this.db.paymentConfig.rates) || {};

        // Monta simulador de parcelas
        let installmentOptionsHtml = '';
        for (let i = 1; i <= 12; i++) {
            const rate = rates[i] || 0;
            const total = product.price * (1 + rate);
            const instVal = total / i;
            const tag = i <= 3 ? 'sem juros' : '';
            installmentOptionsHtml += `
                <option value="${i}" data-val="${instVal}" data-total="${total}">
                    ${i}x de R$ ${instVal.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} ${tag ? `(${tag})` : ''}
                </option>
            `;
        }

        body.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="modal-image" ${imgFallback}>
            <h2 class="modal-title">${product.name}</h2>
            
            <div class="modal-pricing-box">
                <div class="modal-main-price">
                    <span class="price-val">R$ ${product.price.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
                    <span class="price-badge-pix">⚡ R$ ${pixPrice.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} no Pix (5% OFF)</span>
                </div>
                
                <!-- Simulador de Parcelamento Interativo -->
                <div class="installment-calc-card">
                    <div class="calc-header">
                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                            <line x1="2" y1="10" x2="22" y2="10"></line>
                        </svg>
                        <span>Simulador no Cartão de Crédito</span>
                    </div>
                    
                    <div class="calc-selector-wrap">
                        <label for="installment-select">Escolha as parcelas:</label>
                        <select id="installment-select" class="installment-dropdown">
                            ${installmentOptionsHtml}
                        </select>
                    </div>
                    
                    <div class="calc-result" id="calc-result-display">
                        <div class="calc-highlight" id="calc-highlight-text">
                            <!-- Injetado dinamicamente via JS -->
                        </div>
                    </div>
                </div>
            </div>

            <p class="modal-desc">${product.description}</p>
            ${specsSection}
        `;

        // Ativa interatividade do simulador no modal
        const select = body.querySelector('#installment-select');
        const display = body.querySelector('#calc-highlight-text');

        const updateCalcDisplay = () => {
            const opt = select.options[select.selectedIndex];
            const times = select.value;
            const instVal = parseFloat(opt.getAttribute('data-val'));
            const total = parseFloat(opt.getAttribute('data-total'));
            const isNoInterest = parseInt(times) <= 3;

            display.innerHTML = `
                <div class="calc-amount">
                    <strong>${times}x de R$ ${instVal.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</strong>
                    ${isNoInterest ? '<span class="zero-interest-tag">SEM JUROS</span>' : ''}
                </div>
                <div class="calc-total-note">
                    Total: R$ ${total.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </div>
            `;
        };

        select.addEventListener('change', updateCalcDisplay);
        // Default inicial para 12x para mostrar a menor parcela mensal cabível
        select.value = "12";
        updateCalcDisplay();

        document.getElementById('product-modal').classList.add('open');
    }

    closeProductModal() {
        document.getElementById('product-modal').classList.remove('open');
        this.activeModalBike = null;
    }

    openCart() {
        document.getElementById('cart-sidebar').classList.add('open');
        document.getElementById('sidebar-overlay').classList.add('open');
    }

    closeCart() {
        document.getElementById('cart-sidebar').classList.remove('open');
        document.getElementById('sidebar-overlay').classList.remove('open');
    }

    updateCart() {
        const badge = document.getElementById('cart-badge');
        const count = this.cart.items.reduce((acc, i) => acc + i.quantity, 0);
        badge.textContent = count;
        
        badge.style.display = count > 0 ? 'flex' : 'none';

        const container = document.getElementById('cart-items');
        container.innerHTML = '';

        if (this.cart.items.length === 0) {
            container.innerHTML = '<p style="color:var(--text-muted);text-align:center;margin-top:20px;">Seu carrinho está vazio.</p>';
        } else {
            const imgFallback = `onerror="this.src='data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22800%22%20height%3D%22600%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20800%20600%22%20preserveAspectRatio%3D%22none%22%3E%3Crect%20width%3D%22800%22%20height%3D%22600%22%20fill%3D%22%23333%22%3E%3C%2Frect%3E%3Ctext%20x%3D%22350%22%20y%3D%22300%22%20fill%3D%22%23666%22%20font-family%3D%22sans-serif%22%20font-size%3D%2240%22%3EBIKE%3C%2Ftext%3E%3C%2Fsvg%3E'"`;

            this.cart.items.forEach(item => {
                const el = document.createElement('div');
                el.className = 'cart-item';
                el.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" ${imgFallback}>
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>R$ ${item.price.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
                        <span style="font-size:0.8rem;color:var(--text-muted)">Qtd: ${item.quantity}</span>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                `;
                container.appendChild(el);
            });

            container.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = parseInt(e.currentTarget.getAttribute('data-id'));
                    this.cart.remove(id);
                });
            });
        }

        document.getElementById('cart-total-price').textContent = `R$ ${this.cart.getTotal().toLocaleString('pt-BR', {minimumFractionDigits: 2})}`;
    }
}
