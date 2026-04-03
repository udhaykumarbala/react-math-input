import { useMemo } from "react";
import katex from "katex";

interface MathRendererProps {
  text: string;
  className?: string;
  /** Called when a LaTeX expression fails to parse */
  onError?: (latex: string, error: Error) => void;
  /** Custom fallback for invalid LaTeX (receives the raw LaTeX string) */
  fallback?: (latex: string) => string;
}

export default function MathRenderer({
  text,
  className = "",
  onError,
  fallback,
}: MathRendererProps) {
  const html = useMemo(
    () => renderLatexString(text, { onError, fallback }),
    [text, onError, fallback]
  );

  return (
    <div
      className={className}
      role="math"
      aria-label={text}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

interface RenderOptions {
  onError?: (latex: string, error: Error) => void;
  fallback?: (latex: string) => string;
}

export function renderLatexString(text: string, options?: RenderOptions): string {
  if (!text) return "";

  const hasErrorHandlers = !!(options?.onError || options?.fallback);

  const renderSingle = (latex: string, displayMode: boolean): string => {
    try {
      return katex.renderToString(latex.trim(), {
        displayMode,
        throwOnError: hasErrorHandlers,
      });
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      options?.onError?.(latex, error);
      if (options?.fallback) return options.fallback(latex);
      return `<span class="rmi-latex-error" title="${escapeHtml(error.message)}">${escapeHtml(latex)}</span>`;
    }
  };

  let result = text.replace(/\$\$([\s\S]+?)\$\$/g, (_m, latex: string) =>
    renderSingle(latex, true)
  );

  result = result.replace(/\$([^$]+?)\$/g, (_m, latex: string) =>
    renderSingle(latex, false)
  );

  result = result.replace(/\n/g, "<br/>");

  return result;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
