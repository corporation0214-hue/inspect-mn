import openai from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new openai({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { message, module } = await req.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content:
            "You are Inspect AI, an assistant for internal inspection, compliance, risk, research, employee voice, and executive reporting. Reply in Mongolian unless the user asks otherwise.",
        },
        {
          role: "user",
          content: `[Module: ${module ?? "general"}]\n${message}`,
        },
      ],
    });

    return NextResponse.json({
      answer: response.output_text,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}