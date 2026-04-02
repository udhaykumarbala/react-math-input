import { useMemo } from "react";
import katex from "katex";

interface MathRendererProps {
  text: string;
  className?: string;
}

/**
 * Renders a string containing LaTeX delimiters ($...$ and $$...$$) into
 * formatted HTML using KaTeX. Plain text passes through unchanged.
 *
 * Requires: `import 'katex/dist/katex.min.css'` in your app, or
 * `import 'react-math-input/styles.css'`.
 */
export default function MathRenderer({ text, className = "" }: MathRendererProps) {
  const html = useMemo(() => renderLatexString(text), [text]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/** Parse and render LaTeX delimiters in a string, returning safe HTML. */
export function renderLatexString(text: string): string {
  if (!text) return "";

  let result = text.replace(/\$\$([\s\S]+?)\$\$/g, (_match, latex: string) => {
    try {
      return katex.renderToString(latex.trim(), {
        displayMode: true,
        throwOnError: false,
      });
    } catch {
      return `<span class="rmi-latex-error" title="Invalid LaTeX">${escapeHtml(latex)}</span>`;
    }
  });

  result = result.replace(/\$([^$]+?)\$/g, (_match, latex: string) => {
    try {
      return katex.renderToString(latex.trim(), {
        displayMode: false,
        throwOnError: false,
      });
    } catch {
      return `<span class="rmi-latex-error" title="Invalid LaTeX">${escapeHtml(latex)}</span>`;
    }
  });

  result = result.replace(/\n/g, "<br/>");

  return result;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
