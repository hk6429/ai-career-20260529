"use client";

import { useEffect, useMemo, useState } from "react";

const STOPWORDS = new Set([
  "的","了","是","我","你","他","她","它","們","也","都","就","和","與","及","或","但","而","不","沒","很","太","還",
  "這","那","有","在","會","要","能","可","以","把","被","給","讓","對","從","到","於","為","因","所","之","其","然",
  "一","個","這個","那個","什麼","怎麼","怎樣","如何","可以","因為","所以","但是","然後","覺得","可能","應該","或者",
  "我們","你們","他們","自己","一個","一些","這些","那些","這樣","那樣","還有","就是","只是","真的","其實","非常",
  "AI","ai","Ai",
]);

type Word = { text: string; count: number };

export default function WordCloud({ texts }: { texts: string[] }) {
  const [seg, setSeg] = useState<((s: string) => { w: string }[]) | null>(null);

  useEffect(() => {
    let cancelled = false;
    import("segmentit").then((m) => {
      const inst = m.useDefault(new m.Segment());
      if (!cancelled) setSeg(() => (s: string) => inst.doSegment(s) as { w: string }[]);
    });
    return () => { cancelled = true; };
  }, []);

  const words = useMemo<Word[]>(() => {
    if (!seg || texts.length === 0) return [];
    const freq = new Map<string, number>();
    for (const t of texts) {
      let tokens: string[];
      try {
        tokens = seg(t).map((x) => x.w);
      } catch {
        tokens = t.split(/\s+/);
      }
      for (const raw of tokens) {
        const w = raw.trim();
        if (w.length < 2) continue;
        if (STOPWORDS.has(w)) continue;
        if (/^[\d\p{P}\p{S}]+$/u.test(w)) continue;
        freq.set(w, (freq.get(w) ?? 0) + 1);
      }
    }
    return [...freq.entries()]
      .map(([text, count]) => ({ text, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 60);
  }, [seg, texts]);

  if (!seg) {
    return <p className="text-center text-warm-muted py-10">載入中文斷詞中⋯</p>;
  }
  if (words.length === 0) {
    return <p className="text-center text-warm-muted py-10">還沒有足夠的答案產生文字雲</p>;
  }

  const max = words[0].count;
  const min = words[words.length - 1].count;
  const colors = ["#2E7D5B", "#3B9C72", "#7A3B22", "#D9A93C", "#4A8C8C", "#5B6BB0"];

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 p-6 min-h-[320px]">
      {words.map((w, i) => {
        const ratio = max === min ? 1 : (w.count - min) / (max - min);
        const size = 16 + ratio * 56;
        const color = colors[i % colors.length];
        const weight = ratio > 0.6 ? 800 : ratio > 0.3 ? 600 : 400;
        return (
          <span
            key={w.text}
            title={`${w.text}：${w.count} 次`}
            style={{ fontSize: `${size}px`, color, fontWeight: weight, lineHeight: 1.1 }}
            className="inline-block transition hover:scale-110 cursor-default"
          >
            {w.text}
          </span>
        );
      })}
    </div>
  );
}
