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

  return (
    <div className="space-y-4">
      <div className="p-5 border border-gray-200 rounded-xl bg-white">
        <MathEditor
          ref={editorRef}
          placeholder="Try typing: Solve the equation, then click [fx] to add x^2 + 3x - 4 = 0"
          onChange={setValue}
        />
        <div className="mt-3">
          <SymbolPalette targetRef={editorRef} />
        </div>
      </div>

      {value && (
        <div className="grid md:grid-cols-2 gap-4">
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
