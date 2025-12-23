/* =========================
   NAV: Hamburger & Dropdown
   ========================= */
// Mobile hamburger toggle
const btnHamburger = document.getElementById('btnHamburger');
const primaryMenu  = document.getElementById('primaryMenu');

btnHamburger?.addEventListener('click', () => {
  const expanded = btnHamburger.getAttribute('aria-expanded') === 'true';
  btnHamburger.setAttribute('aria-expanded', String(!expanded));
  primaryMenu.classList.toggle('show');
});

// Dropdown (desktop & mobile)
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownMenu   = document.querySelector('.dropdown-menu');

function closeDropdown() {
  if (!dropdownToggle || !dropdownMenu) return;
  dropdownToggle.setAttribute('aria-expanded', 'false');
  dropdownMenu.style.display = 'none';
}
function openDropdown() {
  if (!dropdownToggle || !dropdownMenu) return;
  dropdownToggle.setAttribute('aria-expanded', 'true');
  dropdownMenu.style.display = 'block';
}

dropdownToggle?.addEventListener('click', () => {
  const expanded = dropdownToggle.getAttribute('aria-expanded') === 'true';
  expanded ? closeDropdown() : openDropdown();
});

// Tutup dropdown saat klik di luar
document.addEventListener('click', (e) => {
  if (!e.target.closest('.dropdown')) closeDropdown();
});

// Tutup dropdown saat tekan Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDropdown();
    // tutup menu mobile juga
    if (primaryMenu?.classList.contains('show')) {
      primaryMenu.classList.remove('show');
      btnHamburger?.setAttribute('aria-expanded', 'false');
    }
  }
});

// Auto-tutup menu ketika viewport > 900px
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    if (window.innerWidth > 900 && primaryMenu?.classList.contains('show')) {
      primaryMenu.classList.remove('show');
      btnHamburger?.setAttribute('aria-expanded', 'false');
    }
  }, 120);
});

// Preferensi gerak pengguna
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('reduce-motion');
}

/* =========================
   SMOOTH SCROLL (anchor lokal)
   ========================= */
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    // jika dari mobile menu, tutup setelah klik
    if (primaryMenu?.classList.contains('show')) {
      primaryMenu.classList.remove('show');
      btnHamburger?.setAttribute('aria-expanded', 'false');
    }
  });
});

/* =========================
   ARTIKEL: Render via Loop
   ========================= */
const articleListEl = document.getElementById('articleList');

// Contoh data artikel tambahan
const extraArticles = [
  {
    title: '5 Pola Layout Flexbox untuk Dashboard Modern',
    dateISO: '2025-08-15',
    dateText: '15 Agustus 2025',
    read: '5 menit baca',
    excerpt: 'Mulai dari header-content-aside hingga grid kartu responsif, semua hanya dengan Flexbox tanpa framework berat.',
    tags: ['#Flexbox', '#Layout', '#Dashboard']
  },
  {
    title: 'Checklist Aksesibilitas Dasar untuk Web Dev',
    dateISO: '2025-08-10',
    dateText: '10 Agustus 2025',
    read: '4 menit baca',
    excerpt: 'Skip link, heading berhierarki, label form, kontras warna—ringan tapi berdampak besar pada pengalaman pengguna.',
    tags: ['#A11y', '#Semantic', '#UX']
  },
  {
    title: 'Komponen Kartu Reusable: Token & Variasi',
    dateISO: '2025-08-05',
    dateText: '5 Agustus 2025',
    read: '6 menit baca',
    excerpt: 'Bangun komponen kartu yang konsisten dengan token warna, radius, dan bayangan supaya UI mudah dipelihara.',
    tags: ['#Component', '#DesignToken', '#UI']
  }
];

function renderArticles(list) {
  if (!articleListEl || !Array.isArray(list)) return;
  const frag = document.createDocumentFragment();

  list.forEach((item, idx) => {
    const art = document.createElement('article');
    art.className = 'card';
    art.setAttribute('aria-labelledby', `ax-${idx}-title`);

    // Header
    const header = document.createElement('header');
    const h3 = document.createElement('h3');
    h3.id = `ax-${idx}-title`;
    h3.textContent = item.title;

    const meta = document.createElement('p');
    const time = document.createElement('time');
    time.setAttribute('datetime', item.dateISO);
    time.textContent = item.dateText;
    meta.appendChild(time);
    meta.insertAdjacentText('beforeend', ` • ${item.read}`);

    header.appendChild(h3);
    header.appendChild(meta);

    // Excerpt
    const p = document.createElement('p');
    p.textContent = item.excerpt;

    // Tags
    const ul = document.createElement('ul');
    ul.className = 'hero-highlights';
    ul.setAttribute('aria-label', 'Tag');
    item.tags.forEach((t) => {
      const li = document.createElement('li');
      li.textContent = t;
      ul.appendChild(li);
    });

    art.appendChild(header);
    art.appendChild(p);
    art.appendChild(ul);
    frag.appendChild(art);
  });

  articleListEl.innerHTML = '';
  articleListEl.appendChild(frag);
}

renderArticles(extraArticles);

/* =========================
   NEWSLETTER: Validasi & Pesan
   ========================= */
const newsForm = document.getElementById('newsForm');
const emailInput = document.getElementById('email');
const newsMsg = document.getElementById('newsMsg');

function isEmailValid(value) {
  // regex sederhana, cukup untuk demo
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

newsForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = (emailInput?.value || '').trim();

  if (!email) {
    newsMsg.textContent = 'Email wajib diisi.';
    newsMsg.style.color = '#b91c1c'; // merah
    emailInput?.focus();
    return;
  }

  if (!isEmailValid(email)) {
    newsMsg.textContent = 'Format email tidak valid.';
    newsMsg.style.color = '#b91c1c';
    emailInput?.focus();
    return;
  }

  // sukses (simulasi)
  newsMsg.textContent = 'Terima kasih! Kamu sudah berlangganan newsletter 🎉';
  newsMsg.style.color = '#065f46'; // hijau gelap
  newsForm.reset();

  // Matikan pesan setelah beberapa detik (opsional)
  setTimeout(() => {
    if (newsMsg) newsMsg.textContent = '';
  }, 4000);
});