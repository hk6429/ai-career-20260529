import Link from "next/link";

export default function Home() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-24 text-center">
      <h1 className="brush-title text-5xl mb-6">大乃老師 ‧ AI 職涯課</h1>
      <p className="text-lg text-chalk-ink/70 mb-12">給國中生的 90 分鐘 AI 職涯預備課程</p>
      <Link
        href="/share/ai-career-20260529"
        className="ribbon text-base"
      >
        會 AI 的人，淘汰不會 AI 的人 ‧ 2026.05.29 ‧ 新竹縣精華國中
      </Link>
    </main>
  );
}
