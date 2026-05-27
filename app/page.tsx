import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24 text-center">
      <h1 className="brush-title text-4xl md:text-5xl mb-6 leading-snug">
        會 AI 的人，淘汰不會 AI 的人<br/>
        <span className="text-3xl md:text-4xl">— 國中生 AI 職涯課</span>
      </h1>
      <p className="text-lg text-chalk-ink/70 mb-12">2026.05.29（五）‧ 新竹縣精華國中 ‧ 90 分鐘</p>
      <Link
        href="/share/ai-career-20260529"
        className="ribbon text-base"
      >
        進入課程網站
      </Link>
    </main>
  );
}
