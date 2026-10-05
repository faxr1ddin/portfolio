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

  /* project phones rise as the cards scroll into view */
  $$('[data-rise]').forEach((el) =>
    gsap.fromTo(el, { yPercent: 18 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: el.closest('.project'), start: 'top bottom', end: 'center 55%', scrub: true } }),
  );

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

/* ---------- live Quronim demo inside the project card ---------- */
const MEMBERS = [
  { n: 'Aziz', i: 'A', c: '#3b82f6' },
  { n: 'Madina', i: 'M', c: '#ec4899' },
  { n: 'Bilol', i: 'B', c: '#10b981' },
  { n: 'Sevara', i: 'S', c: '#f59e0b' },
  { n: 'Umar', i: 'U', c: '#8b5cf6' },
  { n: 'Zarina', i: 'Z', c: '#ef4444' },
];
const RING_C = 2 * Math.PI * 42;

class HatmSim {
  root: HTMLElement;
  cells: HTMLElement[];
  ring: SVGCircleElement | null;
  count: HTMLElement | null;
  pct: HTMLElement | null;
  feedText: HTMLElement | null;
  feedDot: HTMLElement | null;
  banner: HTMLElement | null;
  bannerText: HTMLElement | null;
  initial: { cls: string; badge: string; bg: string }[];
  owner = new Map<number, number>();
  timer = 0;
  running = false;
  steps = 0;

  constructor(root: HTMLElement) {
    this.root = root;
    this.cells = $$('.juz', root);
    this.ring = $('[data-sim-ring]', root) as SVGCircleElement | null;
    this.count = $('[data-sim-count]', root);
    this.pct = $('[data-sim-pct]', root);
    this.feedText = $('[data-sim-feed-text]', root);
    this.feedDot = $('.hl-feed-dot', root);
    this.banner = $('[data-sim-banner]', root);
    this.bannerText = $('[data-sim-banner-text]', root);
    this.initial = this.cells.map((c) => {
      const i = c.querySelector('i')!;
      return { cls: c.className, badge: i.textContent ?? '', bg: i.style.background };
    });
    this.readOwners();
  }
  readOwners() {
    this.owner.clear();
    this.cells.forEach((c, k) => {
      if (!c.classList.contains('reserved')) return;
      const letter = c.querySelector('i')!.textContent;
      this.owner.set(k, Math.max(0, MEMBERS.findIndex((m) => m.i === letter)));
    });
  }
  done() {
    return this.cells.filter((c) => c.classList.contains('done')).length;
  }
  render() {
    const d = this.done();
    if (this.ring) this.ring.style.strokeDashoffset = String(RING_C * (1 - d / 30));
    if (this.count) this.count.textContent = String(d);
    if (this.pct) this.pct.textContent = `${Math.round((d / 30) * 100)}%`;
  }
  feed(m: (typeof MEMBERS)[number], text: string) {
    if (this.feedText) {
      gsap.fromTo(this.feedText.parentElement, { y: 6, opacity: 0.2 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out' });
      this.feedText.textContent = text;
    }
    if (this.feedDot) {
      this.feedDot.textContent = m.i;
      this.feedDot.style.background = m.c;
    }
  }
  notify(text: string) {
    if (!this.banner || !this.bannerText) return;
    this.bannerText.textContent = text;
    gsap
      .timeline()
      .fromTo(this.banner, { yPercent: -140, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.7, ease: 'back.out(1.4)' })
      .to(this.banner, { yPercent: -140, opacity: 0, duration: 0.5, ease: 'power3.in' }, '+=2.1');
  }
  pop(c: HTMLElement) {
    c.classList.add('pop');
    setTimeout(() => c.classList.remove('pop'), 380);
  }
  reset() {
    this.cells.forEach((c, k) => {
      c.className = this.initial[k].cls;
      const i = c.querySelector('i')!;
      i.textContent = this.initial[k].badge;
      i.style.background = this.initial[k].bg;
    });
    this.readOwners();
    this.render();
  }
  step() {
    const d = this.done();
    if (d >= 30) {
      this.reset();
      return;
    }
    const reserved = [...this.owner.keys()];
    const free = this.cells.map((c, k) => k).filter((k) => !this.cells[k].className.match(/done|reserved/));
    const complete = reserved.length && (free.length === 0 || Math.random() < 0.55);
    if (complete) {
      const k = reserved[Math.floor(Math.random() * reserved.length)];
      const m = MEMBERS[this.owner.get(k)!];
      this.owner.delete(k);
      const c = this.cells[k];
      c.classList.remove('reserved');
      c.classList.add('done');
      this.pop(c);
      this.render();
      const nd = this.done();
      if (nd === 30) {
        this.feed(m, 'Hatm #3 complete — all 30 Juz 🎉');
        this.notify('Hatm #3 complete 🎉 Barakallahu feekum!');
      } else {
        this.feed(m, `${m.n} finished Juz ${k + 1}`);
        if (++this.steps % 3 === 0) this.notify(`${m.n} finished Juz ${k + 1} · ${nd}/30`);
      }
    } else if (free.length) {
      const k = free[Math.floor(Math.random() * free.length)];
      const mi = Math.floor(Math.random() * MEMBERS.length);
      const m = MEMBERS[mi];
      this.owner.set(k, mi);
      const c = this.cells[k];
      const i = c.querySelector('i')!;
      i.textContent = m.i;
      i.style.background = m.c;
      c.classList.add('reserved');
      this.pop(c);
      this.feed(m, `${m.n} reserved Juz ${k + 1}`);
    }
  }
  loop = () => {
    if (!this.running) return;
    if (document.visibilityState === 'visible') this.step();
    this.timer = window.setTimeout(this.loop, this.done() >= 30 ? 3200 : 1500);
  };
  start() {
    if (this.running || reduce) return;
    this.running = true;
    this.timer = window.setTimeout(this.loop, 900);
  }
  stop() {
    this.running = false;
    clearTimeout(this.timer);
  }
}

$$('[data-sim="live"]').forEach((el) => {
  const sim = new HatmSim(el);
  ScrollTrigger.create({ trigger: el.closest('.project') ?? el, start: 'top bottom', end: 'bottom top', onToggle: (s) => (s.isActive ? sim.start() : sim.stop()) });
});

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
