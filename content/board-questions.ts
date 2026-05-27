import type { Question } from "@/lib/board-store";

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: "q1-parents",
    prompt: "你爸媽的工作，AI 上場後會變怎樣？寫一個會被影響的職業 + 一個 AI 幫不上忙的職業。",
    active: false,
  },
  {
    id: "q2-prompt",
    prompt: "你這週遇到的真實問題是什麼？你會怎麼問 AI？貼上你的 prompt。",
    active: false,
  },
  {
    id: "q3-score",
    prompt: "AI 給你的答案打幾分（1–10）？為什麼？你會怎麼改 prompt 再問一次？",
    active: false,
  },
  {
    id: "q4-takeaway",
    prompt: "今天最有感的一句話是什麼？這週你要用 AI 做的第一件事？",
    active: false,
  },
];
