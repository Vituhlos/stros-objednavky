import { NextResponse } from "next/server";
import { testSmtpConnection } from "@/lib/email";

export async function GET() {
  try {
    await testSmtpConnection();
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : "Neznámá chyba" },
      { status: 200 }
    );
  }
}
