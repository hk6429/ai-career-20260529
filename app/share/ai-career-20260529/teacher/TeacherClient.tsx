"use client";

import { useEffect, useMemo, useState } from "react";
import WordCloud from "./WordCloud";

type Question = { id: string; prompt: string; active: boolean };
type Answer = { id: string; questionId: string; group: string; text: string; createdAt: number };

const BOARD_URL = "https://ai-career-20260529.vercel.app/share/ai-career-20260529/board";
const QR_SRC = `https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(BOARD_URL)}`;

export default function TeacherClient() {
  const [all, setAll] = useState<Question[]>([]);
  const [active, setActive] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [zoom, setZoom] = useState<Answer | null>(null);
  const [view, setView] = useState<"grid" | "paged" | "cloud">("grid");
  const [pageIdx, setPageIdx] = useState(0);
  const [newQ, setNewQ] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    let stop = false;
    async function loadQ() {
      const r = await fetch("/api/board/active", { cache: "no-store" });
      const j = await r.json();
      if (stop) return;
      setActive(j.active);
      setAll(j.all);
    }
    loadQ();
    const t = setInterval(loadQ, 5000);
    return () => { stop = true; clearInterval(t); };
  }, []);

  useEffect(() => {
    if (!active) { setAnswers([]); return; }
    let stop = false;
    async function loadA() {
      const r = await fetch(`/api/board/answers?q=${encodeURIComponent(active!.id)}`, { cache: "no-store" });
      const j = await r.json();
      if (!stop) setAnswers(j.items ?? []);
    }
    loadA();
    const t = setInterval(loadA, 2000);
    return () => { stop = true; clearInterval(t); };
  }, [active?.id]);

  const sortedAnswers = useMemo(() => [...answers].sort((a, b) => a.createdAt - b.createdAt), [answers]);

  async function setActiveQ(id: string | null) {
    setPageIdx(0);
    setZoom(null);
    const r = await fetch("/api/board/active", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const j = await r.json();
    setActive(j.active);
    setAll(j.all);
  }

  async function clearCurrent() {
    if (!active) return;
    if (!confirm(`清空『${active.prompt}』所有答案？`)) return;
    await fetch(`/api/board/answers?q=${encodeURIComponent(active.id)}`, { method: "DELETE" });
    setAnswers([]);
  }

  function nextQuestion() {
    if (!all.length) return;
    const idx = active ? all.findIndex((q) => q.id === active.id) : -1;
    const next = all[(idx + 1) % all.length];
    setActiveQ(next.id);
  }

  function prevPage() { setPageIdx((i) => Math.max(0, i - 1)); }
  function nextPage() { setPageIdx((i) => Math.min(sortedAnswers.length - 1, i + 1)); }

  async function addQuestion(activate: boolean) {
    const prompt = newQ.trim();
    if (!prompt) return;
    setAdding(true);
    try {
      const r = await fetch("/api/board/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, activate }),
      });
      const j = await r.json();
      setAll(j.all);
      setActive(j.active);
      setNewQ("");
    } finally {
      setAdding(false);
    }
  }

  async function deleteQuestion(id: string) {
    if (!confirm("刪除這個題目（含已收到的答案）？")) return;
    const r = await fetch(`/api/board/questions?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    const j = await r.json();
    setAll(j.all);
    setActive(j.active);
  }

  return (
    <main className="min-h-screen bg-warm-bg">
      <header className="bg-warm-header text-white py-4 px-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="brush-title text-xl">📋 互動白板 ‧ 老師控制台</h1>
          <p className="text-xs opacity-70">AI 職涯課 ‧ 2026.05.29 精華國中</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <a
            href={BOARD_URL}
            target="_blank"
            rel="noopener"
            className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded"
          >
            ↗ 開學生端
          </a>
          <button
            onClick={clearCurrent}
            disabled={!active}
            className="bg-red-500/20 hover:bg-red-500/40 px-3 py-1.5 rounded disabled:opacity-30"
          >
            🗑 清空本題
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-[280px_1fr_240px] gap-4">
        {/* LEFT: question list */}
        <aside className="bg-warm-card rounded-2xl border border-warm-line p-3 h-fit">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xs font-bold text-warm-muted px-1">題目清單</h2>
            <button
              onClick={nextQuestion}
              className="text-xs bg-warm-accent text-white px-2 py-1 rounded hover:opacity-80"
            >
              下一題 →
            </button>
          </div>
          <ol className="space-y-1">
            {all.map((q, i) => {
              const cur = q.id === active?.id;
              return (
                <li key={q.id} className="group relative">
                  <button
                    onClick={() => setActiveQ(q.id)}
                    className={`w-full text-left px-2 py-2 pr-7 rounded text-xs transition leading-tight ${
                      cur ? "bg-warm-accent text-white" : "hover:bg-warm-soft text-warm-ink"
                    }`}
                  >
                    <div className="font-mono text-[10px] opacity-70">Q{i + 1}</div>
                    <div className="line-clamp-2">{q.prompt}</div>
                  </button>
                  <button
                    onClick={() => deleteQuestion(q.id)}
                    title="刪除題目"
                    className={`absolute top-1.5 right-1 w-5 h-5 rounded text-xs opacity-0 group-hover:opacity-100 transition ${
                      cur ? "text-white/70 hover:text-white hover:bg-white/20" : "text-warm-muted hover:text-red-600 hover:bg-red-50"
                    }`}
                  >✕</button>
                </li>
              );
            })}
            <li>
              <button
                onClick={() => setActiveQ(null)}
                className={`w-full text-left px-2 py-2 rounded text-xs transition ${
                  active === null ? "bg-warm-muted text-white" : "hover:bg-warm-soft text-warm-muted"
                }`}
              >
                ⏸ 停止（暫停接收）
              </button>
            </li>
          </ol>

          <div className="mt-3 pt-3 border-t border-warm-line">
            <h3 className="text-xs font-bold text-warm-muted mb-1 px-1">➕ 臨時新增題目</h3>
            <textarea
              value={newQ}
              onChange={(e) => setNewQ(e.target.value.slice(0, 200))}
              rows={3}
              placeholder="打一個臨時想問的問題⋯"
              className="w-full border border-warm-line rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:border-warm-accent resize-none"
            />
            <div className="flex gap-1.5 mt-1.5">
              <button
                onClick={() => addQuestion(false)}
                disabled={!newQ.trim() || adding}
                className="flex-1 text-xs bg-warm-soft hover:bg-warm-line text-warm-ink rounded px-2 py-1.5 disabled:opacity-40"
              >加入清單</button>
              <button
                onClick={() => addQuestion(true)}
                disabled={!newQ.trim() || adding}
                className="flex-1 text-xs bg-warm-accent hover:opacity-80 text-white rounded px-2 py-1.5 disabled:opacity-40"
              >加入並開問</button>
            </div>
          </div>
        </aside>

        {/* CENTER: answer wall */}
        <section className="space-y-3">
          <div className="bg-warm-card rounded-2xl border border-warm-line p-4">
            {active ? (
              <>
                <div className="text-xs text-warm-accentDark font-bold mb-1">目前題目</div>
                <h2 className="brush-title text-lg text-warm-ink">{active.prompt}</h2>
              </>
            ) : (
              <p className="text-warm-muted text-center py-2">沒有開放題目（學生端會看到「等一下」）</p>
            )}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-warm-line">
              <div className="text-sm">
                <span className="font-bold text-warm-accentDark">{sortedAnswers.length}</span>
                <span className="text-warm-muted"> 筆答案</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setView("grid")}
                  className={`px-3 py-1 rounded ${view === "grid" ? "bg-warm-accent text-white" : "bg-warm-soft text-warm-ink"}`}
                >
                  ▦ 全部
                </button>
                <button
                  onClick={() => setView("paged")}
                  className={`px-3 py-1 rounded ${view === "paged" ? "bg-warm-accent text-white" : "bg-warm-soft text-warm-ink"}`}
                >
                  ▶ 一頁一張
                </button>
                <button
                  onClick={() => setView("cloud")}
                  className={`px-3 py-1 rounded ${view === "cloud" ? "bg-warm-accent text-white" : "bg-warm-soft text-warm-ink"}`}
                >
                  ☁ 文字雲
                </button>
              </div>
            </div>
          </div>

          {view === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sortedAnswers.length === 0 && (
                <div className="md:col-span-2 bg-warm-card rounded-2xl border border-dashed border-warm-line p-10 text-center text-warm-muted">
                  等待學生送出答案⋯
                </div>
              )}
              {sortedAnswers.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setZoom(a)}
                  className="bg-warm-card rounded-2xl border border-warm-line p-4 text-left hover:border-warm-accent hover:shadow-lg transition"
                >
                  <div className="flex items-center justify-between text-xs text-warm-muted mb-2">
                    <span className="bg-warm-accent/15 text-warm-accentDark font-bold px-2 py-0.5 rounded">{a.group}</span>
                    <span>{new Date(a.createdAt).toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <p className="text-warm-ink leading-relaxed whitespace-pre-line line-clamp-6">{a.text}</p>
                </button>
              ))}
            </div>
          )}

          {view === "cloud" && (
            <div className="bg-warm-card rounded-2xl border border-warm-line p-4">
              <WordCloud texts={sortedAnswers.map((a) => a.text)} />
              <p className="text-center text-xs text-warm-muted mt-2">
                字越大＝越多人提到 ‧ 自動中文斷詞 ‧ 取前 60 詞
              </p>
            </div>
          )}

          {view === "paged" && (
            <div className="bg-warm-card rounded-2xl border border-warm-line p-6">
              {sortedAnswers.length === 0 ? (
                <p className="text-center text-warm-muted py-10">等待答案⋯</p>
              ) : (
                <>
                  <div className="flex items-center justify-between text-xs text-warm-muted mb-3">
                    <span className="bg-warm-accent text-white font-bold px-2 py-1 rounded">
                      {sortedAnswers[pageIdx]?.group ?? "—"}
                    </span>
                    <span>{pageIdx + 1} / {sortedAnswers.length}</span>
                  </div>
                  <div className="min-h-[200px] bg-warm-soft rounded-xl p-6">
                    <p className="text-2xl md:text-3xl text-warm-ink leading-relaxed whitespace-pre-line">
                      {sortedAnswers[pageIdx]?.text}
                    </p>
                  </div>
                  <div className="flex justify-between gap-3 mt-4">
                    <button
                      onClick={prevPage}
                      disabled={pageIdx === 0}
                      className="btn flex-1 justify-center disabled:opacity-30"
                    >← 上一張</button>
                    <button
                      onClick={nextPage}
                      disabled={pageIdx >= sortedAnswers.length - 1}
                      className="btn btn-primary flex-1 justify-center disabled:opacity-30"
                    >下一張 →</button>
                  </div>
                </>
              )}
            </div>
          )}
        </section>

        {/* RIGHT: QR + status */}
        <aside className="space-y-3 lg:sticky lg:top-4 h-fit">
          <div className="bg-warm-card rounded-2xl border border-warm-line p-3 text-center">
            <h3 className="text-xs font-bold text-warm-muted mb-2">學生掃我加入</h3>
            <img
              src={QR_SRC}
              alt="QR"
              className="w-full max-w-[220px] mx-auto rounded border border-warm-line bg-white p-1"
            />
            <code className="block text-[10px] text-warm-accentDark mt-2 break-all">
              /share/ai-career-20260529/board
            </code>
          </div>
          <div className="bg-warm-card rounded-2xl border border-warm-line p-3 text-xs text-warm-muted">
            <div className="font-bold text-warm-ink mb-1">提示</div>
            <ul className="space-y-1 list-disc pl-4">
              <li>學生輸入組別後即可送出（多次送出 OK）</li>
              <li>每 2 秒自動刷新答案</li>
              <li>「下一題」會自動切換到清單下一筆</li>
              <li>「清空本題」不可復原</li>
            </ul>
          </div>
        </aside>
      </div>

      {zoom && (
        <div
          onClick={() => setZoom(null)}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-warm-card max-w-3xl w-full rounded-2xl p-8 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="bg-warm-accent text-white text-sm font-bold px-3 py-1 rounded">{zoom.group}</span>
              <button onClick={() => setZoom(null)} className="text-warm-muted hover:text-warm-ink text-xl">✕</button>
            </div>
            <p className="text-2xl md:text-3xl text-warm-ink leading-relaxed whitespace-pre-line">{zoom.text}</p>
            <p className="text-xs text-warm-muted mt-6 text-right">
              {new Date(zoom.createdAt).toLocaleTimeString("zh-TW")}
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
