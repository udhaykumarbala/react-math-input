import {
  useRef,
  useEffect,
  useState,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import type { MathfieldElement } from "mathlive";
import MathRenderer from "./MathRenderer";

export interface MathEditorRef {
  getValue: () => string;
  setValue: (latex: string) => void;
  getMathField: () => MathfieldElement | null;
  isMathMode: () => boolean;
  focus: () => void;
}

interface MathEditorProps {
  placeholder?: string;
  initialValue?: string;
  onChange?: (latex: string) => void;
  onFocus?: () => void;
  className?: string;
  showPreview?: boolean;
}

const MathEditor = forwardRef<MathEditorRef, MathEditorProps>(
  (
    {
      placeholder = "",
      initialValue = "",
      onChange,
      onFocus,
      className = "",
      showPreview = true,
    },
    ref
  ) => {
    const [value, setValue] = useState(initialValue);
    const [composerOpen, setComposerOpen] = useState(false);
    const [mathliveLoaded, setMathliveLoaded] = useState(false);

    const textRef = useRef<HTMLTextAreaElement>(null);
    const composerContainerRef = useRef<HTMLDivElement>(null);
    const mfRef = useRef<MathfieldElement | null>(null);
    const cursorPosRef = useRef<number>(0);

    const loadMathLive = useCallback(async () => {
      if (mathliveLoaded) return;
      await import("mathlive");
      setMathliveLoaded(true);
    }, [mathliveLoaded]);

    useEffect(() => {
      if (!composerOpen || !mathliveLoaded || !composerContainerRef.current) return;
      if (mfRef.current) return;

      const mf = document.createElement("math-field") as MathfieldElement;
      mf.setAttribute("virtual-keyboard-mode", "manual");
      mf.setAttribute("smart-superscript", "");
      mf.setAttribute("smart-fence", "");
      mf.style.width = "100%";
      mf.style.minHeight = "48px";
      mf.style.fontSize = "20px";
      mf.style.padding = "10px 14px";
      mf.style.borderRadius = "6px";
      mf.style.border = "2px solid #3b82f6";
      mf.value = "";

      composerContainerRef.current.innerHTML = "";
      composerContainerRef.current.appendChild(mf);
      mfRef.current = mf;

      requestAnimationFrame(() => mf.focus());
    }, [composerOpen, mathliveLoaded]);

    const saveCursor = () => {
      if (textRef.current) {
        cursorPosRef.current = textRef.current.selectionStart;
      }
    };

    const openComposer = useCallback(async () => {
      saveCursor();
      await loadMathLive();
      mfRef.current = null;
      setComposerOpen(true);
    }, [loadMathLive]);

    const closeComposer = () => {
      if (composerContainerRef.current) composerContainerRef.current.innerHTML = "";
      mfRef.current = null;
      setComposerOpen(false);
      requestAnimationFrame(() => textRef.current?.focus());
    };

    const insertEquation = () => {
      if (!mfRef.current) return;
      const latex = mfRef.current.value.trim();
      if (!latex) {
        closeComposer();
        return;
      }

      const insertion = `$${latex}$`;
      const pos = cursorPosRef.current;
      const before = value.slice(0, pos);
      const after = value.slice(pos);
      const newVal = before + insertion + after;

      setValue(newVal);
      onChange?.(newVal);

      if (composerContainerRef.current) composerContainerRef.current.innerHTML = "";
      mfRef.current = null;
      setComposerOpen(false);

      const newPos = pos + insertion.length;
      requestAnimationFrame(() => {
        if (textRef.current) {
          textRef.current.focus();
          textRef.current.setSelectionRange(newPos, newPos);
          cursorPosRef.current = newPos;
        }
      });
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newVal = e.target.value;
      setValue(newVal);
      onChange?.(newVal);
    };

    const hasLatex = value.includes("$");

    useImperativeHandle(ref, () => ({
      getValue: () => value,
      setValue: (latex: string) => setValue(latex),
      getMathField: () => mfRef.current,
      isMathMode: () => composerOpen,
      focus: () => {
        if (composerOpen && mfRef.current) mfRef.current.focus();
        else textRef.current?.focus();
      },
    }));

    return (
      <div className={`rmi-editor ${className}`}>
        <div className="rmi-editor-toolbar">
          <button
            type="button"
            onClick={openComposer}
            className="rmi-fx-btn"
            data-active={composerOpen}
            title="Insert equation"
          >
            fx
          </button>
          {!composerOpen && (
            <span className="rmi-hint">Click to insert an equation at cursor</span>
          )}
        </div>

        <textarea
          ref={textRef}
          value={value}
          onChange={handleTextChange}
          onFocus={onFocus}
          onBlur={saveCursor}
          onClick={saveCursor}
          onKeyUp={saveCursor}
          placeholder={placeholder}
          rows={3}
          className="rmi-textarea"
          data-composer-open={composerOpen}
        />

        {composerOpen && (
          <div className="rmi-composer">
            <div className="rmi-composer-label">
              Equation Composer — build your equation, then click Insert
            </div>
            <div ref={composerContainerRef} className="rmi-composer-field" />
            <div className="rmi-composer-actions">
              <button type="button" onClick={insertEquation} className="rmi-btn-primary">
                Insert Equation
              </button>
              <button type="button" onClick={closeComposer} className="rmi-btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        )}

        {showPreview && hasLatex && !composerOpen && (
          <div className="rmi-preview">
            <span className="rmi-preview-label">Preview</span>
            <MathRenderer text={value} />
          </div>
        )}
      </div>
    );
  }
);

MathEditor.displayName = "MathEditor";

export default MathEditor;
