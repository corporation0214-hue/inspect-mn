import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!token || !secret || !appUrl) {
      return NextResponse.json(
        {
          error:
            "TELEGRAM_BOT_TOKEN, TELEGRAM_WEBHOOK_SECRET, NEXT_PUBLIC_APP_URL шаардлагатай",
        },
        { status: 500 }
      );
    }

    const webhookUrl = `${appUrl}/api/telegram/webhook`;

    const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url: webhookUrl,
        secret_token: secret,
        allowed_updates: ["message"],
        drop_pending_updates: true,
      }),
    });

    const data = await res.json();

    return NextResponse.json({
      webhookUrl,
      telegramResponse: data,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Set webhook failed" },
      { status: 500 }
    );
  }
}