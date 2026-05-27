import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "A3 數位素養回流研習 ‧ 一日全紀錄",
  description: "2026.05.23 新竹國賓大飯店 ‧ 大乃老師現場筆記",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-TW">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
