/**
 * Overlay de cases (ver docs/VISION.md, decisão 2): o case abre POR CIMA
 * da experiência, sem troca de página. A URL vira /trabalho/[slug] via
 * pushState (deep-link e botão voltar funcionam) e o conteúdo vem da
 * própria página estática do case, buscada e injetada num <dialog>.
 *
 * Contratos:
 * - As páginas de case NÃO podem usar estilos com escopo Astro no artigo
 *   (só utilitários/classes globais), senão o HTML injetado perde estilo.
 * - Fechar pela UI sempre chama history.back(); quem fecha de verdade é
 *   o handler de popstate. Assim URL e overlay nunca dessincronizam.
 * - Sem JS ou em erro de fetch, o link navega normal pra página estática.
 */
import { useEffect, useRef, useState } from "preact/hooks";

type Dados = { html: string; titulo: string };

const cache = new Map<string, Dados>();

function lenis(): { stop(): void; start(): void } | undefined {
  return (window as unknown as { __lenis?: { stop(): void; start(): void } })
    .__lenis;
}

function slugDaUrl(pathname: string): string | null {
  const m = pathname.match(/^\/trabalho\/([^/#?]+)\/?$/);
  return m ? m[1] : null;
}

export default function CaseOverlay() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const slugAtual = useRef<string | null>(null);
  const tituloOriginal = useRef<string>("");
  const [dados, setDados] = useState<Dados | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function buscar(slug: string): Promise<Dados> {
    const emCache = cache.get(slug);
    if (emCache) return emCache;
    const res = await fetch(`/trabalho/${slug}/`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const doc = new DOMParser().parseFromString(await res.text(), "text/html");
    const artigo = doc.querySelector("[data-case-conteudo]");
    if (!artigo) throw new Error("conteúdo do case não encontrado");
    const d = { html: artigo.innerHTML, titulo: doc.title };
    cache.set(slug, d);
    return d;
  }

  async function abrir(slug: string) {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) {
      tituloOriginal.current = document.title;
      dialog.showModal();
      lenis()?.stop();
    }
    slugAtual.current = slug;
    setCarregando(true);
    try {
      const d = await buscar(slug);
      if (slugAtual.current !== slug) return; // usuário já foi pra outro
      setDados(d);
      setCarregando(false);
      document.title = d.titulo;
      scrollRef.current?.scrollTo(0, 0);
    } catch {
      // fallback honesto: navegação de página inteira
      location.href = `/trabalho/${slug}`;
    }
  }

  function fechar() {
    const dialog = dialogRef.current;
    slugAtual.current = null;
    if (!dialog?.open) return;
    dialog.close();
    lenis()?.start();
    if (tituloOriginal.current) document.title = tituloOriginal.current;
    setDados(null);
    setCarregando(false);
  }

  /** Fechar pela UI = voltar na história; o popstate fecha de fato. */
  function pedirFechamento() {
    history.back();
  }

  useEffect(() => {
    const aoClicar = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const link = (e.target as Element).closest?.("a[href]");
      if (!link || link.getAttribute("target") === "_blank") return;
      const slug = slugDaUrl(link.getAttribute("href") ?? "");
      if (!slug) return;
      e.preventDefault();
      const jaAberto = dialogRef.current?.open ?? false;
      if (jaAberto) {
        // case → case dentro do overlay: substitui a entrada (1 voltar fecha)
        history.replaceState({ case: slug }, "", `/trabalho/${slug}`);
      } else {
        history.pushState({ case: slug }, "", `/trabalho/${slug}`);
      }
      abrir(slug);
    };

    const aoNavegar = () => {
      const slug = slugDaUrl(location.pathname);
      if (slug) abrir(slug);
      else fechar();
    };

    document.addEventListener("click", aoClicar);
    window.addEventListener("popstate", aoNavegar);
    return () => {
      document.removeEventListener("click", aoClicar);
      window.removeEventListener("popstate", aoNavegar);
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      class="case-overlay case-tema"
      aria-label={dados?.titulo || "Estudo de caso"}
      onCancel={(e) => {
        e.preventDefault();
        pedirFechamento();
      }}
      onClick={(e) => {
        // clique no ::backdrop chega com target = <dialog>
        if (e.target === dialogRef.current) pedirFechamento();
      }}
    >
      <div
        ref={scrollRef}
        class="case-overlay-scroll"
        data-lenis-prevent
        aria-busy={carregando}
      >
        <button
          type="button"
          class="case-overlay-fechar"
          onClick={pedirFechamento}
          aria-label="Fechar case e voltar"
        >
          ✕
        </button>
        {carregando && !dados && (
          <p class="case-overlay-loading" aria-live="polite">
            Abrindo case…
          </p>
        )}
        {dados && (
          <div
            class="case-overlay-conteudo"
            dangerouslySetInnerHTML={{ __html: dados.html }}
          />
        )}
      </div>
    </dialog>
  );
}
