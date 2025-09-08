
import { NextResponse } from "next/server";
import { getPrisma } from "@/app/lib/prisma";
export const dynamic = "force-dynamic";


const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type,Authorization",
};

export async function GET() {
  const prisma = await getPrisma();
  const tasks = await prisma.task.findMany({ orderBy: { id: "desc" } });
  return NextResponse.json(tasks, { headers: CORS });
}

export async function POST(req: Request) {
  const prisma = await getPrisma();
  const body = await req.json().catch(() => ({}));
  const title = (body?.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "Title required" }, { status: 400, headers: CORS });

  const task = await prisma.task.create({ data: { title, description: body?.description ?? null } });
  return NextResponse.json(task, { status: 201, headers: CORS });
}

export function OPTIONS() {
  return NextResponse.json({}, { headers: CORS });
}