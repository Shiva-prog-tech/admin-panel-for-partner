import { NextResponse } from "next/server";
import { cardholders, cardholderStats } from "@/utils/mockData/cardholders";
import type { Cardholder } from "@/types/global";

/** GET /api/cardholders?page=1&pageSize=10&search=&status=Approved */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const page = Math.max(1, Number(searchParams.get("page") ?? "1"));
  const pageSize = Math.min(100, Math.max(1, Number(searchParams.get("pageSize") ?? "10")));
  const search = (searchParams.get("search") ?? "").trim().toLowerCase();
  const statuses = (searchParams.get("status") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  let rows: Cardholder[] = cardholders;

  if (statuses.length) rows = rows.filter((row) => statuses.includes(row.status));
  if (search) {
    rows = rows.filter(
      (row) =>
        row.refId.toLowerCase().includes(search) ||
        row.product.toLowerCase().includes(search)
    );
  }

  const start = (page - 1) * pageSize;

  return NextResponse.json({
    rows: rows.slice(start, start + pageSize),
    total: rows.length,
    page,
    pageSize,
    stats: {
      total: cardholderStats.total,
      approved: cardholderStats.approved,
      rejected: cardholderStats.rejected,
      pending: cardholderStats.pending,
    },
  });
}

/** POST /api/cardholders — submit an application to the KYC queue. */
export async function POST(request: Request) {
  let body: { fullName?: string; endUserRef?: string; product?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { code: "invalid_body", message: "Expected a JSON payload." },
      { status: 400 }
    );
  }

  if (!body.fullName || !body.endUserRef) {
    return NextResponse.json(
      {
        code: "missing_fields",
        message: "fullName and endUserRef are required.",
      },
      { status: 422 }
    );
  }

  return NextResponse.json(
    {
      id: "ch-created",
      refId: "pending-assignment",
      product: body.product ?? "prod_TM1031",
      status: "Pending",
      reason: null,
    },
    { status: 201 }
  );
}
