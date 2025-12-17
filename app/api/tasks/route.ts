import { NextResponse } from "next/server";

const URL_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/tasks";

export async function GET() {
  const response = await fetch(`${URL_BASE}`);
  if (!response.ok) {
    return NextResponse.json({ error: "Error al obtener las tareas." });
  }
  const data = await response.json();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch(`${URL_BASE}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    return NextResponse.json({ error: "Error al crear una tarea." });
  }

  const data = await response.json();
  return NextResponse.json(data, { status: 201 });
}
