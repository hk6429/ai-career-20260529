import { NextResponse } from "next/server";
import { getActive, setActive, setQuestions } from "@/lib/board-store";
import { DEFAULT_QUESTIONS } from "@/content/board-questions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function ensureQuestions() {
  const { all } = await getActive();
  if (!all || all.length === 0) {
    await setQuestions(DEFAULT_QUESTIONS);
  }
}

export async function GET() {
  await ensureQuestions();
  const { active, all } = await getActive();
  return NextResponse.json({ active, all });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const id: string | null = body?.id ?? null;
  await ensureQuestions();
  await setActive(id);
  const { active, all } = await getActive();
  return NextResponse.json({ active, all });
}
