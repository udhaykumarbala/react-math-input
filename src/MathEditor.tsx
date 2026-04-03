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

export interface MathEditorProps {
  /** Controlled value */
  value?: string;
  /** Default value for uncontrolled mode */
  defaultValue?: string;
  /** @deprecated Use defaultValue instead */
  initialValue?: string;
  placeholder?: string;
  /** Field name — renders a hidden <input> for native form submission */
  name?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  showPreview?: boolean;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
}

const MathEditor = forwardRef<MathEditorRef, MathEditorProps>(
  (
    {
      value: controlledValue,
      defaultValue,
      initialValue,
      placeholder = "",
      name,
      onChange,
      onFocus,
      onBlur,
      className = "",
      showPreview = true,
      size,
      disabled,
      readOnly,
      error,
    },
    ref
  ) => {
    const isControlled = controlledValue !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue ?? initialValue ?? "");
    const currentValue = isControlled ? controlledValue : internalValue;

    const updateValue = useCallback((newVal: string) => {
      if (!isControlled) setInternalValue(newVal);
      onChange?.(newVal);
    }, [isControlled, onChange]);
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
      mf.classList.add("rmi-mathfield");
      mf.style.width = "100%";
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
      if (disabled || readOnly) return;
      saveCursor();
      await loadMathLive();
      mfRef.current = null;
      setComposerOpen(true);
    }, [loadMathLive, disabled, readOnly]);

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
      const before = currentValue.slice(0, pos);
      const after = currentValue.slice(pos);
      const newVal = before + insertion + after;

      updateValue(newVal);

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
      if (disabled || readOnly) return;
      const newVal = e.target.value;
      updateValue(newVal);
    };

    const hasLatex = currentValue.includes("$");

    useImperativeHandle(ref, () => ({
      getValue: () => currentValue,
      setValue: (latex: string) => updateValue(latex),
      getMathField: () => mfRef.current,
      isMathMode: () => composerOpen,
      focus: () => {
        if (composerOpen && mfRef.current) mfRef.current.focus();
        else textRef.current?.focus();
      },
    }));

    return (
      <div
        className={`rmi-editor ${className}`}
        data-size={size}
        data-disabled={disabled ? "true" : undefined}
        data-readonly={readOnly ? "true" : undefined}
        data-error={error ? "true" : undefined}
      >
        {name && <input type="hidden" name={name} value={currentValue} />}
        <div className="rmi-editor-toolbar">
          <button
            type="button"
            onClick={openComposer}
            className="rmi-fx-btn"
            data-active={composerOpen}
            title="Insert equation"
            disabled={disabled || readOnly}
          >
            fx
          </button>
          {!composerOpen && (
            <span className="rmi-hint">Click to insert an equation at cursor</span>
          )}
        </div>

        <textarea
          ref={textRef}
          value={currentValue}
          onChange={handleTextChange}
          onFocus={onFocus}
          onBlur={() => { saveCursor(); onBlur?.(); }}
          onClick={saveCursor}
          onKeyUp={saveCursor}
          placeholder={placeholder}
          rows={3}
          className="rmi-textarea"
          data-composer-open={composerOpen}
          disabled={disabled}
          readOnly={readOnly}
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
            <MathRenderer text={currentValue} />
          </div>
        )}
      </div>
    );
  }
);

MathEditor.displayName = "MathEditor";

export default MathEditor;
