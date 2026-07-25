import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { site } from "@/lib/site";

export const runtime = "nodejs";

type ContactBody = {
  name?: string;
  email?: string;
  projectType?: string;
  message?: string;
  company?: string;
};

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

// One transport per server process. Config comes from the environment so no
// mailbox credentials live in the repo.
let cachedTransport: nodemailer.Transporter | null = null;

function getTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass) return null;

  if (!cachedTransport) {
    const port = Number(process.env.SMTP_PORT ?? 465);
    cachedTransport = nodemailer.createTransport({
      host,
      port,
      // 465 = implicit TLS; 587 = STARTTLS.
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
      auth: { user, pass },
    });
  }
  return cachedTransport;
}

export async function POST(request: Request) {
  let body: ContactBody;

  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  // Honeypot: a filled hidden field means a bot. Report success and drop it.
  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const projectType = String(body.projectType ?? "").trim();
  const message = String(body.message ?? "").trim();

  if (!name || !email || !projectType || message.length < 20) {
    return NextResponse.json(
      { ok: false, error: "Please fill in all fields with a complete message." },
      { status: 400 },
    );
  }

  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "Enter a valid email address." }, { status: 400 });
  }

  const transport = getTransport();
  const to = process.env.CONTACT_TO || site.email;
  const from = process.env.CONTACT_FROM || `Greigh Studios <${site.email}>`;

  if (!transport) {
    console.error("SMTP is not configured (SMTP_HOST / SMTP_USER / SMTP_PASS)");
    return NextResponse.json(
      {
        ok: false,
        error: `Contact form isn’t configured yet. Email ${site.email} instead.`,
      },
      { status: 503 },
    );
  }

  try {
    await transport.sendMail({
      from,
      to,
      replyTo: `${name} <${email}>`,
      subject: `[Greigh Studios] ${projectType} inquiry from ${name}`,
      text: [`Name: ${name}`, `Email: ${email}`, `Project type: ${projectType}`, "", message].join(
        "\n",
      ),
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact send failed:", err);
    return NextResponse.json(
      { ok: false, error: "Unable to send the message right now. Try again in a moment." },
      { status: 502 },
    );
  }
}
