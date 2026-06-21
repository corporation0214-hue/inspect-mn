import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let browser: any;

  try {
    const { html, fileName } = await request.json();

    if (!html) {
      return NextResponse.json(
        { error: "Report HTML is required" },
        { status: 400 }
      );
    }

    const isVercel = process.env.VERCEL === "1";

    if (isVercel) {
      const chromium = (await import("@sparticuz/chromium")).default;
      const puppeteerCore = await import("puppeteer-core");

      browser = await puppeteerCore.default.launch({
        args: chromium.args,
        executablePath: await chromium.executablePath(),
        headless: true,
      }); 

    } else {
      const puppeteer = await import("puppeteer");

      browser = await puppeteer.default.launch({
        headless: true,

        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--disable-software-rasterizer",
        ],
      });
    }

    const page = await browser.newPage();

    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    const pdf = await page.pdf({
      format: "A4",
      landscape: true,
      printBackground: true,
      margin: {
        top: "12mm",
        right: "10mm",
        bottom: "12mm",
        left: "10mm",
      },
    });

    await browser.close();

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${
          fileName || "inspect-report.pdf"
        }"`,
      },
    });
  } catch (error: any) {
    if (browser) {
      await browser.close();
    }

    return NextResponse.json(
      { error: error.message || "PDF generation failed" },
      { status: 500 }
    );
  }
}