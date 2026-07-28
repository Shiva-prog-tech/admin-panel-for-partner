import { NextResponse } from "next/server";
import { endUsers, endUserStats } from "@/utils/mockData/endUsers";
import type { EndUser } from "@/types/global";

/** GET /api/end-users?page=1&pageSize=10&search=&status=Active,Invited */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? "10")));
  const search = (searchParams.get("search") ?? "").trim().toLowerCase();
  const statuses = (searchParams.get("status") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  let rows: EndUser[] = endUsers;

  if (statuses.length) rows = rows.filter((row) => statuses.includes(row.status));
  if (search) rows = rows.filter((row) => row.refId.toLowerCase().includes(search));

  const start = (page - 1) * pageSize;

  return NextResponse.json({
    rows: rows.slice(start, start + pageSize),
    total: rows.length,
    page,
    pageSize,
    stats: {
      total: endUserStats.total,
      cardsIssued: endUserStats.cardsIssued,
      activeThisWeek: endUserStats.activeThisWeek,
      activityEvents: endUserStats.activityEvents,
    },
  });
}

/** POST /api/end-users — invite an end user. */
export async function POST(request: Request) {
  let body: { email?: string; reference?: string; country?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { code: "invalid_body", message: "Expected a JSON payload." },
      { status: 400 }
    );
  }

  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(body.email)) {
    return NextResponse.json(
      { code: "invalid_email", message: "A valid email address is required." },
      { status: 422 }
    );
  }

  return NextResponse.json(
    {
      id: "eu-created",
      refId: body.reference || "pending-assignment",
      status: "Invited",
      email: body.email,
    },
    { status: 201 }
  );
}
