import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import { getCurrentOrganization } from "@/lib/auth/getCurrentOrganization";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Request scope дотор ажиллуулах ёстой
    const {
      user,
      organization: org,
      organizationId,
    } = await getCurrentOrganization();

    if (!user) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        { status: 401 }
      );
    }

    if (!organizationId) {
      return NextResponse.json(
        {
          error: "Таны хэрэглэгчид байгууллага оноогоогүй байна.",
        },
        { status: 400 }
      );
    }

    const [
      inspectionsResult,
      findingsResult,
      complianceResult,
      researchResult,
      voiceResult,
    ] = await Promise.all([
      supabase
        .from("inspections")
        .select("*")
        .eq("organization_id", organizationId)
        .limit(100),

      supabase
        .from("findings")
        .select("*")
        .eq("organization_id", organizationId)
        .limit(100),

      supabase
        .from("compliance_items")
        .select("*")
        .eq("organization_id", organizationId)
        .limit(100),

      supabase
        .from("research_projects")
        .select("*")
        .eq("organization_id", organizationId)
        .limit(100),

      supabase
        .from("employee_voice")
        .select("*")
        .eq("organization_id", organizationId)
        .limit(100),
    ]);

    const queryErrors = [
      inspectionsResult.error,
      findingsResult.error,
      complianceResult.error,
      researchResult.error,
      voiceResult.error,
    ].filter(Boolean);

    if (queryErrors.length > 0) {
      console.error(
        "EXECUTIVE SUMMARY DB ERROR:",
        queryErrors.map((error) => error?.message)
      );

      return NextResponse.json(
        {
          error: queryErrors[0]?.message || "Өгөгдөл уншихад алдаа гарлаа.",
        },
        { status: 500 }
      );
    }

    const inspections = inspectionsResult.data ?? [];
    const findings = findingsResult.data ?? [];
    const compliance = complianceResult.data ?? [];
    const research = researchResult.data ?? [];
    const voices = voiceResult.data ?? [];

    const allDataEmpty =
      inspections.length === 0 &&
      findings.length === 0 &&
      compliance.length === 0 &&
      research.length === 0 &&
      voices.length === 0;

    if (allDataEmpty) {
      return NextResponse.json({
        summary: `${org?.name || "Тус байгууллага"}-ын удирдлагын товч дүгнэлт гаргахад шаардлагатай бүртгэл одоогоор байхгүй байна.`,
        organizationId,
        organizationName: org?.name ?? null,
      });
    }

    const prompt = `
Та INSPECT.MN дотоод хяналтын удирдлагын AI зөвлөх.

Байгууллага:
${org?.name || "Тодорхойгүй"}

Дараах зөвхөн тухайн байгууллагын бодит DB өгөгдөл дээр үндэслэн Dashboard-ийн удирдлагын товч мэдээлэл гарга.

Inspection records:
${JSON.stringify(inspections)}

Findings:
${JSON.stringify(findings)}

Compliance items:
${JSON.stringify(compliance)}

Research projects:
${JSON.stringify(research)}

Employee Voice:
${JSON.stringify(voices)}

Шаардлага:
- Монгол хэлээр бич.
- Өгөгдөлд байхгүй тоо, үйл явдал зохиохгүй.
- Inspection, Compliance, Findings, Employee Voice, R&D мэдээллийг тусга.
- Тухайн модуль хоосон бол товч дурд.
- 5–7 өгүүлбэртэй удирдлагын товч дүгнэлт гарга.
- Өндөр эрсдэл, нээлттэй зөрчил, compliance хэрэгжилт болон employee voice чиг хандлагыг дурд.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Та уул уурхайн компанийн дотоод хяналтын ахлах зөвлөх. Зөвхөн өгсөн өгөгдөлд үндэслэн хариулна.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const summary =
      completion.choices[0]?.message?.content ||
      "AI удирдлагын товч дүгнэлт үүсгэж чадсангүй.";

    return NextResponse.json({
      summary,
      organizationId,
      organizationName: org?.name ?? null,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Executive summary үүсгэхэд алдаа гарлаа.";

    console.error("EXECUTIVE SUMMARY ERROR:", message);

    return NextResponse.json(
      {
        error: message,
      },
      { status: 500 }
    );
  }
}