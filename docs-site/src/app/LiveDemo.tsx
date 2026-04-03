"use client";

import { useRef, useState } from "react";
import type { MathEditorRef } from "../MathEditor";
import MathEditor from "../MathEditor";
import SymbolPalette from "../SymbolPalette";
import MathRenderer from "../MathRenderer";
import "../styles.css";
import "katex/dist/katex.min.css";

export default function LiveDemo() {
  const editorRef = useRef<MathEditorRef>(null);
  const [value, setValue] = useState("");
  const [dark, setDark] = useState(false);
  const [size, setSize] = useState<"sm" | "md" | "lg">("md");
  const [disabled, setDisabled] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4 text-sm">
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} className="accent-blue-600" />
          Dark mode
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={disabled} onChange={(e) => setDisabled(e.target.checked)} className="accent-blue-600" />
          Disabled
        </label>
        <label className="flex items-center gap-1.5 cursor-pointer">
          <input type="checkbox" checked={error} onChange={(e) => setError(e.target.checked)} className="accent-blue-600" />
          Error
        </label>
        <select value={size} onChange={(e) => setSize(e.target.value as "sm" | "md" | "lg")} className="px-2 py-1 border border-gray-300 rounded text-sm">
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </div>

      <div className={`p-5 border rounded-xl transition-colors ${dark ? "bg-[#1e1e1e] border-[#444] rmi-dark" : "bg-white border-gray-200"}`}>
        <MathEditor
          ref={editorRef}
          placeholder="Try typing: Solve the equation, then click [fx] to add x^2 + 3x - 4 = 0"
          onChange={setValue}
          size={size}
          disabled={disabled}
          error={error}
        />
        <div className="mt-3">
          <SymbolPalette targetRef={editorRef} size={size} disabled={disabled} />
        </div>
      </div>

      {value && (
        <div className="grid md:grid-cols-2 gap-4 mt-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="text-xs font-semibold text-blue-700 uppercase mb-2">Rendered Output</h4>
            <MathRenderer text={value} className="text-base" />
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Raw Value (stored in DB)</h4>
            <pre className="text-xs font-mono text-gray-700 whitespace-pre-wrap break-all">{value}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
