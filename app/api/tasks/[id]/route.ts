import { NextResponse } from "next/server";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3005/tasks";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const res = await fetch(`${BACKEND_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: Number(id) }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Error updating task" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
