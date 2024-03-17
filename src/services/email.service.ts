import nodemailer from 'nodemailer';
import 'dotenv/config';

type EmailParams = {
  email: string;
  subject: string;
  html: string;
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 0,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  }
});

const send = ({ email, subject, html }: EmailParams) => {
  return transporter.sendMail({
    to: email,
    subject,
    html,
  });
};

const sendActivationEmail = (email: string, token: string) => {
  const html = `
    <p>Your verification code is ${token}</p>
  `;

  return send({ email, subject: 'Activate', html });
};

const sendResetEmail = (email: string, token: string) => {
  const html = `
    <p>Your reset code is ${token}</p>
  `;

  return send({ email, subject: 'Reset', html });
};

const sendSuccessResetEmail = (email: string) => {
  const html = `
    <p>You have successfully reset your password</p>
  `;

  return send({ email, subject: 'Successfully reset', html });
};

export const emailService = {
  sendActivationEmail,
  sendResetEmail,
  sendSuccessResetEmail,
  send,
};
