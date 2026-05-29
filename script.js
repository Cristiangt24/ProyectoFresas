/* ═══════════════════════════════════════════
   FRESAS CON CREMA — Global Script
═══════════════════════════════════════════ */

/* ── PRODUCTS ── */
const PRODUCTS = [
  {id:1,name:"Fresas con Crema Clásico",desc:"Fresas frescas con crema batida artesanal y vainilla.",price:12900,emoji:"🍓",tag:"Más vendido",cat:"clasicos"},
  {id:2,name:"Melocotón con Crema",desc:"Melocotones en almíbar casero con crema y canela.",price:13500,emoji:"🍑",tag:"",cat:"clasicos"},
  {id:3,name:"Cereza con Crema",desc:"Cerezas negras frescas con mascarpone y cacao.",price:15900,emoji:"🍒",tag:"Nuevo",cat:"especiales"},
  {id:4,name:"Mango con Crema",desc:"Mango Tommy maduro con crema de coco y lima.",price:13900,emoji:"🥭",tag:"",cat:"clasicos"},
  {id:5,name:"Fresas & Chocolate",desc:"Fresas bañadas en chocolate belga con chantilly.",price:14900,emoji:"🍫",tag:"",cat:"especiales"},
  {id:6,name:"Copa Tropical",desc:"Mango, cereza y fresas con crema de maracuyá.",price:17900,emoji:"🌴",tag:"Especial",cat:"especiales"},
  {id:7,name:"Fresas con Arequipe",desc:"Fresas frescas bañadas en arequipe artesanal.",price:13500,emoji:"🍯",tag:"",cat:"clasicos"},
  {id:8,name:"Parfait de Fresas",desc:"Capas de crema, granola casera y fresas frescas.",price:16900,emoji:"🥤",tag:"",cat:"especiales"},
  {id:9,name:"Helado de Fresas",desc:"Helado artesanal de fresas con trozos reales.",price:11900,emoji:"🍦",tag:"",cat:"helados"},
  {id:10,name:"Paleta de Fresa",desc:"Paleta de fresas naturales sin colorantes.",price:7900,emoji:"🧊",tag:"",cat:"helados"},
  {id:11,name:"Smoothie de Fresas",desc:"Batido de fresas con leche de almendras.",price:10900,emoji:"🥤",tag:"",cat:"bebidas"},
  {id:12,name:"Limonada de Fresas",desc:"Limonada fría con fresas y menta fresca.",price:9900,emoji:"🍋",tag:"",cat:"bebidas"},
];

/* ── CART ── */
let cart = JSON.parse(localStorage.getItem('fsc_cart') || '[]');

function saveCart(){ localStorage.setItem('fsc_cart', JSON.stringify(cart)); updateCartUI(); }

function addToCart(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const ex = cart.find(x=>x.id===id);
  if(ex) ex.qty++; else cart.push({id,qty:1});
  saveCart();
  showToast('🍓 '+p.name+' añadido');
  bumpCount();
}

function removeFromCart(id){
  cart = cart.filter(x=>x.id!==id);
  saveCart();
}

function changeQty(id, delta){
  const item = cart.find(x=>x.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) removeFromCart(id); else saveCart();
}

function cartTotal(){ return cart.reduce((s,i)=>{ const p=PRODUCTS.find(x=>x.id===i.id); return s+(p?p.price*i.qty:0); },0); }
function cartCount(){ return cart.reduce((s,i)=>s+i.qty,0); }

function updateCartUI(){
  // count badge
  const countEls = document.querySelectorAll('.cart-count');
  countEls.forEach(el=>el.textContent=cartCount());
  // render drawer items if it exists
  const body = document.getElementById('drawerBody');
  if(!body) return;
  if(cart.length===0){
    body.innerHTML='<div class="empty-msg"><div class="big">🛒</div>Tu carrito está vacío</div>';
  } else {
    body.innerHTML = cart.map(item=>{
      const p = PRODUCTS.find(x=>x.id===item.id);
      if(!p) return '';
      return `<div class="cart-item">
        <div class="ci-emoji">${p.emoji}</div>
        <div class="ci-info"><h4>${p.name}</h4><span>$${(p.price*item.qty).toLocaleString('es-CO')}</span></div>
        <div class="ci-controls">
          <button class="ci-btn" onclick="changeQty(${p.id},-1)">−</button>
          <span class="ci-qty">${item.qty}</span>
          <button class="ci-btn" onclick="changeQty(${p.id},1)">+</button>
          <button class="ci-del" onclick="removeFromCart(${p.id})">🗑</button>
        </div>
      </div>`;
    }).join('');
  }
  const footer = document.getElementById('drawerFooter');
  if(!footer) return;
  const del = 5000, total = cartTotal();
  footer.innerHTML = `
    <div class="subtotal-row"><span>Subtotal</span><span>$${total.toLocaleString('es-CO')}</span></div>
    <div class="subtotal-row"><span>Domicilio</span><span>${total>=50000?'<span style="color:var(--green)">Gratis</span>':'$'+del.toLocaleString('es-CO')}</span></div>
    <div class="subtotal-row total"><span>Total</span><span>$${(total+(total>=50000?0:del)).toLocaleString('es-CO')}</span></div>
    <button class="checkout-btn" ${cart.length===0?'disabled':''} onclick="checkout()">Pagar ahora 🍓</button>`;
}

function checkout(){
  if(cart.length===0) return;
  cart=[];
  saveCart();
  closeDrawer();
  showToast('✅ ¡Pedido realizado con éxito!');
}

/* ── DRAWER ── */
function openDrawer(){
  document.getElementById('cartDrawer')?.classList.add('open');
  document.getElementById('overlay')?.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeDrawer(){
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.getElementById('overlay')?.classList.remove('open');
  document.body.style.overflow='';
}

/* ── TOAST ── */
let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent=msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),2500);
}

/* ── COUNT BUMP ANIMATION ── */
function bumpCount(){
  document.querySelectorAll('.cart-count').forEach(el=>{
    el.classList.remove('bump');
    void el.offsetWidth;
    el.classList.add('bump');
    setTimeout(()=>el.classList.remove('bump'),300);
  });
}

/* ── NAV ── */
window.addEventListener('scroll',()=>{
  document.getElementById('mainNav')?.classList.toggle('scrolled', scrollY>50);
});

/* ── DOTS (home hero) ── */
function initDots(){
  const c = document.getElementById('dots');
  if(!c) return;
  for(let i=0;i<18;i++){
    const d=document.createElement('div');
    d.className='dot';
    const s=Math.random()*12+4;
    d.style.cssText=`width:${s}px;height:${s}px;top:${Math.random()*100}%;left:${Math.random()*100}%;opacity:${Math.random()*.35+.1}`;
    c.appendChild(d);
  }
}

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const t=document.querySelector(a.getAttribute('href'));
  if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}
}));

/* ── FADE ON SCROLL ── */
function initFadeObserver(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.style.animation='fadeUp .5s both'; e.target.style.opacity='1'; }
    });
  },{threshold:.1});
  document.querySelectorAll('.menu-card,.why-card,.testi-card,.product-card').forEach((el,i)=>{
    el.style.opacity='0';
    el.style.animationDelay=`${i*0.07}s`;
    obs.observe(el);
  });
}

/* ── TIENDA: RENDER PRODUCTS ── */
function renderProducts(filter='all'){
  const grid = document.getElementById('productsGrid');
  if(!grid) return;
  const list = filter==='all' ? PRODUCTS : PRODUCTS.filter(p=>p.cat===filter);
  grid.innerHTML = list.map(p=>`
    <div class="product-card" data-cat="${p.cat}">
      <div class="pc-img">${p.emoji}${p.tag?`<span class="pc-badge">${p.tag}</span>`:''}
      </div>
      <div class="pc-body">
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
        <div class="pc-footer">
          <div class="pc-price">$${p.price.toLocaleString('es-CO')}</div>
          <button class="pc-add" onclick="addToCart(${p.id})">+</button>
        </div>
      </div>
    </div>`).join('');
  setTimeout(initFadeObserver, 50);
}

/* ── TIENDA: FILTERS ── */
function initFilters(){
  document.querySelectorAll('.filter-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      renderProducts(btn.dataset.filter);
    });
  });
}

/* ── SUGERENCIAS: STARS ── */
function initStars(){
  const stars = document.querySelectorAll('.rating-star');
  stars.forEach((star,i)=>{
    star.addEventListener('click',()=>{
      stars.forEach((s,j)=>s.classList.toggle('active',j<=i));
      document.getElementById('ratingVal').value=i+1;
    });
    star.addEventListener('mouseenter',()=>stars.forEach((s,j)=>s.style.opacity=j<=i?'1':'.3'));
    star.addEventListener('mouseleave',()=>stars.forEach(s=>s.style.opacity=s.classList.contains('active')?'1':'.4'));
  });
}

/* ── SUGERENCIAS: CATEGORIES ── */
function initSugCats(){
  document.querySelectorAll('.sug-cat').forEach(cat=>{
    cat.addEventListener('click',()=>{
      document.querySelectorAll('.sug-cat').forEach(c=>c.classList.remove('active'));
      cat.classList.add('active');
      const inp = document.getElementById('sugCategory');
      if(inp) inp.value=cat.dataset.cat;
    });
  });
}

/* ── AUTH: PASSWORD TOGGLE ── */
function togglePwd(id,btn){
  const inp = document.getElementById(id);
  if(!inp) return;
  const show = inp.type==='password';
  inp.type = show?'text':'password';
  btn.textContent = show?'🙈':'👁';
}

/* ── AUTH: PASSWORD STRENGTH ── */
function checkStrength(val){
  const fill = document.getElementById('strengthFill');
  if(!fill) return;
  let score=0;
  if(val.length>=8) score++;
  if(/[A-Z]/.test(val)) score++;
  if(/[0-9]/.test(val)) score++;
  if(/[^A-Za-z0-9]/.test(val)) score++;
  const colors=['#e05555','#e8a84a','#e8a84a','#2db87a','#2db87a'];
  const widths=['20%','40%','60%','80%','100%'];
  fill.style.width=widths[score];
  fill.style.background=colors[score];
}

/* ── CONTACT FORM ── */
function initContactForm(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    showToast('✅ Mensaje enviado, ¡gracias!');
    form.reset();
  });
}

/* ── SUGERENCIAS FORM ── */
function initSugForm(){
  const form = document.getElementById('sugForm');
  if(!form) return;
  form.addEventListener('submit',e=>{
    e.preventDefault();
    showToast('💌 ¡Sugerencia enviada, gracias!');
    form.reset();
    document.querySelectorAll('.sug-cat').forEach(c=>c.classList.remove('active'));
    document.querySelectorAll('.rating-star').forEach(s=>s.classList.remove('active'));
  });
}

/* ── AUTH FORMS ── */
function initAuthForms(){
  const loginForm = document.getElementById('loginForm');
  if(loginForm){
    loginForm.addEventListener('submit',e=>{
      e.preventDefault();
      showToast('✅ ¡Bienvenida de nuevo!');
      setTimeout(()=>window.location.href='index.html',1200);
    });
  }
  const regForm = document.getElementById('regForm');
  if(regForm){
    regForm.addEventListener('submit',e=>{
      e.preventDefault();
      showToast('🎉 ¡Cuenta creada con éxito!');
      setTimeout(()=>window.location.href='index.html',1200);
    });
  }
}

/* ── ACTIVE NAV LINK ── */
function highlightNav(){
  const page = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a=>{
    const href = a.getAttribute('href');
    if(href===page || (page===''&&href==='index.html')) a.classList.add('active');
  });
}

/* ── INIT ── */
document.addEventListener('DOMContentLoaded',()=>{
  updateCartUI();
  initDots();
  initFadeObserver();
  initFilters();
  renderProducts();
  initStars();
  initSugCats();
  initContactForm();
  initSugForm();
  initAuthForms();
  highlightNav();

  // cart button
  document.getElementById('cartBtn')?.addEventListener('click', openDrawer);
  document.getElementById('overlay')?.addEventListener('click', closeDrawer);
  document.getElementById('closeDrawer')?.addEventListener('click', closeDrawer);

  // home mc-add buttons
  document.querySelectorAll('.mc-add').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id=parseInt(btn.dataset.id);
      if(id) addToCart(id); else {
        const name=btn.closest('.menu-card').querySelector('h3').textContent;
        showToast('🍓 '+name+' — ve a la tienda para añadir al carrito');
      }
    });
  });
});
