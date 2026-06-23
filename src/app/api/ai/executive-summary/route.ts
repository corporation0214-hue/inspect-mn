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
    const [inspections, findings, compliance, research, voice] = await Promise.all([
      supabase.from("inspections").select("*").limit(100),
      supabase.from("findings").select("*").limit(100),
      supabase.from("compliance_items").select("*").limit(100),
      supabase.from("research_projects").select("*").limit(100),
      supabase.from("employee_voice").select("*").limit(100),
    ]);

    const prompt = `
    Та INSPECT.MN дотоод хяналтын удирдлагын AI зөвлөх.

    Дараах бодит DB өгөгдөл дээр үндэслэн Dashboard-ийн Удирдлагын товч мэдээлэл гарга.

    Inspection records:
    ${JSON.stringify(inspections.data || [])}

    Findings:
    ${JSON.stringify(findings.data || [])}

    Compliance items:
    ${JSON.stringify(compliance.data || [])}

    Research projects:
    ${JSON.stringify(research.data || [])}

    Employee Voice:
    ${JSON.stringify(voice.data || [])}

    Шаардлага:
    - Монгол хэлээр бич.
    - "өгөгдөл байхгүй" гэж битгий хэл, зөвхөн үнэхээр хоосон үед хэл.
    - Inspection, Compliance, Findings, Employee Voice, R&D мэдээллийг заавал тусга.
    - 5-7 өгүүлбэртэй удирдлагын товч дүгнэлт гарга.
    - Өндөр эрсдэл, нээлттэй зөрчил, compliance хэрэгжилт, employee voice саналын чиг хандлагыг дурд.
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