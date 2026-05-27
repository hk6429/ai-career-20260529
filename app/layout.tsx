import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "會 AI 的人，淘汰不會 AI 的人 — 國中生 AI 職涯課",
  description: "2026.05.29（五）新竹縣精華國中 ‧ 大乃老師 ‧ 90 分鐘 AI 職涯預備課程",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
