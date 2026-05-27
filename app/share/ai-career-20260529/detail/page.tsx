import Link from "next/link";
import Image from "next/image";
import { slides, type Slide } from "@/content/slides";
import { workshopMeta as M } from "@/content/meta";

export const metadata = {
  title: "詳細課程紀錄 ‧ 會 AI 的人，淘汰不會 AI 的人 2026.05.29",
};

const SECTION_ORDER = ["開場", "現實", "能力", "實戰", "行動"] as const;

const SECTION_LABEL: Record<string, string> = {
  開場: "開場 ‧ 喚醒注意力（10 分鐘）",
  現實: "現實 ‧ AI 正在淘汰誰（15 分鐘）",
  能力: "能力 ‧ AI 搶不走的五個核心能力（20 分鐘）",
  實戰: "實戰 ‧ 現場演練（25 分鐘）",
  行動: "行動 ‧ 你現在該做什麼（15 分鐘）",
};

export default function DetailPage() {
  return (
    <main className="min-h-screen">
      <header className="bg-warm-header text-white py-8 px-6">
        <div className="max-w-4xl mx-auto flex justify-between items-center gap-4">
          <div>
            <h1 className="brush-title text-2xl md:text-3xl mb-2">📋 詳細課程紀錄</h1>
            <p className="text-warm-headerSub text-sm">
              {M.title} ‧ {M.date}
            </p>
          </div>
          <Link
            href="/share/ai-career-20260529"
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            ← 回投影片模式
          </Link>
        </div>
      </header>

      <div className="bg-warm-soft border-b border-warm-line py-3 px-6 text-center text-sm text-warm-accentDark">
        條列式 + 詳細補充版 ‧ 給想細讀的老師與學生 ‧ {slides.length} 段全紀錄
      </div>

      <nav className="max-w-4xl mx-auto px-6 py-6">
        <h2 className="brush-title text-xl mb-3 text-warm-accentDark">快速跳轉</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {SECTION_ORDER.map((sec) => {
            const count = slides.filter((s) => s.section === sec).length;
            return (
              <a
                key={sec}
                href={`#sec-${sec}`}
                className="bg-warm-card border border-warm-line rounded-lg px-3 py-2 hover:bg-warm-soft transition"
              >
                <span className="font-bold">{SECTION_LABEL[sec]}</span>
                <span className="text-xs text-warm-muted ml-2">{count} 段</span>
              </a>
            );
          })}
        </div>
      </nav>

      <article className="max-w-4xl mx-auto px-6 pb-24">
        {SECTION_ORDER.map((sec) => {
          const items = slides.filter((s) => s.section === sec);
          if (!items.length) return null;
          return (
            <section
              key={sec}
              id={`sec-${sec}`}
              className="mt-12 pt-8 border-t-2 border-warm-accent/40"
            >
              <h2 className="brush-title text-2xl md:text-3xl text-warm-accentDark mb-6">
                {SECTION_LABEL[sec]}
                <span className="text-sm text-warm-muted font-normal ml-3">
                  ({items.length} 段)
                </span>
              </h2>
              <div className="space-y-10">
                {items.map((s) => (
                  <SlideDetail key={s.id} s={s} />
                ))}
              </div>
            </section>
          );
        })}
      </article>

      <footer className="text-center py-12 text-warm-muted text-sm border-t border-warm-line">
        <p>
          回到{" "}
          <Link
            href="/share/ai-career-20260529"
            className="text-warm-accentDark hover:underline"
          >
            投影片模式
          </Link>{" "}
          ‧ {M.presenter}
        </p>
      </footer>
    </main>
  );
}

function SlideDetail({ s }: { s: Slide }) {
  return (
    <article
      id={`slide-${s.id}`}
      className="bg-warm-card rounded-2xl border border-warm-line p-6 shadow-sm"
    >
      <header className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-warm-accent text-white font-mono text-xs px-2 py-0.5 rounded">
            {String(s.num).padStart(2, "0")}
          </span>
          <span className="text-xs text-warm-muted">{s.section}</span>
        </div>
        <h3 className="brush-title text-xl md:text-2xl text-warm-accentDark border-l-4 border-warm-accent pl-3">
          {s.title}
          {s.subtitle && (
            <span className="text-warm-accentDark/70 text-base"> ─ {s.subtitle}</span>
          )}
        </h3>
      </header>

      <div className="aspect-[16/9] relative rounded-xl overflow-hidden bg-warm-soft mb-5 border border-warm-line">
        <Image src={s.image} alt={s.title} fill className="object-cover" />
      </div>

      {s.narrative && (
        <div className="mb-5 text-warm-ink leading-relaxed whitespace-pre-line">
          {s.narrative}
        </div>
      )}

      {s.sections?.map((sub) => (
        <section key={sub.num} className="mb-4">
          <h4 className="font-bold text-warm-accentDark mb-2 flex items-center gap-2">
            <span className="bg-warm-accent text-white text-xs w-5 h-5 rounded inline-flex items-center justify-center font-mono">
              {sub.num}
            </span>
            {sub.title}
          </h4>
          <ul className="space-y-1 pl-2">
            {sub.bullets.map((b, i) => (
              <li key={i} className="flex gap-2 text-warm-ink text-[15px]">
                <span className="text-warm-accent mt-1.5">●</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {s.prose && (
        <section className="mt-5 pt-4 border-t border-warm-line">
          <h4 className="text-xs font-bold text-warm-muted mb-2">📖 段落解說</h4>
          <p className="text-warm-ink leading-loose text-[15px] whitespace-pre-line">
            {s.prose}
          </p>
        </section>
      )}

      {!s.narrative && !s.sections && !s.prose && (
        <ul className="space-y-1.5">
          {s.highlights.map((h, i) => (
            <li key={i} className="flex gap-2 text-warm-ink">
              <span className="text-warm-accent mt-1.5">●</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>
      )}

      {(s.audienceKeyPoints || s.realStory || s.resources) && (
        <div className="grid md:grid-cols-2 gap-3 mt-5 pt-4 border-t border-warm-line">
          {s.audienceKeyPoints && (
            <div className="bg-warm-soft/50 rounded-lg p-3">
              <h5 className="text-xs font-bold text-warm-accentDark mb-2">📌 學員視角重點</h5>
              <ul className="space-y-1.5 text-sm">
                {s.audienceKeyPoints.map((kp, i) => (
                  <li key={i} className="flex gap-1.5">
                    <span className="mt-1 text-warm-accent text-[10px]">●</span>
                    <span>{kp.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {s.realStory && (
            <div className="bg-warm-soft/50 rounded-lg p-3">
              <h5 className="text-xs font-bold text-warm-accentDark mb-2">💭 大乃的真實情境</h5>
              <p className="text-sm leading-relaxed whitespace-pre-line">{s.realStory}</p>
            </div>
          )}
          {s.resources && s.resources.length > 0 && (
            <div className="md:col-span-2 bg-warm-soft/50 rounded-lg p-3">
              <h5 className="text-xs font-bold text-warm-secondary mb-2">🔗 延伸學習與資源</h5>
              <ul className="grid md:grid-cols-2 gap-1 text-sm">
                {s.resources.map((r, i) => (
                  <li key={i}>
                    {r.href ? (
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener"
                        className="text-warm-accentDark hover:underline"
                      >
                        {r.label} ↗
                      </a>
                    ) : (
                      <span className="font-medium">{r.label}</span>
                    )}
                    {r.note && <span className="text-xs text-warm-muted"> — {r.note}</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <p className="text-xs text-warm-muted mt-4">來源筆記：{s.source}</p>
    </article>
  );
}
