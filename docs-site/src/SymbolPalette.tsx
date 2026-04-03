import { useState } from "react";
import { SYMBOL_CATEGORIES } from "./symbols";
import type { MathEditorRef } from "./MathEditor";
import type { MathSymbol } from "./symbols";

export interface SymbolPaletteProps {
  targetRef: React.RefObject<MathEditorRef | null>;
  /** Custom symbol categories — overrides defaults if provided */
  categories?: Record<string, MathSymbol[]>;
  className?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export default function SymbolPalette({
  targetRef,
  categories,
  className = "",
  size,
  disabled = false,
}: SymbolPaletteProps) {
  const symbolData = categories ?? SYMBOL_CATEGORIES;
  const categoryNames = Object.keys(symbolData);
  const [activeTab, setActiveTab] = useState(categoryNames[0]);

  const handleInsert = (latex: string) => {
    if (disabled) return;
    const editor = targetRef.current;
    if (!editor) return;
    const mf = editor.getMathField();
    if (!mf) return;
    mf.executeCommand(["insert", latex]);
    mf.focus();
  };

  return (
    <div
      className={`rmi-palette ${className}`}
      data-size={size}
      data-disabled={disabled ? "true" : undefined}
    >
      <div className="rmi-palette-tabs">
        {categoryNames.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveTab(cat)}
            className="rmi-palette-tab"
            data-active={activeTab === cat}
            disabled={disabled}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="rmi-palette-grid">
        {symbolData[activeTab]?.map((sym) => (
          <button
            key={sym.latex}
            type="button"
            onClick={() => handleInsert(sym.latex)}
            title={sym.tooltip}
            className="rmi-symbol-btn"
            disabled={disabled}
          >
            {sym.label}
          </button>
        ))}
      </div>
    </div>
  );
}
