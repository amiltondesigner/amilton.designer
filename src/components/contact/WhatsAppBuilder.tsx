import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import {
  inquiryGroups,
  emptyInquiry,
  buildInquiryMessage,
  type InquiryState,
} from "../../config/inquiry";
import { whatsappUrl } from "../../config/site";

export default function WhatsAppBuilder() {
  const [state, setState] = useState<InquiryState>({ ...emptyInquiry });
  const [message, setMessage] = useState(buildInquiryMessage(emptyInquiry));
  const [dirty, setDirty] = useState(false);
  const [copied, setCopied] = useState(false);

  const auto = useMemo(() => buildInquiryMessage(state), [state]);

  // Mantém a mensagem em sincronia com as escolhas, até o usuário editá-la.
  useEffect(() => {
    if (!dirty) setMessage(auto);
  }, [auto, dirty]);

  // CTA fixo no mobile: aparece enquanto monta a mensagem e some ao chegar no
  // resumo (que já tem o botão de envio "real"), evitando dois CTAs sobrepostos.
  const rootRef = useRef<HTMLDivElement>(null);
  const summaryRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  const [summaryInView, setSummaryInView] = useState(false);
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const root = rootRef.current;
    const summary = summaryRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.target === root) setInView(e.isIntersecting);
          if (e.target === summary) setSummaryInView(e.isIntersecting);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    if (root) io.observe(root);
    if (summary) io.observe(summary);
    return () => io.disconnect();
  }, []);

  function toggle(
    groupId: "services" | "type" | "deadline" | "budget",
    option: string,
    multi?: boolean,
  ) {
    setState((prev) => {
      if (multi) {
        const arr = prev.services.includes(option)
          ? prev.services.filter((o) => o !== option)
          : [...prev.services, option];
        return { ...prev, services: arr };
      }
      const current = prev[groupId] as string;
      return { ...prev, [groupId]: current === option ? "" : option };
    });
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard indisponível — usuário pode selecionar manualmente */
    }
  }

  // Zera todas as escolhas e devolve a mensagem ao padrão.
  function clearAll() {
    setState({ ...emptyInquiry });
    setDirty(false);
  }

  const href = whatsappUrl(message);
  const showBar = inView && !summaryInView;
  const count =
    state.services.length +
    (state.type ? 1 : 0) +
    (state.deadline ? 1 : 0) +
    (state.budget ? 1 : 0);
  const canClear =
    count > 0 || Boolean(state.name) || Boolean(state.note) || dirty;

  return (
    <div
      ref={rootRef}
      class="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] lg:gap-14"
    >
      {/* Grupos de opções */}
      <div class="space-y-10">
        {inquiryGroups.map((g, gi) => {
          const selected =
            g.id === "services"
              ? state.services
              : [state[g.id] as string].filter(Boolean);
          return (
            <fieldset key={g.id} class="border-0 p-0">
              <legend class="flex items-baseline gap-3 p-0">
                <span class="font-display text-sm tabular-nums text-faint">
                  {String(gi + 1).padStart(2, "0")}
                </span>
                <span class="text-base font-medium">{g.label}</span>
              </legend>
              <div class="mt-4 flex flex-wrap gap-2.5">
                {g.options.map((opt) => {
                  const on = selected.includes(opt);
                  return (
                    <button
                      type="button"
                      key={opt}
                      aria-pressed={on}
                      onClick={() => toggle(g.id, opt, g.multi)}
                      class={`chip ${on ? "chip-on" : ""}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}

        {/* Nome + resumo livre */}
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label class="block">
            <span class="text-sm text-muted">Seu nome (opcional)</span>
            <input
              type="text"
              value={state.name}
              onInput={(e) =>
                setState((p) => ({
                  ...p,
                  name: (e.target as HTMLInputElement).value,
                }))
              }
              class="field mt-2"
              placeholder="Como te chamo?"
            />
          </label>
          <label class="block">
            <span class="text-sm text-muted">Resumo rápido (opcional)</span>
            <input
              type="text"
              value={state.note}
              onInput={(e) =>
                setState((p) => ({
                  ...p,
                  note: (e.target as HTMLInputElement).value,
                }))
              }
              class="field mt-2"
              placeholder="Ex.: redesenhar meu app"
            />
          </label>
        </div>
      </div>

      {/* Resumo — sempre visível (sticky no desktop) */}
      <aside ref={summaryRef} class="lg:sticky lg:top-28 lg:self-start">
        <div class="rounded-xl border border-border bg-surface p-6">
          <div class="flex items-center justify-between gap-3">
            <span class="eyebrow">Sua mensagem</span>
            <div class="flex items-center gap-3">
              {dirty && (
                <button
                  type="button"
                  onClick={() => setDirty(false)}
                  class="text-xs text-faint underline-offset-2 hover:text-foreground hover:underline"
                >
                  restaurar
                </button>
              )}
              {canClear && (
                <button
                  type="button"
                  onClick={clearAll}
                  class="text-xs text-faint underline-offset-2 hover:text-foreground hover:underline"
                >
                  limpar tudo
                </button>
              )}
            </div>
          </div>
          <textarea
            value={message}
            onInput={(e) => {
              setMessage((e.target as HTMLTextAreaElement).value);
              setDirty(true);
            }}
            rows={8}
            aria-label="Mensagem que será enviada no WhatsApp"
            class="mt-3 w-full resize-none rounded-lg border border-border bg-background p-4 text-sm leading-relaxed text-foreground focus:border-accent focus:outline-none"
          />
          <a
            href={href}
            target="_blank"
            rel="noopener"
            class="btn btn-whatsapp mt-4 w-full text-base"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              class="size-5"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Enviar no WhatsApp
          </a>
          <button
            type="button"
            onClick={copy}
            class="mt-2 w-full text-center text-sm text-faint transition-colors hover:text-foreground"
          >
            {copied ? "✓ Copiado" : "Copiar mensagem"}
          </button>
        </div>
        <p class="mt-3 text-center text-xs text-faint lg:text-left">
          {count > 0
            ? `${count} ${count === 1 ? "opção" : "opções"} · `
            : ""}
          abre direto no seu WhatsApp
        </p>
      </aside>

      {/* CTA fixo no mobile — sempre ao alcance do polegar enquanto monta a mensagem */}
      <a
        href={href}
        target="_blank"
        rel="noopener"
        aria-hidden={!showBar}
        tabIndex={showBar ? undefined : -1}
        class={`btn btn-whatsapp fixed bottom-4 left-4 right-20 z-40 text-base shadow-lg shadow-black/15 transition-all duration-300 lg:hidden ${
          showBar
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          class="size-5"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.247-.694.247-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        Enviar no WhatsApp
      </a>
    </div>
  );
}
