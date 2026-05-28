import { NextResponse } from "next/server";
import { addQuestion, removeQuestion, getActive, setActive, setQuestions } from "@/lib/board-store";
import { DEFAULT_QUESTIONS } from "@/content/board-questions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PUT() {
  await setQuestions(DEFAULT_QUESTIONS);
  await setActive(null);
  const { active, all } = await getActive();
  return NextResponse.json({ active, all });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const prompt: string = (body?.prompt ?? "").toString().trim();
  if (!prompt) return NextResponse.json({ error: "missing prompt" }, { status: 400 });
  const q = await addQuestion(prompt);
  if (body?.activate) await setActive(q.id);
  const { active, all } = await getActive();
  return NextResponse.json({ created: q, active, all });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });
  await removeQuestion(id);
  const { active, all } = await getActive();
  return NextResponse.json({ active, all });
}
