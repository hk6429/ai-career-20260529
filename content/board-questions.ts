import type { Question } from "@/lib/board-store";

export const DEFAULT_QUESTIONS: Question[] = [
  {
    id: "ice-cheat-skill",
    prompt: "破冰：你覺得用 AI 是『作弊』還是『技能』？一句話說你的理由。",
    active: false,
  },
  {
    id: "work-replace",
    prompt: "Q1｜你覺得 AI 會搶走哪些工作？寫一個你想到的職業。",
    active: false,
  },
  {
    id: "work-safe",
    prompt: "Q2｜哪些能力是 AI 搶不走的？寫一個。",
    active: false,
  },
  {
    id: "work-train",
    prompt: "Q3｜國中的你，現在最該開始練什麼？",
    active: false,
  },
  {
    id: "group-parents",
    prompt: "小組討論｜觀察爸媽的工作：哪些事一直重複、哪些需要判斷？AI 會幫忙還是取代？寫下你們這組的觀察。",
    active: false,
  },
  {
    id: "challenge-prompt",
    prompt: "挑戰任務｜你這週遇到的真實問題是什麼？貼上你問 AI 的 prompt。",
    active: false,
  },
  {
    id: "challenge-score",
    prompt: "挑戰任務｜AI 的答案你打幾分（1–10）？為什麼？你會怎麼改 prompt 再問一次？",
    active: false,
  },
  {
    id: "takeaway",
    prompt: "收尾｜今天最有感的一句話是什麼？這週你要用 AI 做的第一件事？",
    active: false,
  },
];
