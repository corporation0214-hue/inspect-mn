import OpenAI from "openai";
import { NextResponse } from "next/server";
import { adminSupabase } from "@/lib/supabase/admin";

const [findings, compliance, projects, voices] = await Promise.all([
  adminSupabase
    .from("findings")
    .select("*")
    .limit(50),

  adminSupabase
    .from("compliance_registry")
    .select("*")
    .limit(50),

  adminSupabase
    .from("research_projects")
    .select("*")
    .limit(50),

  adminSupabase
    .from("employee_voice")
    .select("*")
    .limit(50),
]);

const context = `
Inspection Findings:
${JSON.stringify(findings.data)}

Compliance:
${JSON.stringify(compliance.data)}

Research Projects:
${JSON.stringify(projects.data)}

Employee Voice:
${JSON.stringify(voices.data)}
`;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4.1",
      messages: [
        {
          role: "system",
          content: `
You are INSPECT.MN Internal Control AI.

Modules:
- Inspection Center
- Compliance Center
- Research & Development
- Employee Voice

Rules:
- Answer only using available company data.
- If data is insufficient, say so.
- Answer in Mongolian.
- Give management recommendations.
- Summarize findings clearly.
          `,
        },
        {
          role: "user",
          content: `
        Company Data:

        ${context}

        Question:

        ${message}
        `
        }
      ],
    });

    return NextResponse.json({
      answer: response.choices[0].message.content,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message },
      { status: 500 }
    );
  }
}