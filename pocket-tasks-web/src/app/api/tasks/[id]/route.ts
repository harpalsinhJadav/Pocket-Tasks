
import { NextResponse } from "next/server";
import { getPrisma } from "@/app/lib/prisma";
export const dynamic = "force-dynamic";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PATCH, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// GET one task
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = await getPrisma();
  const { id } = await params;
  const task = await prisma.task.findUnique({ where: { id: Number(id) } });

  if (!task) {
    return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
  }
  return NextResponse.json(task, { headers: CORS });
}

// PATCH update
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = await getPrisma();
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const data: {title?: string; description?:string; done?: boolean;} = {};

  if (typeof body.title === "string") data.title = body.title.trim();
  if (typeof body.description === "string") data.description = body.description;
  if (typeof body.done === "boolean") data.done = body.done;

  try {
    const updated = await prisma.task.update({ where: { id: Number(id) }, data });
    return NextResponse.json(updated, { headers: CORS });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
  }
}

// DELETE task
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const prisma = await getPrisma();
  const { id } = await params;
  try {
    await prisma.task.delete({ where: { id: Number(id) } });
    return NextResponse.json({ ok: true }, { headers: CORS });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
  }
}

// Handle preflight
export function OPTIONS() {
  return NextResponse.json({}, { headers: CORS });
}
