/**
 * O ponto + mapa conceitual — a navegação da experiência (VISION.md):
 * sem navbar; um ponto fixo (na cor do capítulo atual) abre um mapa
 * fullscreen. Cada nó leva a um destino DISTINTO; os 4 cases orbitam
 * "As provas" como satélites e abrem direto no overlay (são <a> reais,
 * o CaseOverlay intercepta o clique quando o dialog fecha).
 * Manifesto é conteúdo exclusivo daqui, recompensa de quem explora.
 *
 * Constelação com linhas no desktop; lista editorial no mobile
 * (a troca é só CSS, o DOM é o mesmo). <dialog> nativo: foco preso,
 * Esc e restauração de foco por conta do browser.
 */
import { useRef, useState } from "preact/hooks";
import { mapNodes } from "../../config/chapters";
import { whatsappUrl } from "../../config/site";

type Caso = { id: string; title: string };

const POSICOES: Record<string, { x: number; y: number }> = {
  quem: { x: 20, y: 22 },
  pensamento: { x: 48, y: 32 },
  provas: { x: 63, y: 58 },
  manifesto: { x: 85, y: 80 },
  conversar: { x: 25, y: 76 },
};

/** órbitas dos cases em volta de "As provas" */
const SATELITES = [
  { x: 47, y: 47 },
  { x: 81, y: 44 },
  { x: 44, y: 70 },
  { x: 80, y: 66 },
];

const LIGACOES: Array<[string, string]> = [
  ["quem", "pensamento"],
  ["pensamento", "provas"],
  ["provas", "conversar"],
  ["provas", "manifesto"],
];

const MANIFESTO = [
  "Começo pelo problema. A tela vem depois.",
  "Pesquisa que não muda a interface é slide.",
  "O vazio também é interface.",
  "Errar cedo é mais barato que impressionar tarde.",
  "Simples dá trabalho. É por isso que funciona.",
];

function lenis():
  | { stop(): void; start(): void; scrollTo(t: Element): void }
  | undefined {
  return (
    window as unknown as {
      __lenis?: { stop(): void; start(): void; scrollTo(t: Element): void };
    }
  ).__lenis;
}

export default function ConceptMap({ casos = [] }: { casos?: Caso[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [vista, setVista] = useState<"mapa" | "manifesto">("mapa");

  function abrir() {
    dialogRef.current?.showModal();
    lenis()?.stop();
  }

  function aoFechar() {
    // o evento close é assíncrono: se um satélite abriu o overlay de case
    // nesse meio-tempo, o Lenis precisa CONTINUAR parado
    if (!document.querySelector("dialog.case-overlay[open]")) {
      lenis()?.start();
    }
    setVista("mapa");
  }

  function irPara(href: string) {
    dialogRef.current?.close();
    if (href.startsWith("#")) {
      const alvo = document.querySelector(href);
      if (!alvo) return;
      const l = lenis();
      if (l) {
        // o evento close (que religa o Lenis) é assíncrono; religa já,
        // senão o scrollTo é engolido pelo estado parado
        l.start();
        l.scrollTo(alvo);
      } else {
        alvo.scrollIntoView();
      }
    } else {
      location.href = href;
    }
  }

  return (
    <>
      <button
        type="button"
        class="ponto-mapa"
        onClick={abrir}
        aria-label="Abrir o mapa da experiência"
        aria-haspopup="dialog"
      >
        <span class="ponto" aria-hidden="true"></span>
      </button>

      <dialog
        ref={dialogRef}
        class="mapa-overlay"
        aria-label="Mapa da experiência"
        onClose={aoFechar}
      >
        <div class="mapa-topo">
          <p class="kicker">
            {vista === "mapa" ? "O mapa · escolha um caminho" : "Manifesto"}
          </p>
          <div class="flex items-center gap-3">
            {vista === "manifesto" && (
              <button
                type="button"
                class="mapa-fechar w-auto! px-4 text-sm"
                onClick={() => setVista("mapa")}
              >
                ← mapa
              </button>
            )}
            <button
              type="button"
              class="mapa-fechar"
              onClick={() => dialogRef.current?.close()}
              aria-label="Fechar o mapa"
            >
              ✕
            </button>
          </div>
        </div>

        {vista === "mapa" ? (
          <div class="mapa-palco">
            <svg
              class="mapa-linhas"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {LIGACOES.map(([a, b]) => (
                <line
                  key={`${a}-${b}`}
                  x1={POSICOES[a].x}
                  y1={POSICOES[a].y}
                  x2={POSICOES[b].x}
                  y2={POSICOES[b].y}
                />
              ))}
              {casos.map((c, i) => (
                <line
                  key={c.id}
                  class="linha-satelite"
                  x1={POSICOES.provas.x}
                  y1={POSICOES.provas.y}
                  x2={SATELITES[i % SATELITES.length].x}
                  y2={SATELITES[i % SATELITES.length].y}
                />
              ))}
            </svg>
            <div class="mapa-nos">
              {mapNodes.map((no, i) => (
                <button
                  key={no.id}
                  type="button"
                  class="mapa-no"
                  style={`--i:${i}; --x:${POSICOES[no.id].x}%; --y:${POSICOES[no.id].y}%`}
                  onClick={() =>
                    no.id === "manifesto"
                      ? setVista("manifesto")
                      : irPara(no.href)
                  }
                >
                  <span class="mapa-no-rotulo">{no.label}</span>
                  <span class="mapa-no-desc">{no.desc}</span>
                </button>
              ))}
              {casos.map((c, i) => (
                <a
                  key={c.id}
                  class="mapa-no mapa-caso"
                  href={`/trabalho/${c.id}`}
                  style={`--i:${mapNodes.length + i}; --x:${SATELITES[i % SATELITES.length].x}%; --y:${SATELITES[i % SATELITES.length].y}%`}
                  onClick={() => dialogRef.current?.close()}
                >
                  <span class="mapa-no-rotulo">{c.title}</span>
                </a>
              ))}
            </div>
            <p class="mapa-dica" aria-hidden="true">
              esc fecha
            </p>
          </div>
        ) : (
          <div class="manifesto">
            <div class="manifesto-conteudo">
              {MANIFESTO.map((linha, i) => (
                <p key={linha} class="manifesto-linha" style={`--i:${i}`}>
                  {linha}
                </p>
              ))}
              <div class="manifesto-fecho">
                <p class="text-sm">
                  Você achou o manifesto. Ele só existe aqui dentro.
                </p>
                <p class="mt-4 max-w-md text-base leading-relaxed">
                  Se você leu até o fim e concordou com a maior parte, a gente
                  provavelmente vai se entender.
                </p>
                <a
                  href={whatsappUrl(
                    "Oi, Amilton! Achei o manifesto no seu site. Vamos conversar?",
                  )}
                  target="_blank"
                  rel="noopener"
                  class="btn mt-6 border border-current"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
