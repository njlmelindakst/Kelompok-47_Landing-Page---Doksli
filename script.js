/* ============================================================
   script.js — DokVerify Landing Page
   ============================================================ */

/* ─── 1. ANIMATED PARTICLE BACKGROUND ─── */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W, H;
const particles = [];

function resizeCanvas() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Buat 60 partikel dengan posisi dan kecepatan acak
for (let i = 0; i < 60; i++) {
  particles.push({
    x: Math.random() * 2000,
    y: Math.random() * 1200,
    r: Math.random() * 1.5 + 0.3,
    vx: (Math.random() - 0.5) * 0.3,
    vy: (Math.random() - 0.5) * 0.3,
    alpha: Math.random() * 0.6 + 0.1
  });
}

function drawBackground() {
  ctx.clearRect(0, 0, W, H);

  // Radial glow kanan atas
  const glow1 = ctx.createRadialGradient(W * 0.7, H * 0.2, 0, W * 0.7, H * 0.2, W * 0.6);
  glow1.addColorStop(0, 'rgba(37,99,235,0.12)');
  glow1.addColorStop(1, 'transparent');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, W, H);

  // Radial glow kiri bawah
  const glow2 = ctx.createRadialGradient(W * 0.1, H * 0.8, 0, W * 0.1, H * 0.8, W * 0.4);
  glow2.addColorStop(0, 'rgba(37,99,235,0.07)');
  glow2.addColorStop(1, 'transparent');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, W, H);

  // Gambar dan gerakkan partikel
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x % W, p.y % H, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(96,165,250,${p.alpha})`;
    ctx.fill();
    p.x += p.vx;
    p.y += p.vy;
  });

  requestAnimationFrame(drawBackground);
}
drawBackground();


/* ─── 2. NAVBAR SHRINK SAAT SCROLL ─── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  // Tambah class 'scrolled' jika sudah scroll lebih dari 40px
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});


/* ─── 3. SCROLL REVEAL (elemen muncul saat di-scroll) ─── */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // stop observe setelah muncul
    }
  });
}, { threshold: 0.15 });

revealElements.forEach(el => revealObserver.observe(el));

/* ─── 4. RIPPLE EFFECT PADA TOMBOL ─── */
document.querySelectorAll('button').forEach(btn => {
  btn.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      left: ${e.clientX - rect.left}px;
      top: ${e.clientY - rect.top}px;
      width: 0;
      height: 0;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      animation: ripple 0.5s ease-out forwards;
      pointer-events: none;
    `;

    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);

    // Hapus elemen ripple setelah animasi selesai
    setTimeout(() => ripple.remove(), 500);
  });
});

// ─── CAROUSEL ───
const carousel = document.getElementById('featCarousel');
const prevBtn  = document.getElementById('prevBtn');
const nextBtn  = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');

const totalCards = carousel.children.length; // 6
let current = 0;

// Buat dots
for (let i = 0; i < totalCards; i++) {
  const dot = document.createElement('div');
  dot.classList.add('dot');
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goTo(i));
  dotsContainer.appendChild(dot);
}

function goTo(index) {
  current = index;
  const cardWidth = carousel.parentElement.offsetWidth; // +gap
  carousel.style.transform = `translateX(-${current * cardWidth}px)`;
  
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === totalCards - 1;

  document.querySelectorAll('.carousel-dots .dot').forEach((d, i) => {
    d.classList.toggle('active', i === current);
  });
}

prevBtn.addEventListener('click', () => { if (current > 0) goTo(current - 1); });
nextBtn.addEventListener('click', () => { if (current < totalCards - 1) goTo(current + 1); });

window.addEventListener('resize', () => goTo(current)); // Recalculate position saat resize

goTo(0);