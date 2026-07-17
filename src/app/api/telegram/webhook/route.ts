import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import {
  sendTelegramMessage,
  escapeTelegramHtml,
} from "@/lib/telegram/sendMessage";


export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function getTelegramOrganizationId(
  telegramId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("telegram_users")
    .select("organization_id")
    .eq("telegram_id", telegramId)
    .maybeSingle();

  if (error) {
    console.error("TELEGRAM ORG FETCH ERROR:", error.message);
    return null;
  }

  return data?.organization_id ?? null;
}

function normalizeText(text: string) {
  return (text || "").trim();
}

function getRolePrompt(role: string) {
  if (role === "ceo") {
    return `
Та INSPECT.MN CEO түвшний AI зөвлөх.
Фокус:
- Удирдлагын товч дүгнэлт
- Гол эрсдэл
- Стратегийн шийдвэр
- Дараагийн арга хэмжээ
`;
  }

  if (role === "engineer") {
    return `
Та INSPECT.MN инженерийн эрсдэлийн AI туслах.
Фокус:
- Техникийн эрсдэл
- Засвар үйлчилгээ
- ХАБЭА
- Яаралтай арга хэмжээ
`;
  }

  if (role === "inspector") {
    return `
Та INSPECT.MN хяналт шалгалтын AI туслах.
Фокус:
- Илэрсэн зөрчил
- Ангилал
- Эрсдэлийн түвшин
- Зөвлөмж
`;
  }

  if (role === "manager") {
    return `
Та INSPECT.MN менежерийн AI туслах.
Фокус:
- Гүйцэтгэл
- Хариуцагч
- Хугацаа
- Нөөц, зохион байгуулалт
`;
  }

  return `
Та INSPECT.MN Employee Voice AI туслах.
Фокус:
- Ажилтны санал
- Гомдол
- Эрсдэл
- Нууц мэдээлэл
`;
}

function classifyVoice(text: string) {
  const lower = text.toLowerCase();

  if (
    lower.includes("эрсдэл") ||
    lower.includes("аюул") ||
    lower.includes("осол") ||
    lower.includes("гал") ||
    lower.includes("цахилгаан")
  ) {
    return {
      type: "risk",
      category: "Эрсдэл",
      priority: "high",
    };
  }

  if (
    lower.includes("гомдол") ||
    lower.includes("асуудал") ||
    lower.includes("шударга бус")
  ) {
    return {
      type: "complaint",
      category: "Гомдол",
      priority: "medium",
    };
  }

  if (
    lower.includes("зөрчил") ||
    lower.includes("мөрдөхгүй") ||
    lower.includes("биелэхгүй")
  ) {
    return {
      type: "violation",
      category: "Зөрчил",
      priority: "high",
    };
  }

  if (
    lower.includes("нууц") ||
    lower.includes("ил хэлэх") ||
    lower.includes("мэдэгдэхгүй")
  ) {
    return {
      type: "confidential",
      category: "Нууц мэдээлэл",
      priority: "high",
    };
  }

  return {
    type: "suggestion",
    category: "Санал",
    priority: "medium",
  };
}

const TYPE_MAP: Record<string, { type: string; category: string }> = {
  санал: { type: "suggestion", category: "Санал" },
  suggestion: { type: "suggestion", category: "Санал" },
  suggest: { type: "suggestion", category: "Санал" },

  гомдол: { type: "complaint", category: "Гомдол" },
  complaint: { type: "complaint", category: "Гомдол" },

  эрсдэл: { type: "risk", category: "Эрсдэл" },
  risk: { type: "risk", category: "Эрсдэл" },

  зөрчил: { type: "violation", category: "Зөрчил" },
  violation: { type: "violation", category: "Зөрчил" },

  нууц: { type: "confidential", category: "Нууц" },
  confidential: { type: "confidential", category: "Нууц" },
};

const PRIORITIES = ["low", "medium", "high", "critical"];

function parseTelegramVoice(text: string) {
  const parts = text.trim().split(/\s+/);
  const command = parts[0]?.replace("/", "").toLowerCase();

  let typeKey = "санал";
  let priority = "medium";
  let content = "";

  if (command === "voice" || command === "anonymous") {
    typeKey = parts[1]?.toLowerCase() || "санал";

    const maybePriority = parts[2]?.toLowerCase();
    priority = PRIORITIES.includes(maybePriority) ? maybePriority : "medium";

    content = PRIORITIES.includes(maybePriority)
      ? parts.slice(3).join(" ")
      : parts.slice(2).join(" ");
  } else {
    if (command === "suggest") typeKey = "санал";
    if (command === "complaint") typeKey = "гомдол";
    if (command === "risk") typeKey = "эрсдэл";
    if (command === "violation") typeKey = "зөрчил";
    if (command === "confidential") typeKey = "нууц";

    const maybePriority = parts[1]?.toLowerCase();
    priority = PRIORITIES.includes(maybePriority) ? maybePriority : "medium";

    content = PRIORITIES.includes(maybePriority)
      ? parts.slice(2).join(" ")
      : parts.slice(1).join(" ");
  }

  const mapped = TYPE_MAP[typeKey] || TYPE_MAP["санал"];

  return {
    type: mapped.type,
    category: mapped.category,
    priority,
    content: content || text,
  };
}

const allowedRoles = [
  "ceo",
  "admin",
  "manager",
  "inspector",
  "engineer",
  "employee",
];

const commandPermissions: Record<string, string[]> = {
  "/report": ["ceo", "admin", "manager"],
  "/daily": ["ceo", "admin"],
  "/risk": ["ceo", "admin", "manager", "inspector"],
  "/kpi": ["ceo", "admin", "manager"],
  "/compliance": ["ceo", "admin", "manager", "inspector"],
  "/users": ["ceo", "admin"],
  "/setrole": ["ceo", "admin"],
  "/setdept": ["ceo", "admin"],
  "/disableuser": ["ceo", "admin"],
  "/enableuser": ["ceo", "admin"],
};

function canUseCommand(role: string, command: string) {
  const allowed = commandPermissions[command];

  if (!allowed) return true;

  return allowed.includes(role);
}

async function denyCommand(chatId: string, command: string, role: string) {
  await sendTelegramMessage(
    chatId,
    `⛔ <b>Эрх хүрэлцэхгүй байна</b>

Command: <code>${escapeTelegramHtml(command)}</code>
Your role: <b>${escapeTelegramHtml(role)}</b>`
  );
}

function isAdminRole(role: string) {
  return ["ceo", "admin"].includes(role);
}

function getArgs(text: string) {
  return text.trim().split(/\s+/).slice(1);
}

async function getTelegramUser(telegramId: string, username: string, fullName: string) {
  const { data } = await supabase
    .from("telegram_users")
    .select("*")
    .eq("telegram_id", telegramId)
    .maybeSingle();

  if (data) return data;

  const { data: created } = await supabase
    .from("telegram_users")
    .insert({
      telegram_id: telegramId,
      username,
      full_name: fullName,
      role: "employee",
      status: "active",
    })
    .select("*")
    .single();

  return created;
}

  async function answerWithAI(
    chatId: string,
    text: string,
    role: string,
    organizationId: string
  ) {
  await sendTelegramMessage(chatId, "AI боловсруулж байна...");

  const [findings, compliance, research, voice] =
    await Promise.all([
      supabase
        .from("findings")
        .select("*")
        .eq("organization_id", organizationId)
        .limit(80),

      supabase
        .from("compliance_items")
        .select("*")
        .eq("organization_id", organizationId)
        .limit(80),

      supabase
        .from("research_projects")
        .select("*")
        .eq("organization_id", organizationId)
        .limit(80),

      supabase
        .from("employee_voice")
        .select("*")
        .eq("organization_id", organizationId)
        .limit(80),
    ]); 

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `
Та INSPECT.MN дотоод хяналтын AI туслах.

${getRolePrompt(role)}

Дүрэм:
- Зөвхөн өгөгдөлд тулгуурлан хариул.
- Өгөгдөл хангалтгүй бол шууд хэл.
- Монгол хэлээр хариул.
- Хариултыг Telegram-д уншихад эвтэйхэн, товч бүтэцтэй гарга.
- Markdown ** ашиглахгүй.
- Гарчигт HTML <b>...</b> ашиглаж болно.
`,
      },
      {
        role: "user",
        content: `
INSPECT.MN өгөгдөл:

Findings:
${JSON.stringify(findings.data || [])}

Compliance:
${JSON.stringify(compliance.data || [])}

Research:
${JSON.stringify(research.data || [])}

Employee Voice:
${JSON.stringify(voice.data || [])}

Асуулт:
${text}
`,
      },
    ],
  });

  const answer =
    completion.choices[0].message.content || "AI хариу үүсгэж чадсангүй.";

  await sendTelegramMessage(chatId, answer);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const message = body.message;
    if (!message) {
      return NextResponse.json({ ok: true });
    }

    const chatId = String(message.chat.id);
    const telegramId = String(message.from.id);
    const username = message.from.username || "";
    const fullName = [message.from.first_name, message.from.last_name]
      .filter(Boolean)
      .join(" ");

    const text = normalizeText(message.text || "");
    const command = text.startsWith("/")
      ? text.split(" ")[0].toLowerCase()
      : "";

    const tgUser = await getTelegramUser(
      telegramId,
      username,
      fullName
    );

    const role = tgUser?.role || "employee";
    const organizationId =
      tgUser?.organization_id ||
      (await getTelegramOrganizationId(telegramId));

    console.log("TELEGRAM TEXT:", text);

    if (tgUser?.status === "disabled") {
      await sendTelegramMessage(
        chatId,
        "⛔ Таны Telegram bot ашиглах эрх идэвхгүй байна."
      );

      return NextResponse.json({ ok: true });
    }

    if (command && !canUseCommand(role, command)) {
      await denyCommand(chatId, command, role);
      return NextResponse.json({ ok: true });
    }

    await supabase.from("telegram_messages").insert({
      telegram_id: telegramId,
      username,
      role,
      message: text,
      command: command || "ai_question",
      module: "telegram",
      payload: body,
      organization_id: organizationId,
    });

    if (text === "/start") {
      await sendTelegramMessage(
        chatId,
        `
👋 <b>INSPECT.MN Bot</b>-д тавтай морил.

Таны role: <b>${escapeTelegramHtml(role)}</b>

Командууд:
/help - тусламж
/profile - profile харах
/voice [текст] - Employee Voice илгээх
/risk - эрсдэлийн товч шинжилгээ
/report - товч тайлан
/anonymous [текст] - anonymous employee voice

Мөн шууд асуулт бичиж болно:
Өндөр эрсдэлтэй 5 зөрчил харуул
`
      );

      return NextResponse.json({ ok: true });
    }

    if (command === "/help") {
      await sendTelegramMessage(
        chatId,
        `
<b>INSPECT.MN Bot командууд</b>

/voice Ажлын байрны гэрэлтүүлэг муу байна
/risk
/report
/profile
/anonymous [текст] - нэргүй санал, эрсдэл илгээх
/myrole - өөрийн role харах
/users - Telegram users харах CEO/Admin
/setrole <telegram_id> <role> - role өөрчлөх
/setdept <telegram_id> <department> - department тохируулах
/disableuser <telegram_id>
/enableuser <telegram_id>

Шууд асуулт:
Өндөр эрсдэлтэй 5 зөрчил харуул
Compliance яагаад буурсан бэ?
`
      );

      return NextResponse.json({ ok: true });
    }

    if (text === "/profile") {
      await sendTelegramMessage(
        chatId,
        `
<b>Telegram Profile</b>

Нэр: ${escapeTelegramHtml(fullName || "-")}
Username: ${escapeTelegramHtml(username || "-")}
Role: <b>${escapeTelegramHtml(role)}</b>
Telegram ID: ${telegramId}
`
      );

      return NextResponse.json({ ok: true });
    }

    if (text === "/myrole") {
      await sendTelegramMessage(
        chatId,
        `
    <b>Таны Telegram Role</b>

    Нэр: ${escapeTelegramHtml(fullName || "-")}
    Telegram ID: ${telegramId}
    Role: <b>${escapeTelegramHtml(role)}</b>
    Department: ${escapeTelegramHtml(tgUser?.department || "-")}
    Status: ${escapeTelegramHtml(tgUser?.status || "-")}
    `
      );

      return NextResponse.json({ ok: true });
    }

    if (text === "/users") {
      if (!isAdminRole(role)) {
        await sendTelegramMessage(
          chatId,
          "⛔ Энэ командыг зөвхөн CEO/Admin ашиглана."
        );
        return NextResponse.json({ ok: true });
      }

      const { data: users, error } = await supabase
        .from("telegram_users")
        .select("telegram_id, full_name, username, role, department, status")
        .order("created_at", { ascending: false })
        .limit(30);

      if (error) {
        await sendTelegramMessage(
          chatId,
          `User list алдаа: ${escapeTelegramHtml(error.message)}`
        );
        return NextResponse.json({ ok: true });
      }

      const list =
        users
          ?.map(
            (u: any, index: number) =>
              `${index + 1}. <b>${escapeTelegramHtml(u.full_name || u.username || "-")}</b>
    ID: <code>${escapeTelegramHtml(u.telegram_id)}</code>
    Role: ${escapeTelegramHtml(u.role || "-")}
    Dept: ${escapeTelegramHtml(u.department || "-")}
    Status: ${escapeTelegramHtml(u.status || "-")}`
          )
          .join("\n\n") || "User олдсонгүй.";

      await sendTelegramMessage(chatId, `<b>Telegram Users</b>\n\n${list}`);

      return NextResponse.json({ ok: true });
    }

    if (text.startsWith("/setrole")) {
      if (!isAdminRole(role)) {
        await sendTelegramMessage(
          chatId,
          "⛔ Role өөрчлөх эрх хүрэлцэхгүй байна."
        );
        return NextResponse.json({ ok: true });
      }

      const [targetTelegramId, newRole] = getArgs(text);

      if (!targetTelegramId || !newRole) {
        await sendTelegramMessage(
          chatId,
          `
    <b>Role солих format</b>

    /setrole 1383723364 ceo

    Role:
    ceo, admin, manager, inspector, engineer, employee
    `
        );
        return NextResponse.json({ ok: true });
      }

      if (!allowedRoles.includes(newRole)) {
        await sendTelegramMessage(
          chatId,
          `Role буруу байна: ${escapeTelegramHtml(newRole)}`
        );
        return NextResponse.json({ ok: true });
      }

      const { error } = await supabase
        .from("telegram_users")
        .update({
          role: newRole,
          updated_at: new Date().toISOString(),
        })
        .eq("telegram_id", targetTelegramId);

      if (error) {
        await sendTelegramMessage(
          chatId,
          `Role update алдаа: ${escapeTelegramHtml(error.message)}`
        );
        return NextResponse.json({ ok: true });
      }

      await sendTelegramMessage(
        chatId,
        `
    ✅ <b>Role шинэчлэгдлээ</b>

    Telegram ID: <code>${escapeTelegramHtml(targetTelegramId)}</code>
    New Role: <b>${escapeTelegramHtml(newRole)}</b>
    `
      );

      return NextResponse.json({ ok: true });
    }

    if (text.startsWith("/setdept")) {
      if (!isAdminRole(role)) {
        await sendTelegramMessage(
          chatId,
          "⛔ Department өөрчлөх эрх хүрэлцэхгүй байна."
        );
        return NextResponse.json({ ok: true });
      }

      const args = getArgs(text);
      const targetTelegramId = args[0];
      const department = args.slice(1).join(" ");

      if (!targetTelegramId || !department) {
        await sendTelegramMessage(
          chatId,
          `
    <b>Department тохируулах format</b>

    /setdept 1383723364 ДХШ
    `
        );
        return NextResponse.json({ ok: true });
      }

      const { error } = await supabase
        .from("telegram_users")
        .update({
          department,
          updated_at: new Date().toISOString(),
        })
        .eq("telegram_id", targetTelegramId);

      if (error) {
        await sendTelegramMessage(
          chatId,
          `Department update алдаа: ${escapeTelegramHtml(error.message)}`
        );
        return NextResponse.json({ ok: true });
      }

      await sendTelegramMessage(
        chatId,
        `
    ✅ <b>Department шинэчлэгдлээ</b>

    Telegram ID: <code>${escapeTelegramHtml(targetTelegramId)}</code>
    Department: ${escapeTelegramHtml(department)}
    `
      );

      return NextResponse.json({ ok: true });
    }

    if (text.startsWith("/disableuser")) {
      if (!isAdminRole(role)) {
        await sendTelegramMessage(chatId, "⛔ Эрх хүрэлцэхгүй байна.");
        return NextResponse.json({ ok: true });
      }

      const [targetTelegramId] = getArgs(text);

      if (!targetTelegramId) {
        await sendTelegramMessage(chatId, "/disableuser 1383723364");
        return NextResponse.json({ ok: true });
      }

      await supabase
        .from("telegram_users")
        .update({
          status: "disabled",
          updated_at: new Date().toISOString(),
        })
        .eq("telegram_id", targetTelegramId);

      await sendTelegramMessage(
        chatId,
        `⛔ User disabled: <code>${escapeTelegramHtml(targetTelegramId)}</code>`
      );

      return NextResponse.json({ ok: true });
    }

    if (text.startsWith("/enableuser")) {
      if (!isAdminRole(role)) {
        await sendTelegramMessage(chatId, "⛔ Эрх хүрэлцэхгүй байна.");
        return NextResponse.json({ ok: true });
      }

      const [targetTelegramId] = getArgs(text);

      if (!targetTelegramId) {
        await sendTelegramMessage(chatId, "/enableuser 1383723364");
        return NextResponse.json({ ok: true });
      }

      await supabase
        .from("telegram_users")
        .update({
          status: "active",
          updated_at: new Date().toISOString(),
        })
        .eq("telegram_id", targetTelegramId);

      await sendTelegramMessage(
        chatId,
        `✅ User enabled: <code>${escapeTelegramHtml(targetTelegramId)}</code>`
      );

      return NextResponse.json({ ok: true });
    }

    if (text === "/risk") {
      if (!organizationId) {
        await sendTelegramMessage(
          chatId,
          "Таны Telegram хэрэглэгчид байгууллага оноогоогүй байна."
        );

        return NextResponse.json({ ok: true });
      }

      await answerWithAI(
        chatId,
        "Сүүлийн бүртгэлүүд дээр үндэслэн хамгийн өндөр эрсдэлтэй асуудлуудыг жагсааж, удирдлагад өгөх зөвлөмж гарга.",
        role,
        organizationId
      );

      return NextResponse.json({ ok: true });
    }

    if (text === "/report") {
      if (!["ceo", "admin", "manager", "inspector"].includes(role)) {
        await sendTelegramMessage(
          chatId,
          "⛔ Энэ командыг ашиглах эрх хүрэлцэхгүй байна."
        );

        return NextResponse.json({ ok: true });
      }

      await answerWithAI(
        chatId,
        "INSPECT.MN-ийн өнөөдрийн товч удирдлагын тайлан гарга. Inspection, Compliance, R&D, Employee Voice, өндөр эрсдэлийг тусга.",
        role,
        organizationId
      );

      return NextResponse.json({ ok: true });
    }

    if (text.startsWith("/anonymous")) {
      const parsed = parseTelegramVoice(text);
      const voiceText = parsed.content;

      if (!organizationId) {
        await sendTelegramMessage(
          chatId,
          "Таны Telegram хэрэглэгчид байгууллага оноогоогүй байна. Admin хэрэглэгчид хандана уу."
        );

        return NextResponse.json({ ok: true });
      }

      if (!voiceText) {
        await sendTelegramMessage(
          chatId,
          `
    <b>Anonymous Employee Voice</b>

    Илгээх жишээ:
    <code>/anonymous санал medium Агуулахын гэрэлтүүлэг хангалтгүй байна</code>
    <code>/anonymous эрсдэл high Галын хор байхгүй байна</code>

    Таны нэр тайланд харагдахгүй.
    `
        );

        return NextResponse.json({ ok: true });
      }

      const { error } = await supabase
        .from("employee_voice")
        .insert({
          organization_id: organizationId,

          title: voiceText.slice(0, 80),
          description: voiceText,

          type: parsed.type,
          category: parsed.category,
          status: "new",
          priority: parsed.priority,

          department: tgUser?.department || null,
          assigned_to: null,

          submitted_by: "Anonymous",
          submitted_name: "Anonymous",

          telegram_id: null,
          role: null,
          source: "telegram",

          is_anonymous: true,
          voice_date: new Date().toISOString().slice(0, 10),
        });

      if (error) {
        await sendTelegramMessage(
          chatId,
          `Anonymous Voice хадгалахад алдаа гарлаа: ${escapeTelegramHtml(
            error.message
          )}`
        );

        return NextResponse.json({ ok: true });
      }

      await sendTelegramMessage(
        chatId,
        `
    ✅ <b>Anonymous Employee Voice бүртгэгдлээ</b>

    Төрөл: ${escapeTelegramHtml(parsed.category)}
    Priority: ${escapeTelegramHtml(parsed.priority)}

    Таны нэр хадгалагдсангүй.
    `
      );

      return NextResponse.json({ ok: true });
    }

   if (text.startsWith("/voice")) {
      const parsed = parseTelegramVoice(text);
      const voiceText = parsed.content;

      if (!organizationId) {
        await sendTelegramMessage(
          chatId,
          "Таны Telegram хэрэглэгчид байгууллага оноогоогүй байна. Admin хэрэглэгчид хандана уу."
        );

        return NextResponse.json({ ok: true });
      }

      if (!voiceText) {
        await sendTelegramMessage(
          chatId,
          `
    <b>Employee Voice илгээх формат</b>

    <code>/voice санал medium Ажлын байрны гэрэлтүүлэг муу байна</code>
    <code>/voice гомдол high Ажлын цаг хэт урт байна</code>
    <code>/voice эрсдэл critical Галын хор байхгүй байна</code>
    `
        );

        return NextResponse.json({ ok: true });
      }

      const { error } = await supabase
        .from("employee_voice")
        .insert({
          organization_id: organizationId,

          title: voiceText.slice(0, 80),
          description: voiceText,

          type: parsed.type,
          category: parsed.category,
          status: "new",
          priority: parsed.priority,

          department: tgUser?.department || null,
          assigned_to: null,

          submitted_by: fullName || username || telegramId,
          submitted_name: fullName || username || telegramId,

          telegram_id: telegramId,
          role,
          source: "telegram",

          is_anonymous: false,
          voice_date: new Date().toISOString().slice(0, 10),
        });

      if (error) {
        await sendTelegramMessage(
          chatId,
          `Employee Voice хадгалахад алдаа гарлаа: ${escapeTelegramHtml(
            error.message
          )}`
        );

        return NextResponse.json({ ok: true });
      }

      await sendTelegramMessage(
        chatId,
        `
    ✅ <b>Employee Voice бүртгэгдлээ</b>

    Төрөл: ${escapeTelegramHtml(parsed.category)}
    Priority: ${escapeTelegramHtml(parsed.priority)}
    Telegram ID: <code>${escapeTelegramHtml(telegramId)}</code>

    Текст:
    ${escapeTelegramHtml(voiceText)}
    `
      );

      return NextResponse.json({ ok: true });
    }

    if (text.startsWith("/")) {
      await sendTelegramMessage(
        chatId,
        "Команд танигдсангүй. /help гэж бичиж боломжит командуудыг харна уу."
      );

      return NextResponse.json({ ok: true });
    }

    if (text) {
      if (!organizationId) {
        await sendTelegramMessage(
          chatId,
          "Таны Telegram хэрэглэгчид байгууллага оноогоогүй байна."
        );

        return NextResponse.json({ ok: true });
      }

      await answerWithAI(
        chatId,
        text,
        role,
        organizationId
      );

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("WEBHOOK ERROR:", error?.message || error);

    return NextResponse.json({
      ok: true,
      handled: false,
      error: error?.message || "Webhook error",
    });
  }
}

