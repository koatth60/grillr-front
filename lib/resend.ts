import { Resend } from "resend";

let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

export async function sendWelcomeEmail(email: string, name: string) {
  await getResend().emails.send({
    from: "Grillr <onboarding@resend.dev>",
    to: email,
    subject: "Welcome to Grillr",
    html: `<p>Hey ${name || "there"}, welcome to Grillr! You have 3 free interview sessions. <a href="${process.env.NEXTAUTH_URL}/dashboard">Start now →</a></p>`,
  });
}

export async function sendReportEmail(
  email: string,
  name: string,
  jobTitle: string,
  avgScore: number,
  reportUrl: string
) {
  const scoreColor = avgScore >= 7 ? "#3fb950" : avgScore >= 5 ? "#d29922" : "#f85149";
  await getResend().emails.send({
    from: "Grillr <onboarding@resend.dev>",
    to: email,
    subject: `Your interview report: ${jobTitle}`,
    html: `<p>Hi ${name}, your average score for <strong>${jobTitle}</strong> was <span style="color:${scoreColor}">${avgScore}/10</span>. <a href="${reportUrl}">View full report →</a></p>`,
  });
}
