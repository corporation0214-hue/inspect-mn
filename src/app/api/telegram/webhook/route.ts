import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    message: "Telegram webhook working",
  });
}

export async function GET() {
  return NextResponse.json({
    status: "ok",
  });
}