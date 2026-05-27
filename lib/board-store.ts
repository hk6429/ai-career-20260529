import { kv } from "@vercel/kv";

export type Answer = {
  id: string;
  questionId: string;
  group: string;
  text: string;
  createdAt: number;
};

export type Question = {
  id: string;
  prompt: string;
  active: boolean;
};

const ACTIVE_KEY = "board:active";
const QUESTIONS_KEY = "board:questions";

function ans(questionId: string) { return `board:answers:${questionId}`; }

const hasKv = () => Boolean(process.env.KV_REST_API_URL || process.env.KV_URL);

const memory: { active: string | null; questions: Question[]; answers: Record<string, Answer[]> } = {
  active: null,
  questions: [],
  answers: {},
};

export async function getActive(): Promise<{ active: Question | null; all: Question[] }> {
  if (hasKv()) {
    const [active, all] = await Promise.all([
      kv.get<string>(ACTIVE_KEY),
      kv.get<Question[]>(QUESTIONS_KEY),
    ]);
    const list = all ?? [];
    return { active: list.find((q) => q.id === active) ?? null, all: list };
  }
  return {
    active: memory.questions.find((q) => q.id === memory.active) ?? null,
    all: memory.questions,
  };
}

export async function setActive(id: string | null) {
  if (hasKv()) await kv.set(ACTIVE_KEY, id);
  else memory.active = id;
}

export async function setQuestions(qs: Question[]) {
  if (hasKv()) await kv.set(QUESTIONS_KEY, qs);
  else memory.questions = qs;
}

export async function listAnswers(questionId: string): Promise<Answer[]> {
  if (hasKv()) {
    const items = await kv.lrange<Answer>(ans(questionId), 0, -1);
    return items ?? [];
  }
  return memory.answers[questionId] ?? [];
}

export async function addAnswer(a: Answer) {
  if (hasKv()) await kv.rpush(ans(a.questionId), a);
  else {
    memory.answers[a.questionId] = memory.answers[a.questionId] ?? [];
    memory.answers[a.questionId].push(a);
  }
}

export async function clearAnswers(questionId: string) {
  if (hasKv()) await kv.del(ans(questionId));
  else memory.answers[questionId] = [];
}

export async function clearAll() {
  if (hasKv()) {
    const { all } = await getActive();
    await Promise.all(all.map((q) => kv.del(ans(q.id))));
    await kv.del(ACTIVE_KEY);
    await kv.del(QUESTIONS_KEY);
  } else {
    memory.active = null;
    memory.questions = [];
    memory.answers = {};
  }
}
