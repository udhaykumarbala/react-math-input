import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "react-math-input — React Components for Math Equation Input",
  description:
    "Open-source React components for math equation input. MathLive-powered editor, symbol palette with 65+ symbols, and KaTeX renderer. Build forms with fractions, matrices, integrals, and more.",
  keywords: [
    "react", "math", "latex", "input", "equation", "editor", "mathlive",
    "katex", "component", "formula", "matrix", "math-input",
  ],
  openGraph: {
    title: "react-math-input",
    description: "React components for math equation input — editor, symbol palette, renderer",
    type: "website",
    url: "https://udhaykumarbala.github.io/react-math-input",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}
