// ── Navbar scroll ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ── Mobile menu ──
function toggleMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
  document.body.style.overflow = menu.classList.contains('open') ? 'hidden' : '';
}

// ── Reveal on scroll ──
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => observer.observe(el));

// ── Testimonials carousel ──
const track = document.querySelector('.testimonials-track');
const dotsContainer = document.querySelector('.testi-dots');
let current = 0;
let cardWidth = 0;
let total = 0;

function getVisible() {
  return window.innerWidth <= 860 ? 1 : 3;
}

function updateCarousel() {
  if (!track) return;
  const cards = track.querySelectorAll('.testimonial-card');
  total = cards.length;
  if (total === 0) return;
  cardWidth = track.parentElement.offsetWidth;
  const gap = 24;
  const visible = getVisible();
  cards.forEach(c => {
    c.style.minWidth = visible === 1
      ? `${cardWidth}px`
      : `calc(${100 / visible}% - ${gap * (visible - 1) / visible}px)`;
  });
  const maxIndex = Math.max(0, total - visible);
  if (current > maxIndex) current = maxIndex;
  track.style.transform = `translateX(-${current * (cardWidth / visible + gap / visible)}px)`;
  if (dotsContainer) {
    dotsContainer.querySelectorAll('.testi-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }
}

function moveCarousel(dir) {
  if (!track) return;
  const visible = getVisible();
  const maxIndex = Math.max(0, total - visible);
  current = Math.min(Math.max(current + dir, 0), maxIndex);
  updateCarousel();
}

function buildDots() {
  if (!track || !dotsContainer) return;
  const cards = track.querySelectorAll('.testimonial-card');
  dotsContainer.innerHTML = '';
  cards.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => { current = i; updateCarousel(); });
    dotsContainer.appendChild(dot);
  });
}

if (track) {
  buildDots();
  updateCarousel();
  window.addEventListener('resize', updateCarousel);
  window.addEventListener('load', updateCarousel);

  // Touch / swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) moveCarousel(diff > 0 ? 1 : -1);
  });

  // Botões de seta
  document.querySelector('.testi-btn.prev')?.addEventListener('click', () => moveCarousel(-1));
  document.querySelector('.testi-btn.next')?.addEventListener('click', () => moveCarousel(1));
}
