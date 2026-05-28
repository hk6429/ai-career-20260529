import { NextResponse } from "next/server";
import { addAnswer, clearAnswers, listAnswers, type Answer } from "@/lib/board-store";

export const runtime = "nodejs";

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=0, must-revalidate",
  "CDN-Cache-Control": "public, s-maxage=2, stale-while-revalidate=4",
  "Vercel-CDN-Cache-Control": "public, s-maxage=2, stale-while-revalidate=4",
};
const NO_STORE = { "Cache-Control": "no-store", "CDN-Cache-Control": "no-store" };

export async function GET(req: Request) {
  const url = new URL(req.url);
  const questionId = url.searchParams.get("q");
  if (!questionId) return NextResponse.json({ items: [] }, { headers: NO_STORE });
  const items = await listAnswers(questionId);
  return NextResponse.json({ items }, { headers: CACHE_HEADERS });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const questionId: string = body?.questionId ?? "";
  const group: string = (body?.group ?? "").toString().slice(0, 30).trim() || "匿名";
  const text: string = (body?.text ?? "").toString().slice(0, 400).trim();
  if (!questionId || !text) {
    return NextResponse.json({ error: "missing questionId or text" }, { status: 400, headers: NO_STORE });
  }
  const a: Answer = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    questionId,
    group,
    text,
    createdAt: Date.now(),
  };
  await addAnswer(a);
  return NextResponse.json({ ok: true, answer: a }, { headers: NO_STORE });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const questionId = url.searchParams.get("q");
  if (!questionId) return NextResponse.json({ error: "missing q" }, { status: 400, headers: NO_STORE });
  await clearAnswers(questionId);
  return NextResponse.json({ ok: true }, { headers: NO_STORE });
}
