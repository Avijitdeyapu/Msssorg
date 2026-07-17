/* ---------- Mobile nav toggle ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a =>
    a.addEventListener('click', () => navLinks.classList.remove('open'))
  );
}

/* ---------- 3D tilt effect for cards ---------- */
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2, cy = rect.height / 2;
    const rotateY = ((x - cx) / cx) * 7;
    const rotateX = -((y - cy) / cy) * 7;
    card.style.transform = `translateY(-8px) scale(1.015) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ---------- Hero parallax (banyan tree + text depth) ---------- */
const heroSection = document.querySelector('.hero');
const banyanWrap = document.querySelector('.banyan-wrap');
const heroContent = document.querySelector('.hero-content');
if (heroSection && banyanWrap) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    banyanWrap.style.transform = `translate(${x * 22}px, ${y * 12}px) scale(1.03)`;
    if (heroContent) heroContent.style.transform = `translate(${x * -12}px, ${y * -7}px)`;
  });
  heroSection.addEventListener('mouseleave', () => {
    banyanWrap.style.transform = '';
    if (heroContent) heroContent.style.transform = '';
  });
}

/* ---------- Bengali digit helpers ---------- */
const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
function bnToNumber(str) {
  return parseInt(str.replace(/[০-৯]/g, d => BN_DIGITS.indexOf(d)), 10);
}
function toBengaliDigits(num) {
  return String(num).replace(/\d/g, d => BN_DIGITS[d]);
}

/* ---------- Animated stat counters ---------- */
const statFigures = document.querySelectorAll('.stat .figure');
if (statFigures.length && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const original = el.textContent;
        const match = original.match(/[০-৯]+/);
        if (match) {
          const target = bnToNumber(match[0]);
          const suffix = original.replace(match[0], '');
          let current = 0;
          const step = Math.max(1, Math.round(target / 36));
          const timer = setInterval(() => {
            current += step;
            if (current >= target) {
              current = target;
              clearInterval(timer);
            }
            el.textContent = toBengaliDigits(current) + suffix;
          }, 28);
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });
  statFigures.forEach(el => observer.observe(el));
}
