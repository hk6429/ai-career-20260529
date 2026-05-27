# ai-career-20260529

「會 AI 的人，淘汰不會 AI 的人」— 國中生 90 分鐘 AI 職涯預備課（2026.05.29 新竹縣精華國中）成果分享網站。

## 路由
- `/` — 入口
- `/share/ai-career-20260529` — 18 張投影片簡報頁（主入口）
- `/share/ai-career-20260529/detail` — 詳細課程紀錄頁

## 技術棧
- Next.js 15 (App Router)
- React 19
- Tailwind CSS 3.4
- TypeScript

## 開發
```bash
npm install
npm run dev
```

## 結構
```
content/
  meta.ts     — 標題 / 講者 / 短網址 / QR
  slides.ts   — 18 張 slide 結構化資料
app/
  page.tsx                                  — 首頁
  share/ai-career-20260529/page.tsx         — 簡報頁入口
  share/ai-career-20260529/ShareView.tsx    — 簡報主 UI（client）
  share/ai-career-20260529/detail/page.tsx  — 詳細紀錄頁
public/slides/00.png ~ 17.png               — 18 張投影片
```

## 部署
GitHub `hk6429/ai-career-20260529` + Vercel。
