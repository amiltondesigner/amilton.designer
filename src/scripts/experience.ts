/**
 * Orquestrador da Portfolio Experience (ver docs/VISION.md).
 *
 * Três responsabilidades, com camadas independentes:
 * 1. Tema por capítulo — IntersectionObserver no MEIO da viewport troca
 *    `data-chapter` no <body>. Roda sempre (mobile e reduced-motion
 *    incluídos): a cor é conteúdo, não efeito. A interpolação suave fica
 *    no CSS (@property); com reduced-motion ela vira troca seca.
 * 2. Lenis — scroll com inércia, dirigido pelo ticker do GSAP (uma única
 *    fonte de tempo). Instância única que sobrevive às View Transitions.
 * 3. Cenas GSAP/ScrollTrigger — só desktop com motion (gsap.matchMedia).
 *    As cenas dos capítulos são registradas aqui pelas Fases 3-4.
 *
 * Ciclo de vida (Astro ClientRouter):
 *   astro:page-load  → initExperience()
 *   astro:before-swap → destroyExperience() (mata todos os ScrollTriggers;
 *   Lenis sobrevive de propósito)
 */
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/** Cenas pesadas só aqui: desktop, ponteiro fino, sem reduced-motion. */
export const SCENES_MEDIA =
  "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

type Cleanup = () => void;
let cleanups: Cleanup[] = [];

const prefersReduced = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* 1. Tema por capítulo                                                */
/* ------------------------------------------------------------------ */
function initChapterTheme(): Cleanup {
  const sections = document.querySelectorAll<HTMLElement>(
    "[data-chapter-section]",
  );
  if (!sections.length) {
    // páginas fora da experiência (cases, 404) ficam na atmosfera padrão
    delete document.body.dataset.chapter;
    return () => {};
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const ch = (e.target as HTMLElement).dataset.chapterSection;
        if (ch && document.body.dataset.chapter !== ch) {
          document.body.dataset.chapter = ch;
        }
      }
    },
    // faixa estreita no meio da viewport: o capítulo "ativo" é o que
    // cruza o centro do olhar, não o que encosta na borda
    { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
  );
  sections.forEach((s) => io.observe(s));
  return () => io.disconnect();
}

/* ------------------------------------------------------------------ */
/* 2. Lenis + ponte com ScrollTrigger                                  */
/* ------------------------------------------------------------------ */
function tickLenis(time: number) {
  window.__lenis?.raf(time * 1000);
}

function initLenis(): Cleanup {
  if (prefersReduced() || window.__lenis) return () => {};

  const lenis = new Lenis({
    duration: 1.1,
    smoothWheel: true,
    autoRaf: false,
    // âncoras internas (skip link, cue, mapa) passam pelo próprio Lenis
    anchors: true,
  });
  window.__lenis = lenis;
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add(tickLenis);
  gsap.ticker.lagSmoothing(0);
  return () => {};
}

/* ------------------------------------------------------------------ */
/* 3. Cenas por capítulo (registradas nas Fases 3-4)                   */
/* ------------------------------------------------------------------ */
type SceneSetup = (ctx: gsap.Context) => void;
const sceneSetups: SceneSetup[] = [];

/** Componentes registram cenas antes do page-load disparar. */
export function registerScene(setup: SceneSetup) {
  sceneSetups.push(setup);
}

/**
 * Reveals genéricos — o conteúdo nasce visível no HTML (mobile, no-JS e
 * reduced-motion nunca dependem disto); o estado inicial escondido só é
 * aplicado quando o contexto de cenas ativa, e o revert() devolve tudo.
 *
 * - [data-anima]           rise (padrão) | "fade" | "scale"
 * - [data-anima-delay]     atraso em segundos
 * - [data-anima-grupo]     anima os filhos diretos com stagger
 */
function setupReveals() {
  const base = {
    duration: 0.9,
    ease: "expo.out",
  } as const;

  // opacity (nunca visibility): elementos com links/botões continuam
  // focáveis pra teclado; o CSS de :focus-within revela na hora.
  gsap.utils.toArray<HTMLElement>("[data-anima]").forEach((el) => {
    const tipo = el.dataset.anima || "rise";
    const vars: gsap.TweenVars = {
      ...base,
      opacity: 0,
      delay: parseFloat(el.dataset.animaDelay || "0"),
      scrollTrigger: {
        trigger: el,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    };
    if (tipo === "rise") vars.y = 28;
    if (tipo === "scale") {
      vars.scale = 0.96;
      vars.y = 12;
    }
    gsap.from(el, vars);
  });

  gsap.utils.toArray<HTMLElement>("[data-anima-grupo]").forEach((grupo) => {
    gsap.from(grupo.children, {
      ...base,
      opacity: 0,
      y: 18,
      duration: 0.7,
      stagger: 0.07,
      scrollTrigger: {
        trigger: grupo,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
    });
  });
}

/** Parallax sutil dos fragmentos da marca — só no contexto de cenas
 *  (desktop com motion); mobile e reduced-motion ficam estáticos. */
function setupParallax() {
  gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
    const amt = parseFloat(el.dataset.parallax || "1");
    if (!amt) return;
    gsap.fromTo(
      el,
      { yPercent: -7 * amt },
      {
        yPercent: 7 * amt,
        ease: "none",
        scrollTrigger: {
          // a seção tem geometria estável; o fragmento é absoluto e o
          // ScrollTrigger media mal a posição dele (ficava preso no fim)
          trigger: el.closest("section") ?? el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      },
    );
  });
}

function initScenes(): Cleanup {
  const mm = gsap.matchMedia();
  mm.add(SCENES_MEDIA, () => {
    // setups re-consultam o DOM a cada chamada (sobrevivem a navegações)
    const ctx = gsap.context((self) => {
      setupReveals();
      setupParallax();
      sceneSetups.forEach((setup) => setup(self!));
    });
    return () => ctx.revert();
  });
  return () => mm.revert();
}

/* ------------------------------------------------------------------ */
/* Ciclo de vida                                                       */
/* ------------------------------------------------------------------ */
export function initExperience() {
  destroyExperience();
  cleanups = [initChapterTheme(), initLenis(), initScenes()];
  ScrollTrigger.refresh();
}

export function destroyExperience() {
  cleanups.forEach((c) => c());
  cleanups = [];
  ScrollTrigger.getAll().forEach((t) => t.kill());
}
