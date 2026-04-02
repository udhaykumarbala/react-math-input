import LiveDemo from "./LiveDemo";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-block px-3 py-1 mb-4 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
            v1.0.1 — Open Source
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            react-math-input
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            React components for math equation input. MathLive-powered editor with a
            symbol palette and KaTeX renderer. Build forms with fractions, matrices,
            integrals, and more.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="https://www.npmjs.com/package/react-math-input"
              className="px-5 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              npm install react-math-input
            </a>
            <a
              href="https://github.com/udhaykumarbala/react-math-input"
              className="px-5 py-2.5 bg-white text-gray-700 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
          <div>
            <div className="text-2xl mb-2">fx</div>
            <h3 className="font-semibold text-gray-900 mb-1">MathEditor</h3>
            <p className="text-sm text-gray-500">
              Textarea with an [fx] button that opens a visual equation composer.
              Type text normally, insert equations at cursor.
            </p>
          </div>
          <div>
            <div className="text-2xl mb-2">&Sigma;</div>
            <h3 className="font-semibold text-gray-900 mb-1">SymbolPalette</h3>
            <p className="text-sm text-gray-500">
              65+ math symbols across 5 categories — Common, Greek, Operators,
              Calculus, and Matrices. Click to insert.
            </p>
          </div>
          <div>
            <div className="text-2xl mb-2">$x$</div>
            <h3 className="font-semibold text-gray-900 mb-1">MathRenderer</h3>
            <p className="text-sm text-gray-500">
              Renders stored $...$ and $$...$$ LaTeX into formatted equations via
              KaTeX. Use for student-facing display.
            </p>
          </div>
        </div>
      </section>

      {/* Live Demo */}
      <section className="border-b border-gray-200" id="demo">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Live Demo</h2>
          <p className="text-sm text-gray-500 mb-6">
            Try it out — click <span className="px-1.5 py-0.5 text-[10px] font-semibold italic bg-gray-100 border border-gray-300 rounded">fx</span> on
            any field, build an equation, and insert it.
          </p>
          <LiveDemo />
        </div>
      </section>

      {/* Installation */}
      <section className="border-b border-gray-200" id="install">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Installation</h2>
          <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm font-mono overflow-x-auto">
            npm install react-math-input mathlive katex
          </pre>

          <h3 className="text-lg font-semibold text-gray-900 mt-8 mb-3">Quick Start</h3>
          <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre">{`import { MathEditor, SymbolPalette, MathRenderer } from 'react-math-input'
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
}`}</pre>
        </div>
      </section>

      {/* API Reference */}
      <section className="border-b border-gray-200" id="api">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">API Reference</h2>

          {/* MathEditor */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 font-mono">&lt;MathEditor&gt;</h3>
            <p className="text-sm text-gray-600 mb-4">
              A textarea-first editor with an inline MathLive equation composer.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Prop</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Type</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Default</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-4 py-2 font-mono text-xs">placeholder</td><td className="px-4 py-2 text-gray-500">string</td><td className="px-4 py-2 text-gray-400">{`""`}</td><td className="px-4 py-2 text-gray-600">Textarea placeholder text</td></tr>
                  <tr><td className="px-4 py-2 font-mono text-xs">initialValue</td><td className="px-4 py-2 text-gray-500">string</td><td className="px-4 py-2 text-gray-400">{`""`}</td><td className="px-4 py-2 text-gray-600">Initial content</td></tr>
                  <tr><td className="px-4 py-2 font-mono text-xs">onChange</td><td className="px-4 py-2 text-gray-500">(value: string) =&gt; void</td><td className="px-4 py-2 text-gray-400">-</td><td className="px-4 py-2 text-gray-600">Called when content changes</td></tr>
                  <tr><td className="px-4 py-2 font-mono text-xs">showPreview</td><td className="px-4 py-2 text-gray-500">boolean</td><td className="px-4 py-2 text-gray-400">true</td><td className="px-4 py-2 text-gray-600">Show live KaTeX preview below</td></tr>
                  <tr><td className="px-4 py-2 font-mono text-xs">className</td><td className="px-4 py-2 text-gray-500">string</td><td className="px-4 py-2 text-gray-400">{`""`}</td><td className="px-4 py-2 text-gray-600">Additional CSS class</td></tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-gray-600 mt-3"><strong>Ref methods:</strong> getValue(), setValue(latex), getMathField(), isMathMode(), focus()</p>
          </div>

          {/* SymbolPalette */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 font-mono">&lt;SymbolPalette&gt;</h3>
            <p className="text-sm text-gray-600 mb-4">
              Tabbed symbol grid that inserts LaTeX into a MathEditor{"'"}s composer. Categories: Common, Greek, Operators, Calculus, Matrices.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Prop</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Type</th>
                    <th className="px-4 py-2 text-left font-medium text-gray-600">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr><td className="px-4 py-2 font-mono text-xs">targetRef</td><td className="px-4 py-2 text-gray-500">RefObject&lt;MathEditorRef&gt;</td><td className="px-4 py-2 text-gray-600">Reference to the MathEditor to insert into</td></tr>
                  <tr><td className="px-4 py-2 font-mono text-xs">className</td><td className="px-4 py-2 text-gray-500">string</td><td className="px-4 py-2 text-gray-600">Additional CSS class</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* MathRenderer */}
          <div className="mb-10">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 font-mono">&lt;MathRenderer&gt;</h3>
            <p className="text-sm text-gray-600 mb-4">
              Renders text containing $...$ (inline) and $$...$$ (display) LaTeX delimiters.
            </p>
            <pre className="p-3 bg-gray-900 text-gray-100 rounded-lg text-sm font-mono overflow-x-auto">
              {`<MathRenderer text="Solve $x^{2} + 3x - 4 = 0$ for $x$" />`}
            </pre>
          </div>

          {/* Customization */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Customizing Symbols</h3>
            <p className="text-sm text-gray-600 mb-3">
              The symbol data is exported so you can filter or extend it:
            </p>
            <pre className="p-3 bg-gray-900 text-gray-100 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre">{`import { SYMBOL_CATEGORIES } from 'react-math-input'

// Use only Greek and Calculus
const mySymbols = {
  Greek: SYMBOL_CATEGORIES.Greek,
  Calculus: SYMBOL_CATEGORIES.Calculus,
}`}</pre>
          </div>
        </div>
      </section>

      {/* Storage */}
      <section className="border-b border-gray-200" id="storage">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How Storage Works</h2>
          <p className="text-sm text-gray-600 mb-4">
            Equations are stored as plain text with $...$ delimiters. No special database columns needed.
          </p>
          <pre className="p-4 bg-gray-900 text-gray-100 rounded-lg text-sm font-mono overflow-x-auto whitespace-pre">{`// Stored in your database as a regular string:
"Solve $x^{2} + 3x - 4 = 0$ for $x$"

// Render it back with:
<MathRenderer text={questionFromDB} />`}</pre>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-400">
        <p>
          MIT License.{" "}
          <a href="https://github.com/udhaykumarbala/react-math-input" className="text-blue-500 hover:underline">
            GitHub
          </a>{" "}
          &middot;{" "}
          <a href="https://www.npmjs.com/package/react-math-input" className="text-blue-500 hover:underline">
            npm
          </a>
        </p>
      </footer>
    </main>
  );
}
