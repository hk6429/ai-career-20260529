"use client";

import { useEffect, useRef, useState } from "react";

type Question = { id: string; prompt: string; active: boolean };

const GROUP_KEY = "ai-career-board-group";

export default function BoardClient() {
  const [group, setGroup] = useState("");
  const [active, setActive] = useState<Question | null>(null);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState<string[]>([]);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");
  const lastQ = useRef<string | null>(null);

  useEffect(() => {
    try {
      const g = localStorage.getItem(GROUP_KEY);
      if (g) setGroup(g);
    } catch {}
  }, []);

  useEffect(() => {
    let stop = false;
    async function tick() {
      try {
        const r = await fetch("/api/board/active", { cache: "no-store" });
        const j = await r.json();
        if (!stop) {
          setActive(j.active);
          if (j.active?.id !== lastQ.current) {
            lastQ.current = j.active?.id ?? null;
            setText("");
          }
        }
      } catch {}
    }
    tick();
    const t = setInterval(tick, 2500);
    return () => { stop = true; clearInterval(t); };
  }, []);

  function saveGroup(v: string) {
    setGroup(v);
    try { localStorage.setItem(GROUP_KEY, v); } catch {}
  }

  async function submit() {
    if (!active || !text.trim()) return;
    setStatus("sending");
    try {
      const r = await fetch("/api/board/answers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionId: active.id, group: group || "匿名", text }),
      });
      if (!r.ok) throw new Error("send failed");
      setSubmitted((s) => [...s, `[${active.id}] ${text}`]);
      setText("");
      setStatus("ok");
      setTimeout(() => setStatus("idle"), 1500);
    } catch {
      setStatus("err");
    }
  }

  return (
    <main className="min-h-screen bg-warm-bg p-4 max-w-2xl mx-auto">
      <header className="text-center py-4">
        <h1 className="brush-title text-2xl text-warm-accentDark">📝 互動白板</h1>
        <p className="text-sm text-warm-muted">大乃老師 ‧ AI 職涯課 ‧ 2026.05.29</p>
      </header>

      <div className="bg-warm-card rounded-2xl border border-warm-line p-4 mb-4">
        <label className="block text-xs font-bold text-warm-muted mb-1">你的組別／暱稱</label>
        <input
          value={group}
          onChange={(e) => saveGroup(e.target.value.slice(0, 30))}
          placeholder="例如：第 3 組、阿翔、小明"
          className="w-full border border-warm-line rounded-lg px-3 py-2 text-base focus:outline-none focus:border-warm-accent"
        />
      </div>

      {!active ? (
        <div className="bg-warm-card rounded-2xl border border-warm-line p-6 text-center">
          <div className="text-4xl mb-2">⏸</div>
          <p className="text-warm-muted">老師還沒開始問問題，請等一下下。</p>
        </div>
      ) : (
        <div className="bg-warm-card rounded-2xl border-2 border-warm-accent p-5">
          <div className="text-xs text-warm-accentDark font-bold mb-2">目前題目</div>
          <h2 className="brush-title text-xl text-warm-ink mb-4 leading-relaxed whitespace-pre-line">
            {active.prompt}
          </h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 400))}
            rows={5}
            placeholder="把你的答案打在這裡⋯（最多 400 字）"
            className="w-full border border-warm-line rounded-lg px-3 py-3 text-base focus:outline-none focus:border-warm-accent resize-none"
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-xs text-warm-muted">{text.length} / 400</span>
            <button
              onClick={submit}
              disabled={!text.trim() || status === "sending"}
              className="btn btn-primary"
            >
              {status === "sending" ? "送出中⋯" : status === "ok" ? "✓ 已送出" : "送出"}
            </button>
          </div>
          {status === "err" && <p className="text-red-600 text-xs mt-2">送出失敗，再試一次</p>}
        </div>
      )}

      {submitted.length > 0 && (
        <div className="bg-warm-soft rounded-2xl p-4 mt-4">
          <div className="text-xs font-bold text-warm-muted mb-2">📜 你已送出 {submitted.length} 筆</div>
          <ul className="space-y-1 text-sm">
            {submitted.slice(-5).reverse().map((s, i) => (
              <li key={i} className="text-warm-ink/80">• {s}</li>
            ))}
          </ul>
        </div>
      )}

      <footer className="text-center text-xs text-warm-muted py-6 opacity-60">
        ai-career-20260529.vercel.app/share/ai-career-20260529/board
      </footer>
    </main>
  );
}
