import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

(window as any).__motionReady = true;
gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T | null;
const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll(s)] as T[];

/* ---------- smooth scroll ---------- */
let lenis: Lenis | null = null;
if (!reduce) {
  lenis = new Lenis({ duration: 1.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
  const hash = a?.getAttribute('href');
  if (!a || !hash || hash.length < 2) return;
  const target = hash === '#top' ? 0 : $(hash);
  if (target === null) return;
  e.preventDefault();
  toggleMenu(false);
  if (lenis) lenis.scrollTo(target as any, { offset: -70 });
  else if (target === 0) scrollTo({ top: 0 });
  else (target as HTMLElement).scrollIntoView();
});

/* ---------- nav ---------- */
const nav = $('#nav')!;
const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 16);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

const pill = $('.pill');
const setActive = (id: string | null) => {
  let hit: HTMLElement | null = null;
  $$('[data-nav]').forEach((l) => {
    const on = l.dataset.nav === id;
    l.classList.toggle('is-active', on);
    if (on) hit = l;
  });
  if (!pill) return;
  if (hit) {
    const h = hit as HTMLElement;
    pill.style.width = `${h.offsetWidth}px`;
    pill.style.transform = `translateX(${h.offsetLeft}px)`;
    pill.style.opacity = '1';
  } else pill.style.opacity = '0';
};
['about', 'skills', 'work', 'experience', 'contact'].forEach((id) =>
  ScrollTrigger.create({ trigger: `#${id}`, start: 'top 45%', end: 'bottom 45%', onToggle: (s) => s.isActive && setActive(id) }),
);
ScrollTrigger.create({ trigger: '#top', start: 'top top', end: 'bottom 45%', onToggle: (s) => s.isActive && setActive(null) });

const menu = $('#menu');
const menuBtn = $('#menu-btn');
function toggleMenu(open: boolean) {
  if (!menu || !menuBtn) return;
  menu.hidden = !open;
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  if (open && !reduce) gsap.fromTo(menu.children, { y: -8, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.04, duration: 0.4, ease: 'power3.out' });
}
menuBtn?.addEventListener('click', () => toggleMenu(menu?.hidden ?? false));

/* ---------- headings rise word by word ---------- */
function splitWords(root: HTMLElement) {
  root.setAttribute('aria-label', root.textContent?.replace(/\s+/g, ' ').trim() ?? '');
  const walk = (node: Node) =>
    [...node.childNodes].forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        (child.textContent ?? '').split(/(\s+)/).forEach((p) => {
          if (!p) return;
          if (/^\s+$/.test(p)) return frag.appendChild(document.createTextNode(' '));
          const w = document.createElement('span');
          w.className = 'w';
          w.innerHTML = '<span class="w-inner"></span>';
          w.firstElementChild!.textContent = p;
          frag.appendChild(w);
        });
        child.replaceWith(frag);
      } else if ((child as Element).tagName !== 'BR') walk(child);
    });
  walk(root);
  root.classList.add('split');
  return $$('.w-inner', root);
}

const heroWords: HTMLElement[] = [];
$$('[data-split]').forEach((el) => {
  const words = splitWords(el);
  if (reduce) return;
  gsap.set(words, { yPercent: 110 });
  if (el.closest('.hero')) return void heroWords.push(...words);
  gsap.to(words, { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.05, scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
});

/* ---------- hero intro ---------- */
function countUp(el: HTMLElement, delay: number) {
  const to = Number(el.dataset.count);
  const o = { v: 0 };
  el.textContent = '0';
  gsap.to(o, { v: to, duration: 1.6, delay, ease: 'power3.out', onUpdate: () => (el.textContent = String(Math.round(o.v))) });
}

if (!reduce) {
  const heroBits = $$('[data-hero]');
  const lines = $$('.code .line');
  const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'expo.out' } });
  tl.to(heroBits[0], { opacity: 1, y: 0, duration: 1 }, 0)
    .to(heroWords, { yPercent: 0, duration: 1.2, stagger: 0.08 }, 0.1)
    .to(heroBits.slice(1), { opacity: 1, y: 0, duration: 1, stagger: 0.08 }, 0.45)
    .to(lines, { clipPath: 'inset(0 0% 0 0)', duration: 0.45, stagger: 0.09, ease: 'power2.out' }, 0.9);

  ScrollTrigger.batch('[data-stat]', {
    start: 'top 92%',
    once: true,
    onEnter: (els) => {
      gsap.to(els, { opacity: 1, y: 0, duration: 1, stagger: 0.08, ease: 'expo.out', delay: 0.6 });
      els.forEach((el, i) => {
        const n = el.querySelector<HTMLElement>('[data-count]');
        if (n) countUp(n, 0.7 + i * 0.08);
      });
    },
  });

  /* everything else fades up as it enters */
  ScrollTrigger.batch('[data-reveal]', {
    start: 'top 92%',
    once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });

  /* background glows drift slowly */
  gsap.to('.glow-a', { x: '12vw', y: '8vh', duration: 14, ease: 'sine.inOut', yoyo: true, repeat: -1 });
  gsap.to('.glow-b', { x: '-10vw', y: '-10vh', duration: 16, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  /* timeline line draws itself */
  const fill = $('[data-tl-fill]');
  if (fill) gsap.to(fill, { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '[data-timeline]', start: 'top 70%', end: 'bottom 70%', scrub: 0.4 } });
  $$('[data-tl-item]').forEach((it) =>
    ScrollTrigger.create({ trigger: it, start: 'top 70%', onEnter: () => it.classList.add('is-on'), onLeaveBack: () => it.classList.remove('is-on') }),
  );
} else {
  $$('[data-tl-item]').forEach((it) => it.classList.add('is-on'));
  const fill = $('[data-tl-fill]');
  if (fill) fill.style.transform = 'none';
}

/* ---------- code card tilts toward the pointer ---------- */
const tiltEl = $('[data-tilt]');
if (tiltEl && finePointer && !reduce) {
  const rx = gsap.quickTo(tiltEl, 'rotationX', { duration: 0.8, ease: 'power3.out' });
  const ry = gsap.quickTo(tiltEl, 'rotationY', { duration: 0.8, ease: 'power3.out' });
  $('.hero')!.addEventListener('pointermove', (e) => {
    rx(-((e.clientY / innerHeight) * 2 - 1) * 7);
    ry(((e.clientX / innerWidth) * 2 - 1) * 10);
  });
}

/* ---------- screenshot lightbox ---------- */
const lightbox = $<HTMLDialogElement>('#lightbox');
if (lightbox) {
  const img = lightbox.querySelector('img')!;
  $$('[data-full]').forEach((b) =>
    b.addEventListener('click', () => {
      img.src = b.dataset.full!;
      img.alt = b.dataset.alt ?? '';
      lightbox.showModal();
      lenis?.stop();
      if (!reduce) gsap.fromTo(img, { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'expo.out' });
    }),
  );
  lightbox.addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('close', () => lenis?.start());
}

/* ---------- copy email ---------- */
const toast = $('.toast');
let toastTimer = 0;
$$('[data-copy]').forEach((b) =>
  b.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(b.dataset.copy!);
      if (toast) toast.textContent = '✓ Email copied';
    } catch {
      if (toast) toast.textContent = b.dataset.copy!;
    }
    toast?.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast?.classList.remove('show'), 2000);
  }),
);

document.fonts?.ready.then(() => ScrollTrigger.refresh());
