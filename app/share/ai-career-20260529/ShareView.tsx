"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { slides } from "@/content/slides";
import { workshopMeta as M } from "@/content/meta";

const STORAGE_KEY = "ai-career-20260529-notes";

export default function ShareView() {
  const [currentId, setCurrentId] = useState(slides[0].id);
  const current = slides.find((s) => s.id === currentId) ?? slides[0];
  const idx = slides.findIndex((s) => s.id === currentId);

  const [notes, setNotes] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [isPresenting, setIsPresenting] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setNotes(JSON.parse(saved));
    } catch {}
  }, []);

  async function enterPresent() {
    setIsPresenting(true);
    try {
      await document.documentElement.requestFullscreen?.();
    } catch {}
  }

  async function exitPresent() {
    setIsPresenting(false);
    try {
      if (document.fullscreenElement) await document.exitFullscreen?.();
    } catch {}
  }

  useEffect(() => {
    if (!isPresenting) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { exitPresent(); return; }
      if (e.key === "ArrowRight" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        setCurrentId((id) => {
          const i = slides.findIndex((s) => s.id === id);
          return i < slides.length - 1 ? slides[i + 1].id : id;
        });
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        setCurrentId((id) => {
          const i = slides.findIndex((s) => s.id === id);
          return i > 0 ? slides[i - 1].id : id;
        });
      }
    }
    function onFsChange() {
      if (!document.fullscreenElement) setIsPresenting(false);
    }
    window.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onFsChange);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onFsChange);
    };
  }, [isPresenting]);

  function persist(next: string[]) {
    setNotes(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }

  function submitNote() {
    const t = draft.trim();
    if (!t) return;
    persist([...notes, `[${current.id}] ${t}`]);
    setDraft("");
  }

  function removeNote(i: number) {
    persist(notes.filter((_, k) => k !== i));
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      submitNote();
    }
  }

  return (
    <main className="min-h-screen">
      <header className="bg-warm-header text-white py-10 px-6 text-center">
        <h1 className="brush-title text-3xl md:text-4xl mb-4">{M.title}</h1>
        <p className="text-warm-headerSub text-sm md:text-base">
          <span>{M.presenter}</span>
          <span className="mx-3 opacity-50">｜</span>
          <span>{M.role}</span>
          <span className="mx-3 opacity-50">｜</span>
          <span>{M.date}</span>
        </p>
        <p className="text-warm-headerSub text-sm mt-2 opacity-80">{M.durationLabel}</p>
      </header>

      <div className="bg-warm-bg border-b border-warm-line py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-2">
          <a
            href={M.resourcesHref}
            target="_blank"
            rel="noopener"
            className="text-warm-accentDark hover:underline text-sm font-medium px-2"
          >
            📚 講義與資源
          </a>
          <button className="btn btn-primary" onClick={enterPresent}>▶ 全螢幕播放</button>
          <a href="/share/ai-career-20260529/board" target="_blank" rel="noopener" className="btn btn-accent">📝 互動白板（學生）</a>
          <a href="/share/ai-career-20260529/teacher" target="_blank" rel="noopener" className="btn">🎛 老師控制台</a>
          <a href="/share/ai-career-20260529/detail" target="_blank" rel="noopener" className="btn">📋 詳細課程紀錄</a>
          <a href={M.printHref} className="btn">🖨 列印 / 存 PDF</a>
          <a href={M.fbUrl} target="_blank" rel="noopener" className="btn">📘 大乃老師 FB</a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr_320px] gap-6">
        <aside className="bg-warm-card rounded-2xl border border-warm-line p-3 h-fit lg:sticky lg:top-4">
          <h2 className="text-warm-muted text-xs font-bold mb-2 px-1">投影片目錄 ‧ {slides.length} 張</h2>
          <ol className="space-y-0.5">
            {slides.map((s) => {
              const active = s.id === currentId;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => setCurrentId(s.id)}
                    className={`w-full text-left px-2 py-1 rounded text-xs transition flex gap-1.5 items-center leading-tight ${
                      active
                        ? "bg-warm-accent text-white"
                        : "hover:bg-warm-soft text-warm-ink"
                    }`}
                  >
                    <span className={`font-mono text-[10px] ${active ? "" : "text-warm-muted"}`}>
                      {String(s.num).padStart(2, "0")}
                    </span>
                    <span className="flex-1 truncate">{s.menu ?? s.title}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </aside>

        <section className="space-y-6">
          <div className="bg-warm-card rounded-2xl border border-warm-line p-5 flex gap-5 items-center">
            <img
              src={M.qrSrc}
              alt="QR code"
              width={120}
              height={120}
              className="rounded-lg border border-warm-line bg-white"
            />
            <div className="flex-1">
              <h3 className="brush-title text-xl mb-1">掃描或輸入課程短網址</h3>
              <p className="text-sm text-warm-muted mb-2">手機鏡頭對準左邊 QR Code，或直接打開：</p>
              <code className="block bg-warm-soft text-warm-accentDark px-3 py-2 rounded-lg text-sm font-mono break-all">
                {M.shortUrl}
              </code>
            </div>
          </div>

          <article className="bg-warm-card rounded-2xl border border-warm-line p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-warm-secondary/15 text-warm-accentDark text-sm font-bold px-3 py-1 rounded-full">
                {String(current.num).padStart(2, "0")} / {String(slides.length - 1).padStart(2, "0")}
              </span>
              <span className="text-xs text-warm-muted">分區：{current.section}</span>
            </div>

            <h2 className="brush-title text-2xl md:text-3xl text-warm-accentDark mb-5 border-l-4 border-warm-accent pl-3">
              {current.title}
              {current.subtitle && <span className="text-warm-accentDark/80"> ─ {current.subtitle}</span>}
            </h2>

            <div className="aspect-[16/9] relative rounded-xl overflow-hidden border-4 border-white shadow-lg bg-warm-soft mb-6">
              <Image src={current.image} alt={current.title} fill className="object-cover" priority />
            </div>

            {current.narrative && (
              <div className="text-warm-ink leading-relaxed mb-6 whitespace-pre-line">
                {current.narrative}
              </div>
            )}

            {current.sections?.map((sec) => (
              <section key={sec.num} className="mb-5">
                <h3 className="flex items-center gap-2 font-bold text-lg text-warm-accentDark mb-2 border-l-4 border-warm-accent pl-3">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-warm-accent text-white text-xs font-mono">
                    {sec.num}
                  </span>
                  {sec.title}
                </h3>
                <ul className="space-y-1.5 pl-3">
                  {sec.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2 text-warm-ink">
                      <span className="text-warm-accent mt-1.5">●</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {!current.narrative && !current.sections && (
              <ul className="space-y-1.5">
                {current.highlights.map((h, i) => (
                  <li key={i} className="flex gap-2 text-warm-ink">
                    <span className="text-warm-accent mt-1.5">●</span>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            )}

            {current.prose && (
              <section className="mt-6 pt-5 border-t border-warm-line">
                <h3 className="text-sm font-bold text-warm-muted mb-3 flex items-center gap-2">
                  📖 段落解說（給想快速閱讀的人）
                </h3>
                <p className="text-warm-ink leading-loose text-[15px] whitespace-pre-line">
                  {current.prose}
                </p>
              </section>
            )}

            <p className="text-xs text-warm-muted mt-4 pt-3 border-t border-warm-line">
              來源筆記：{current.source}
            </p>
          </article>

          <div className="flex justify-between gap-3">
            <button
              className="btn flex-1 justify-center"
              disabled={idx <= 0}
              onClick={() => idx > 0 && setCurrentId(slides[idx - 1].id)}
            >
              ← 上一頁
            </button>
            <button
              className="btn btn-primary flex-1 justify-center"
              disabled={idx >= slides.length - 1}
              onClick={() => idx < slides.length - 1 && setCurrentId(slides[idx + 1].id)}
            >
              下一頁 →
            </button>
          </div>
        </section>

        <aside className="space-y-4 lg:sticky lg:top-4 h-fit">
          <div className="bg-warm-card rounded-2xl border border-warm-line p-4">
            <h3 className="text-warm-accentDark font-bold mb-3 flex items-center gap-2">
              💬 我的筆記
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto mb-3">
              {notes.length === 0 ? (
                <p className="text-xs text-warm-muted italic">還沒有重點，把有共鳴的句子打下來，按送出就會出現在這裡</p>
              ) : (
                notes.map((n, i) => (
                  <div
                    key={i}
                    className="bg-warm-soft rounded-lg px-3 py-2 text-sm flex justify-between gap-2"
                  >
                    <span>{n}</span>
                    <button
                      onClick={() => removeNote(i)}
                      className="text-warm-muted hover:text-warm-accentDark text-xs"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={handleKey}
              placeholder="聽到有共鳴的句子打下來，按送出就會出現在上面…"
              className="w-full border border-warm-line rounded-lg p-2 text-sm focus:outline-none focus:border-warm-accent resize-none"
              rows={3}
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-warm-muted">⌘+Enter 快速送出 ‧ 留在本機瀏覽器</span>
              <button onClick={submitNote} className="btn btn-primary text-sm py-1.5 px-4">
                送出
              </button>
            </div>
          </div>

          <div className="bg-warm-card rounded-2xl border border-warm-line p-4">
            <h3 className="font-bold mb-3 flex items-center gap-2">
              <span className="bg-warm-accent text-white text-xs font-mono px-2 py-0.5 rounded">
                {String(current.num).padStart(2, "0")}
              </span>
              📌 本頁重點（學員視角）
            </h3>
            <h4 className="brush-title text-lg mb-3">{current.title}</h4>
            <ul className="space-y-2">
              {(current.audienceKeyPoints ?? current.highlights.map((t) => ({ tone: "orange" as const, text: t }))).map((kp, i) => {
                const tone = (kp as any).tone ?? "orange";
                const style = {
                  orange: "bg-[#FBEBE2] border-l-warm-accent text-[#7A3B22]",
                  yellow: "bg-[#FAF1D9] border-l-[#D9A93C] text-[#7A5B13]",
                  green:  "bg-[#E5F1E2] border-l-warm-secondary text-[#2E5C36]",
                }[tone as "orange"|"yellow"|"green"];
                return (
                  <li
                    key={i}
                    className={`text-sm border-l-4 rounded-r-lg px-3 py-2 flex gap-2 ${style}`}
                  >
                    <span className="mt-1.5 text-xs">●</span>
                    <span>{(kp as any).text}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {current.realStory && (
            <div className="bg-warm-card rounded-2xl border border-warm-line p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-warm-accentDark">
                💭 大乃的真實情境
              </h3>
              <p className="text-sm leading-relaxed text-warm-ink whitespace-pre-line">
                {current.realStory}
              </p>
            </div>
          )}

          {current.resources && current.resources.length > 0 && (
            <div className="bg-warm-card rounded-2xl border border-warm-line p-4">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-warm-secondary">
                🔗 延伸學習與資源
              </h3>
              <ul className="space-y-2">
                {current.resources.map((r, i) => (
                  <li key={i} className="text-sm border-l-2 border-warm-secondary/40 pl-2.5">
                    {r.href ? (
                      <a
                        href={r.href}
                        target="_blank"
                        rel="noopener"
                        className="text-warm-accentDark hover:underline font-medium"
                      >
                        {r.label} ↗
                      </a>
                    ) : (
                      <span className="font-medium">{r.label}</span>
                    )}
                    {r.note && <p className="text-xs text-warm-muted mt-0.5">{r.note}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>

      <section id="resources" className="max-w-5xl mx-auto px-4 py-12 border-t border-warm-line">
        <h2 className="brush-title text-2xl text-warm-accentDark mb-6">📚 講義與資源</h2>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="bg-warm-card rounded-2xl border border-warm-line p-5">
            <h3 className="font-bold text-warm-accentDark mb-3">🛠 AI 工具入口</h3>
            <ul className="space-y-1.5 text-sm">
              <li><a href="https://gemini.google.com/" target="_blank" rel="noopener" className="text-warm-accentDark hover:underline">Google Gemini ↗</a> — 國中生帳號可直接登入</li>
              <li><a href="https://chatgpt.com/" target="_blank" rel="noopener" className="text-warm-accentDark hover:underline">ChatGPT ↗</a> — 國際最大宗</li>
              <li><a href="https://claude.ai/" target="_blank" rel="noopener" className="text-warm-accentDark hover:underline">Claude ↗</a> — 寫長文較強</li>
              <li><a href="https://copilot.microsoft.com/" target="_blank" rel="noopener" className="text-warm-accentDark hover:underline">Microsoft Copilot ↗</a> — 學校 Office 帳號可用</li>
              <li><a href="https://www.perplexity.ai/" target="_blank" rel="noopener" className="text-warm-accentDark hover:underline">Perplexity ↗</a> — 會給來源連結，適合做功課</li>
            </ul>
          </div>

          <div className="bg-warm-card rounded-2xl border border-warm-line p-5">
            <h3 className="font-bold text-warm-accentDark mb-3">🎨 AI 創作工具</h3>
            <ul className="space-y-1.5 text-sm">
              <li><a href="https://gemini.google.com/" target="_blank" rel="noopener" className="text-warm-accentDark hover:underline">Gemini ↗</a> — 文生圖、生影片（Imagen / Veo）</li>
              <li><a href="https://www.midjourney.com/" target="_blank" rel="noopener" className="text-warm-accentDark hover:underline">Midjourney ↗</a> — 最強生圖（付費）</li>
              <li><a href="https://canva.com/" target="_blank" rel="noopener" className="text-warm-accentDark hover:underline">Canva ↗</a> — 內建 AI 做海報 / 簡報</li>
              <li><a href="https://notebooklm.google.com/" target="_blank" rel="noopener" className="text-warm-accentDark hover:underline">NotebookLM ↗</a> — 上傳資料生 Podcast / 摘要</li>
              <li><a href="https://elevenlabs.io/" target="_blank" rel="noopener" className="text-warm-accentDark hover:underline">ElevenLabs ↗</a> — AI 配音</li>
            </ul>
          </div>

          <div className="bg-warm-card rounded-2xl border border-warm-line p-5">
            <h3 className="font-bold text-warm-accentDark mb-3">🔍 判斷力 ‧ 事實查核</h3>
            <ul className="space-y-1.5 text-sm">
              <li><a href="https://tfc-taiwan.org.tw/" target="_blank" rel="noopener" className="text-warm-accentDark hover:underline">台灣事實查核中心 ↗</a></li>
              <li><a href="https://www.mygopen.com/" target="_blank" rel="noopener" className="text-warm-accentDark hover:underline">MyGoPen 美玉姨 ↗</a> — LINE 加好友幫忙查</li>
              <li><a href="https://cofacts.tw/" target="_blank" rel="noopener" className="text-warm-accentDark hover:underline">Cofacts 真的假的 ↗</a> — 群眾查核</li>
              <li><a href="https://fakenews.cy.gov.tw/" target="_blank" rel="noopener" className="text-warm-accentDark hover:underline">監察院假訊息辨識網 ↗</a></li>
            </ul>
          </div>

          <div className="bg-warm-card rounded-2xl border border-warm-line p-5">
            <h3 className="font-bold text-warm-accentDark mb-3">📰 課堂引用的新聞</h3>
            <ul className="space-y-1.5 text-sm">
              <li><a href="https://www.reuters.com/technology/meta-cuts-thousands-jobs-2024/" target="_blank" rel="noopener" className="text-warm-accentDark hover:underline">Meta 裁員報導（Reuters）↗</a></li>
              <li><a href="https://www.bloomberg.com/news/articles/ibm-pause-hiring-ai" target="_blank" rel="noopener" className="text-warm-accentDark hover:underline">IBM 凍結 7,800 職位（Bloomberg）↗</a></li>
              <li><a href="https://www.theverge.com/2024/1/8/24030728/duolingo-layoffs-ai-translators" target="_blank" rel="noopener" className="text-warm-accentDark hover:underline">Duolingo 裁翻譯（The Verge）↗</a></li>
              <li><a href="https://www.linkedin.com/business/learning/blog/top-skills-and-courses/most-in-demand-skills" target="_blank" rel="noopener" className="text-warm-accentDark hover:underline">LinkedIn 軟實力報告 ↗</a></li>
            </ul>
          </div>

          <div className="bg-warm-card rounded-2xl border border-warm-line p-5">
            <h3 className="font-bold text-warm-accentDark mb-3">📖 延伸閱讀</h3>
            <ul className="space-y-1.5 text-sm">
              <li>《與成功有約》柯維（七個習慣）— 班級書櫃可借</li>
              <li>《原子習慣》James Clear — 持續學習的方法論</li>
              <li>《釣愚》Akerlof / Shiller — 學會看穿廣告與訊息</li>
              <li>《被討厭的勇氣》岸見一郎 — 同理與表達的底層</li>
            </ul>
          </div>

          <div className="bg-warm-card rounded-2xl border border-warm-line p-5">
            <h3 className="font-bold text-warm-accentDark mb-3">🔗 大乃老師</h3>
            <ul className="space-y-1.5 text-sm">
              <li><a href="https://www.facebook.com/hk6429" target="_blank" rel="noopener" className="text-warm-accentDark hover:underline">FB 粉專 ↗</a> — 教學現場、AI 應用、自我領導力</li>
              <li><a href="https://naicheng.tw/" target="_blank" rel="noopener" className="text-warm-accentDark hover:underline">個人網站 ↗</a></li>
              <li>本日課程網址：<code className="bg-warm-soft px-2 py-0.5 rounded text-warm-accentDark">{M.shortUrl}</code></li>
              <li>互動白板：<a href="/share/ai-career-20260529/board" className="text-warm-accentDark hover:underline">/board</a></li>
              <li>老師控制台：<a href="/share/ai-career-20260529/teacher" className="text-warm-accentDark hover:underline">/teacher</a></li>
            </ul>
          </div>
        </div>
      </section>

      <footer className="text-center py-12 text-warm-muted text-sm border-t border-warm-line mt-8">
        <p>{M.presenter} ‧ {M.role}</p>
        <p className="text-xs mt-2 opacity-70">課程紀錄 ‧ 2026.05.29（五）‧ 新竹縣精華國中</p>
      </footer>

      {isPresenting && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col">
          <div className="flex items-center justify-between px-6 py-3 text-white/80 text-sm">
            <div className="flex items-center gap-3">
              <span className="font-mono bg-white/10 px-2 py-0.5 rounded">
                {String(current.num).padStart(2, "0")} / {String(slides.length - 1).padStart(2, "0")}
              </span>
              <span className="opacity-70">{current.section}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="opacity-50 text-xs hidden md:inline">← → 翻頁 ‧ ESC 離開</span>
              <button
                onClick={exitPresent}
                className="px-3 py-1 rounded bg-white/10 hover:bg-white/20 text-sm"
              >
                ✕ 離開全螢幕
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 flex items-center justify-center px-6 pb-2">
            <div className="h-full max-h-full w-auto max-w-full aspect-[16/9] relative bg-warm-soft rounded-lg overflow-hidden shadow-2xl">
              <Image src={current.image} alt={current.title} fill className="object-cover" priority />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent text-white p-6">
                <h2 className="text-2xl md:text-4xl font-bold mb-1">{current.title}</h2>
                {current.subtitle && (
                  <p className="text-base md:text-lg opacity-90">{current.subtitle}</p>
                )}
              </div>
            </div>
          </div>

          <button
            aria-label="上一頁"
            disabled={idx <= 0}
            onClick={() => idx > 0 && setCurrentId(slides[idx - 1].id)}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl disabled:opacity-20"
          >‹</button>
          <button
            aria-label="下一頁"
            disabled={idx >= slides.length - 1}
            onClick={() => idx < slides.length - 1 && setCurrentId(slides[idx + 1].id)}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl disabled:opacity-20"
          >›</button>

          <div className="flex items-center justify-center gap-4 px-6 pb-5">
            <button
              disabled={idx <= 0}
              onClick={() => idx > 0 && setCurrentId(slides[idx - 1].id)}
              className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium disabled:opacity-20"
            >← 上一頁</button>
            <span className="font-mono text-white/60 text-sm">
              {String(current.num).padStart(2, "0")} / {String(slides.length - 1).padStart(2, "0")}
            </span>
            <button
              disabled={idx >= slides.length - 1}
              onClick={() => idx < slides.length - 1 && setCurrentId(slides[idx + 1].id)}
              className="px-5 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-medium disabled:opacity-20"
            >下一頁 →</button>
          </div>
        </div>
      )}
    </main>
  );
}
