const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

// Menu mobile
const menuToggle = $('.menu-toggle');
const mainNav = $('.main-nav');
menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.classList.toggle('menu-open', isOpen);
});

$$('.main-nav a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  document.body.classList.remove('menu-open');
}));

// Entrada suave dos blocos
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });

$$('.reveal').forEach(el => revealObserver.observe(el));

// Navegação secundária acompanha a seção atual
const trackedSections = ['recursos', 'display', 'controle', 'performance'];
const sectionMap = new Map(trackedSections.map(id => [id, document.getElementById(id)]));
const subLinks = $$('.subnav-links a');

const setActiveNav = (id) => {
  subLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${id}`));
};

const navObserver = new IntersectionObserver((entries) => {
  const visible = entries.filter(e => e.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible) setActiveNav(visible.target.id);
}, { threshold: [0.2, 0.45, 0.7], rootMargin: '-120px 0px -55% 0px' });
sectionMap.forEach(section => section && navObserver.observe(section));

// Tabs de modo de jogo
const modeData = {
  tv: {
    kicker: 'Modo TV',
    title: 'Leve a experiência para a tela grande.',
    text: 'Conecte à base e jogue com resolução de até 4K em títulos compatíveis.'
  },
  table: {
    kicker: 'Modo Mesa',
    title: 'Compartilhe a tela em qualquer lugar.',
    text: 'Abra o suporte, destaque os controles e transforme qualquer superfície em uma estação de jogo.'
  },
  portable: {
    kicker: 'Modo Portátil',
    title: 'Sua biblioteca sempre com você.',
    text: 'Tela QHD+, som estéreo e controles acoplados para continuar a partida fora de casa.'
  }
};

$$('.mode-tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const mode = tab.dataset.mode;
    $$('.mode-tab').forEach(t => {
      const active = t === tab;
      t.classList.toggle('active', active);
      t.setAttribute('aria-selected', String(active));
    });
    $$('.mode-visual').forEach(view => view.classList.toggle('active', view.classList.contains(`mode-${mode}`)));
    $('.mode-stage').dataset.activeMode = mode;
    $('.mode-kicker').textContent = modeData[mode].kicker;
    $('.mode-description h3').textContent = modeData[mode].title;
    $('.mode-text').textContent = modeData[mode].text;
  });
});

// Contador de performance
const meter = $('.meter-value');
let meterStarted = false;
const meterObserver = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting || meterStarted) return;
  meterStarted = true;
  const target = Number(meter.dataset.target || 3.8);
  const duration = 1300;
  const start = performance.now();
  const animate = now => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    meter.textContent = (target * eased).toFixed(1);
    if (p < 1) requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
}, { threshold: .6 });
if (meter) meterObserver.observe(meter);

// Modal de apresentação
const modal = $('#video-modal');
$('#open-video')?.addEventListener('click', () => modal?.showModal());
$('#close-video')?.addEventListener('click', () => modal?.close());
modal?.addEventListener('click', (e) => {
  const rect = modal.getBoundingClientRect();
  const outside = e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;
  if (outside) modal.close();
});

// Parallax leve do produto principal
const heroProduct = $('.hero-product');
if (heroProduct && matchMedia('(pointer:fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  heroProduct.addEventListener('pointermove', (e) => {
    const r = heroProduct.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    const consoleEl = $('.console-wrap', heroProduct);
    consoleEl.style.transform = `rotateX(${3 - y * 5}deg) rotateY(${-8 + x * 8}deg) translateY(-6px)`;
    consoleEl.style.animation = 'none';
  });
  heroProduct.addEventListener('pointerleave', () => {
    const consoleEl = $('.console-wrap', heroProduct);
    consoleEl.removeAttribute('style');
  });
}
