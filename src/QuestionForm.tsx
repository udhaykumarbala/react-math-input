import { useRef, useState, useCallback, createRef } from "react";
import MathEditor, { MathEditorRef } from "./MathEditor";
import SymbolPalette from "./SymbolPalette";
import MathRenderer from "./MathRenderer";

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F", "G", "H"];

export interface QuestionOption {
  id: string;
  text: string;
  is_correct: boolean;
}

export interface QuestionPayload {
  subject_id: string;
  question_text: string;
  question_type: string;
  difficulty: string;
  marks: number;
  options?: QuestionOption[];
  correct_answer?: string;
  answer_explanation?: string;
  tags?: string[];
}

interface QuestionFormProps {
  onSubmit?: (payload: QuestionPayload) => void;
  className?: string;
}

export default function QuestionForm({ onSubmit, className = "" }: QuestionFormProps) {
  const [subjectId, setSubjectId] = useState("");
  const [questionType, setQuestionType] = useState("multiple_choice");
  const [difficulty, setDifficulty] = useState("medium");
  const [marks, setMarks] = useState(1);
  const [tags, setTags] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [optionCount, setOptionCount] = useState(4);
  const [optionCorrect, setOptionCorrect] = useState<boolean[]>([true, false, false, false]);
  const [preview, setPreview] = useState<QuestionPayload | null>(null);

  const questionRef = useRef<MathEditorRef>(null);
  const explanationRef = useRef<MathEditorRef>(null);
  const optionRefs = useRef<React.RefObject<MathEditorRef | null>[]>(
    Array.from({ length: 8 }, () => createRef<MathEditorRef>())
  );
  const [activeEditorRef, setActiveEditorRef] = useState<React.RefObject<MathEditorRef | null>>(questionRef);

  const showOptions = ["multiple_choice", "true_false"].includes(questionType);

  const addOption = () => {
    if (optionCount >= 8) return;
    setOptionCount((c) => c + 1);
    setOptionCorrect((prev) => [...prev, false]);
  };

  const removeOption = (index: number) => {
    if (optionCount <= 2) return;
    setOptionCount((c) => c - 1);
    setOptionCorrect((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleCorrect = (index: number) => {
    setOptionCorrect((prev) => prev.map((val, i) => (i === index ? !val : val)));
  };

  const serialize = useCallback((): QuestionPayload => {
    const payload: QuestionPayload = {
      subject_id: subjectId,
      question_text: questionRef.current?.getValue() || "",
      question_type: questionType,
      difficulty,
      marks,
    };

    if (showOptions) {
      payload.options = Array.from({ length: optionCount }, (_, i) => ({
        id: crypto.randomUUID(),
        text: optionRefs.current[i]?.current?.getValue() || "",
        is_correct: optionCorrect[i] || false,
      }));
    }

    if (correctAnswer) payload.correct_answer = correctAnswer;
    const explanation = explanationRef.current?.getValue();
    if (explanation) payload.answer_explanation = explanation;
    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
    if (tagList.length > 0) payload.tags = tagList;

    return payload;
  }, [subjectId, questionType, difficulty, marks, showOptions, optionCount, optionCorrect, correctAnswer, tags]);

  const handlePreview = () => setPreview(serialize());
  const handleSubmit = () => {
    const payload = serialize();
    setPreview(payload);
    onSubmit?.(payload);
  };

  return (
    <div className={`rmi-form ${className}`}>
      <div>
        <label className="rmi-field-label">Subject ID</label>
        <input type="text" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} placeholder="UUID of the subject" className="rmi-input" />
      </div>

      <div className="rmi-form-row">
        <div>
          <label className="rmi-field-label">Question Type</label>
          <select value={questionType} onChange={(e) => setQuestionType(e.target.value)} className="rmi-input">
            <option value="multiple_choice">Multiple Choice</option>
            <option value="true_false">True / False</option>
            <option value="short_answer">Short Answer</option>
            <option value="essay">Essay</option>
            <option value="fill_blank">Fill in the Blank</option>
          </select>
        </div>
        <div>
          <label className="rmi-field-label">Difficulty</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className="rmi-input">
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </div>

      <div className="rmi-form-row">
        <div>
          <label className="rmi-field-label">Marks</label>
          <input type="number" value={marks} onChange={(e) => setMarks(parseInt(e.target.value, 10) || 1)} min={1} className="rmi-input" />
        </div>
        <div>
          <label className="rmi-field-label">Tags (comma-separated)</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="algebra, quadratic" className="rmi-input" />
        </div>
      </div>

      <div>
        <label className="rmi-field-label">Question Text</label>
        <MathEditor ref={questionRef} placeholder="Type your question here... click [fx] for equations" onFocus={() => setActiveEditorRef(questionRef)} />
      </div>

      {showOptions && (
        <div>
          <label className="rmi-field-label">Options</label>
          {Array.from({ length: optionCount }, (_, i) => (
            <div key={i} className="rmi-option-row">
              <div className="rmi-option-label">{OPTION_LABELS[i]}</div>
              <div className="rmi-option-editor">
                <MathEditor ref={optionRefs.current[i]} placeholder={`Option ${OPTION_LABELS[i]}...`} onFocus={() => setActiveEditorRef(optionRefs.current[i])} />
              </div>
              <div className="rmi-option-correct">
                <input type="checkbox" checked={optionCorrect[i] || false} onChange={() => toggleCorrect(i)} />
                <span>Correct</span>
              </div>
              {optionCount > 2 && (
                <button type="button" onClick={() => removeOption(i)} className="rmi-remove-btn" title="Remove option">&times;</button>
              )}
            </div>
          ))}
          {optionCount < 8 && (
            <button type="button" onClick={addOption} className="rmi-add-option">+ Add Option</button>
          )}
        </div>
      )}

      {!showOptions && (
        <div>
          <label className="rmi-field-label">Correct Answer</label>
          <input type="text" value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} placeholder="Direct answer text" className="rmi-input" />
        </div>
      )}

      <div>
        <label className="rmi-field-label">Answer Explanation</label>
        <MathEditor ref={explanationRef} placeholder="Explain the correct answer (optional)" onFocus={() => setActiveEditorRef(explanationRef)} />
      </div>

      <div>
        <p className="rmi-palette-hint">Symbol palette — inserts into the last focused math field</p>
        <SymbolPalette targetRef={activeEditorRef} />
      </div>

      <div className="rmi-actions">
        <button type="button" onClick={handleSubmit} className="rmi-btn-submit">Submit Question</button>
        <button type="button" onClick={handlePreview} className="rmi-btn-outline">Preview JSON</button>
      </div>

      {preview && (
        <div>
          <div className="rmi-preview-panel">
            <h3>Student View Preview</h3>
            <div className="rmi-preview-question">
              <strong>Q: </strong>
              <MathRenderer text={preview.question_text} />
            </div>
            {preview.options && preview.options.map((opt, i) => (
              <div key={opt.id} className="rmi-preview-option" data-correct={opt.is_correct}>
                <strong>{OPTION_LABELS[i]})</strong>{" "}
                <MathRenderer text={opt.text} />
              </div>
            ))}
            {preview.answer_explanation && (
              <div className="rmi-preview-explanation">
                <strong>Explanation: </strong>
                <MathRenderer text={preview.answer_explanation} />
              </div>
            )}
          </div>
          <div style={{ marginTop: 16 }}>
            <label className="rmi-field-label">API Payload (JSON)</label>
            <pre className="rmi-json-output">{JSON.stringify(preview, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
