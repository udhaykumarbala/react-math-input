# react-math-input

React components for math equation input. Built on [MathLive](https://mathlive.io) and [KaTeX](https://katex.org).

- **MathEditor** — textarea with an `[fx]` button that opens a visual equation composer. Type text normally, insert `$LaTeX$` at cursor.
- **SymbolPalette** — tabbed grid of 65+ math symbols (fractions, Greek, calculus, matrices) that insert into the active editor.
- **MathRenderer** — renders stored `$...$` and `$$...$$` LaTeX to formatted equations via KaTeX.
- **QuestionForm** — complete MCQ question creation form combining all three components (example/starting point).

## Install

```bash
npm install react-math-input mathlive katex
```

## Quick Start

```tsx
import { MathEditor, SymbolPalette, MathRenderer, type MathEditorProps } from 'react-math-input'
import 'react-math-input/styles.css'
import 'katex/dist/katex.min.css'
import { useRef } from 'react'
import type { MathEditorRef } from 'react-math-input'

function App() {
  const editorRef = useRef<MathEditorRef>(null)

  return (
    <div>
      <MathEditor
        ref={editorRef}
        placeholder="Type here... click [fx] for equations"
        onChange={(value) => console.log(value)}
      />
      <SymbolPalette targetRef={editorRef} />
    </div>
  )
}
```

## Components

### `<MathEditor>`

A textarea-first editor with an inline MathLive equation composer.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `placeholder` | `string` | `""` | Textarea placeholder text |
| `initialValue` | `string` | `""` | Initial content |
| `value` | `string` | — | Controlled value |
| `defaultValue` | `string` | — | Uncontrolled default value |
| `name` | `string` | — | Form field name (included in native form submissions) |
| `onChange` | `(value: string) => void` | — | Called when content changes |
| `onFocus` | `() => void` | — | Called when editor receives focus |
| `onBlur` | `() => void` | — | Called when editor loses focus |
| `showPreview` | `boolean` | `true` | Show live KaTeX preview when content has `$...$` |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Editor size variant |
| `disabled` | `boolean` | `false` | Disable all interaction |
| `readOnly` | `boolean` | `false` | Allow selection/copy but prevent editing |
| `error` | `boolean` | `false` | Show error styling |
| `className` | `string` | `""` | Additional CSS class |

**Ref methods** (`MathEditorRef`):
- `getValue()` — returns the current text content
- `setValue(latex)` — sets the content
- `getMathField()` — returns the MathLive MathfieldElement (or null if composer is closed)
- `isMathMode()` — whether the composer is open
- `focus()` — focuses the editor

### `<SymbolPalette>`

Tabbed symbol grid that inserts LaTeX into a MathEditor's composer.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `targetRef` | `RefObject<MathEditorRef>` | — | Reference to the MathEditor to insert into |
| `categories` | `Record<string, Symbol[]>` | all | Subset of symbol categories to display |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Symbol button size variant |
| `disabled` | `boolean` | `false` | Disable all symbol buttons |
| `className` | `string` | `""` | Additional CSS class |

**Categories:** Common, Greek, Operators, Calculus, Matrices

### `<MathRenderer>`

Renders text containing `$...$` (inline) and `$$...$$` (display) LaTeX.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | `string` | — | Text with LaTeX delimiters |
| `onError` | `(latex: string, error: Error) => void` | — | Called when a LaTeX expression fails to parse |
| `fallback` | `(latex: string) => string` | — | Returns custom HTML for invalid LaTeX |
| `className` | `string` | `""` | Additional CSS class |

```tsx
<MathRenderer text="Solve $x^{2} + 3x - 4 = 0$ for $x$" />
```

### `<QuestionForm>`

Complete MCQ question creation form. Use as-is or as a reference for building your own.

| Prop | Type | Description |
|------|------|-------------|
| `onSubmit` | `(payload: QuestionPayload) => void` | Called with serialized question data |
| `className` | `string` | Additional CSS class |

### `renderLatexString(text: string): string`

Utility function that parses `$...$` and `$$...$$` in a string and returns rendered HTML. Useful for server-side rendering or custom components.

### `SYMBOL_CATEGORIES`

The symbol data used by SymbolPalette. Exported so you can customize, filter, or extend it:

```tsx
import { SYMBOL_CATEGORIES } from 'react-math-input'

// Use only Greek and Calculus tabs
const mySymbols = {
  Greek: SYMBOL_CATEGORIES.Greek,
  Calculus: SYMBOL_CATEGORIES.Calculus,
}
```

## Theming

Override CSS variables to match your design system:

```css
.my-app .rmi-editor, .my-app .rmi-palette {
  --rmi-color-primary: #10b981;
  --rmi-radius: 12px;
}
```

| Variable | Description |
|----------|-------------|
| `--rmi-color-primary` | Accent color for buttons and focus rings |
| `--rmi-color-bg` | Background color |
| `--rmi-color-border` | Border color |
| `--rmi-color-text` | Text color |
| `--rmi-color-error` | Error state color |
| `--rmi-font-size` | Base font size |
| `--rmi-radius` | Border radius |

## Dark Mode

Dark mode works automatically via `prefers-color-scheme` with zero config.

To toggle manually:

```html
<div data-theme="dark"><MathEditor /></div>
<!-- or -->
<div className="rmi-dark"><MathEditor /></div>
```

## Size Variants

```tsx
<MathEditor size="sm" />
<MathEditor size="md" />  // default
<MathEditor size="lg" />
```

## Form Integration

### react-hook-form

```tsx
const { field } = useController({ name: 'equation', control })
<MathEditor
  value={field.value}
  onChange={field.onChange}
  onBlur={field.onBlur}
  ref={field.ref}
  error={!!errors.equation}
/>
```

### Native form

```tsx
<form>
  <MathEditor name="equation" />
  <button type="submit">Submit</button>
</form>
```

### Controlled vs uncontrolled

```tsx
<MathEditor value={latex} onChange={setLatex} />
<MathEditor defaultValue="$x^2$" />
```

## States

```tsx
<MathEditor disabled />
<MathEditor readOnly />
<MathEditor error />
```

## How It Works

1. User types in a standard textarea (supports newlines, mixed content)
2. Clicking `[fx]` opens a MathLive equation composer below the textarea
3. User builds the equation visually or types LaTeX
4. Clicking "Insert" places `$LaTeX$` at the cursor position in the textarea
5. A live preview renders the formatted content below

**Storage format:** `"Solve $x^{2} + 3x - 4 = 0$ for $x$"` — plain text with `$...$` delimiters. Store as a regular string in any database.

## Peer Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18 or ^19 | UI framework |
| `react-dom` | ^18 or ^19 | DOM rendering |
| `mathlive` | >=0.100.0 | Equation editor (lazy-loaded on first `[fx]` click) |
| `katex` | >=0.16.0 | Equation renderer |

## License

MIT
