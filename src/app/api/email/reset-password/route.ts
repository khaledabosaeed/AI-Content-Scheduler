import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { email, resetLink } = await req.json();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


  // إرسال الإيميل
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset your password",
    html: `
      <p>Hello,</p>
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">${resetLink}</a>
      <p>This link will expire in 15 minutes.</p>
    `,
  });
  console.log("dddd",transporter)

  return NextResponse.json({ success: true });
}
