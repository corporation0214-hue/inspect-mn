import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const [inspection, compliance, research, voice] = await Promise.all([
      supabase.from("inspection_findings").select("*"),
      supabase.from("compliance_registry").select("*"),
      supabase.from("research_projects").select("*"),
      supabase.from("employee_voice").select("*"),
    ]);

    const prompt = `
Та дотоод хяналтын удирдлагын зөвлөх AI.

Дараах өгөгдөл дээр үндэслэн
5-7 өгүүлбэртэй Executive Summary гарга.

Inspection count: ${inspection.data?.length || 0}
Compliance count: ${compliance.data?.length || 0}
Research count: ${research.data?.length || 0}
Voice count: ${voice.data?.length || 0}

Монгол хэлээр.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Та уул уурхайн компанийн дотоод хяналтын ахлах зөвлөх."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return NextResponse.json({
      summary: completion.choices[0].message.content,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}