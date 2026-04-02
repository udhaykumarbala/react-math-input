import { useState } from "react";
import { SYMBOL_CATEGORIES } from "./symbols";
import type { MathEditorRef } from "./MathEditor";

interface SymbolPaletteProps {
  targetRef: React.RefObject<MathEditorRef | null>;
  className?: string;
}

export default function SymbolPalette({ targetRef, className = "" }: SymbolPaletteProps) {
  const categories = Object.keys(SYMBOL_CATEGORIES);
  const [activeTab, setActiveTab] = useState(categories[0]);

  const handleInsert = (latex: string) => {
    const editor = targetRef.current;
    if (!editor) return;

    const mf = editor.getMathField();
    if (!mf) return;

    mf.executeCommand(["insert", latex]);
    mf.focus();
  };

  return (
    <div className={`rmi-palette ${className}`}>
      <div className="rmi-palette-tabs">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveTab(cat)}
            className="rmi-palette-tab"
            data-active={activeTab === cat}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="rmi-palette-grid">
        {SYMBOL_CATEGORIES[activeTab].map((sym) => (
          <button
            key={sym.latex}
            type="button"
            onClick={() => handleInsert(sym.latex)}
            title={sym.tooltip}
            className="rmi-symbol-btn"
          >
            {sym.label}
          </button>
        ))}
      </div>
    </div>
  );
}
