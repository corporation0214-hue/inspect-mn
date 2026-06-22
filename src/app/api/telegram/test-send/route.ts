import { NextResponse } from "next/server";
import { sendTelegramMessage } from "@/lib/telegram/sendMessage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const chatId = "YOUR_TELEGRAM_CHAT_ID";

    await sendTelegramMessage(chatId, "✅ INSPECT.MN Telegram test message");

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Test send failed" },
      { status: 500 }
    );
  }
}