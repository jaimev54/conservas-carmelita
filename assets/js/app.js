(function(){
  // ===== Helpers =====
  const $  = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  const money = v => v.toLocaleString('es-MX', { style: 'currency', currency: 'MXN' });

  // ===== Estado (localStorage) =====
  const CART_KEY = 'cc_cart';
  const getCart = () => {
    try { return new Map(JSON.parse(localStorage.getItem(CART_KEY) || '[]')); }
    catch { return new Map(); }
  };
  const saveCart = map => localStorage.setItem(CART_KEY, JSON.stringify(Array.from(map.entries())));

  // ===== Carrito (acciones) =====
  function addToCart(product, qty){
    const cart = getCart();
    const prev = cart.get(product.id) || { qty:0, product };
    prev.qty += qty;
    cart.set(product.id, prev);
    saveCart(cart);
    updateNavCount();
  }
  function removeFromCart(id){
    const cart = getCart();
    cart.delete(id);
    saveCart(cart);
  }
  function setQty(id, qty){
    const cart = getCart();
    const item = cart.get(id);
    if(!item) return;
    item.qty = Math.max(1, qty || 1);
    cart.set(id, item);
    saveCart(cart);
  }
  function totals(){
    const cart = getCart();
    let items = 0, subtotal = 0;
    for(const {qty, product} of cart.values()){
      items += qty; subtotal += product.price * qty;
    }
    return { items, subtotal };
  }
  function updateNavCount(){
    const { items } = totals();
    const el = $('#navCartCount');
    if(el) el.textContent = items;
  }

  // ===== Catálogo =====
  function renderCatalog(){
    if(!window.__PRODUCTS__) return;
    const list = $('#catalog'); if(!list) return;

    const term = ($('#searchInput')?.value || '').toLowerCase();
    const cat  = ($('#categoryFilter')?.value || '');

    const filtered = window.__PRODUCTS__.filter(p=>{
      const okC = !cat || p.category === cat;
      const okT = !term || (p.name||'').toLowerCase().includes(term);
      return okC && okT;
    });

    list.innerHTML = '';

    if(filtered.length === 0){
      list.innerHTML = `
        <div class="card" style="grid-column:1/-1; text-align:center;">
          <h3>No hay productos para mostrar</h3>
          <div class="card__meta">Quita filtros o verifica el catálogo.</div>
        </div>`;
      return;
    }

    filtered.forEach(p=>{
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img class="card__img"
             src="${p.image}"
             alt="${p.name}"
             loading="lazy"
             decoding="async"
             onerror="if(!this.dataset.fallback){ this.dataset.fallback=1; this.src='/assets/img/placeholder.jpg'; }" />
        <h3>${p.name}</h3>
        <div class="card__meta">${p.unit} • ${money(p.price)}</div>
        <div style="display:flex;gap:10px;align-items:center">
          <div class="qty">
            <button type="button" data-action="dec">−</button>
            <input type="number" min="1" value="1" />
            <button type="button" data-action="inc">+</button>
          </div>
          <button class="btn btn--green" data-action="add">Agregar</button>
        </div>
      `;

      const input  = card.querySelector('input');
      const decBtn = card.querySelector('[data-action="dec"]');
      const incBtn = card.querySelector('[data-action="inc"]');
      const addBtn = card.querySelector('[data-action="add"]');

      decBtn.onclick = () => input.value = Math.max(1, (parseInt(input.value)||1) - 1);
      incBtn.onclick = () => input.value = (parseInt(input.value)||1) + 1;

      // Feedback del botón Agregar (1.5s)
      addBtn.onclick = () => {
        const qty = parseInt(input.value) || 1;
        addToCart(p, qty);

        const originalText = addBtn.textContent;
        addBtn.disabled = true;
        addBtn.classList.add('btn--added'); // usa animación definida en CSS
        addBtn.textContent = 'Agregado ✓';

        setTimeout(()=>{
          addBtn.classList.remove('btn--added');
          addBtn.textContent = originalText;
          addBtn.disabled = false;
        }, 1500);
      };

      list.appendChild(card);
    });
  }

  // ===== Carrito =====
  function renderCart(){
    const list = $('#cartList'); if(!list) return;
    const cart = getCart();
    list.innerHTML='';

    for(const {qty, product} of cart.values()){
      const row = document.createElement('div');
      row.className = 'cartlist__row';
      row.innerHTML = `
        <div>
          <strong>${product.name}</strong>
          <div class="card__meta">${product.unit} • ${money(product.price)}</div>
        </div>
        <input type="number" min="1" value="${qty}" style="width:70px;padding:8px;border:1px solid #e5e7eb;border-radius:8px" />
        <div style="min-width:100px;text-align:right">${money(product.price*qty)}</div>
        <button class="btn btn--ghost" aria-label="Eliminar">✕</button>
      `;
      const [qtyInput, delBtn] = [row.children[1], row.children[3]];
      qtyInput.addEventListener('change', e => { setQty(product.id, parseInt(e.target.value)||1); renderCart(); });
      delBtn.addEventListener('click', () => { removeFromCart(product.id); renderCart(); });
      list.appendChild(row);
    }

    const { subtotal } = totals();
    const totalEl = $('#cartTotal');
    if(totalEl) totalEl.textContent = `Total: ${money(subtotal)}`;
  }

  // ===== WhatsApp =====
  function buildWhatsAppMessage(){
    const cart = getCart(); if(cart.size===0) return '';
    let lines = [];
    lines.push('Hola, me gustaría cotizar los siguientes productos de *Conservas Carmelita*:\n');
    for(const {qty,product} of cart.values()){
      lines.push(`• ${product.name}  x${qty}  (${money(product.price)} c/u)`);
    }
    const { subtotal } = totals();
    lines.push('\n' + `Subtotal estimado: ${money(subtotal)}` + '\n');
    lines.push('Mi nombre:');
    lines.push('Opcional: Método de entrega (recoger/envío) y ciudad:');
    return encodeURIComponent(lines.join('\n'));
  }
  function openWhatsApp(){
    const msg = buildWhatsAppMessage(); if(!msg) return;
    const url = `https://wa.me/${window.__WA_NUMBER__}?text=${msg}`;
    window.open(url, '_blank');
  }
  window.openWhatsAppFromContact = openWhatsApp;

  // ===== Inicio (destacados) =====
  function renderFeatured(){
    const featured = $('#featured');
    if(!featured || !window.__PRODUCTS__) return;
    featured.innerHTML='';
    const items = window.__PRODUCTS__.slice(0,4);
    items.forEach(p=>{
      const card=document.createElement('article');
      card.className='card';
      card.innerHTML=`
        <img class="card__img"
             src="${p.image}"
             alt="${p.name}"
             loading="lazy"
             decoding="async"
             onerror="if(!this.dataset.fallback){ this.dataset.fallback=1; this.src='/assets/img/placeholder.jpg'; }" />
        <h3>${p.name}</h3>
        <div class='card__meta'>${p.unit} • ${money(p.price)}</div>`;
      featured.appendChild(card);
    });
  }

  // ===== Init =====
  function init(){
    renderFeatured();

    if($('#catalog')){
      renderCatalog();

      const $search = $('#searchInput');
      const $cat    = $('#categoryFilter');
      const $clear  = $('#clearFilters');

      $search?.addEventListener('input', renderCatalog);
      $cat?.addEventListener('change', renderCatalog);
      $clear?.addEventListener('click', (e)=>{
        e.preventDefault();
        if($search){ $search.value=''; $search.dispatchEvent(new Event('input', {bubbles:true})); }
        if($cat){ $cat.selectedIndex = 0; $cat.dispatchEvent(new Event('change', {bubbles:true})); }
        renderCatalog();
      });
    }

    if($('#cartList')){
      renderCart();
      $('#sendCart')?.addEventListener('click', openWhatsApp);
    }

    updateNavCount();
    const y=$('#year'); if(y) y.textContent=new Date().getFullYear();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init, { once:true });
  } else {
    init();
  }
})();
