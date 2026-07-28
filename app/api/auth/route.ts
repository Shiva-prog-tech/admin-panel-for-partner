import { NextResponse } from "next/server";
import { DEFAULT_ADMIN } from "@/utils/Config";

/** GET /api/auth — current session (stubbed until the backoffice API lands). */
export async function GET() {
  return NextResponse.json({
    user: DEFAULT_ADMIN,
    token: "dev-session-token",
    expiresAt: "2026-12-31T23:59:59",
  });
}

/** POST /api/auth — email + password (+ OTP) exchange. */
export async function POST(request: Request) {
  let body: { email?: string; password?: string; otp?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { code: "invalid_body", message: "Expected a JSON payload." },
      { status: 400 }
    );
  }

  if (!body.email || !body.password) {
    return NextResponse.json(
      { code: "missing_credentials", message: "Email and password are required." },
      { status: 422 }
    );
  }

  return NextResponse.json({
    user: { ...DEFAULT_ADMIN, email: body.email },
    token: "dev-session-token",
    expiresAt: "2026-12-31T23:59:59",
  });
}

/** DELETE /api/auth — sign out. */
export async function DELETE() {
  return new NextResponse(null, { status: 204 });
}
