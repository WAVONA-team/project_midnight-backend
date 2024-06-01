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
  },
});

const send = ({ email, subject, html }: EmailParams) => {
  return transporter.sendMail({
    to: email,
    subject,
    html,
  });
};

const generateHTML = (
  header: string,
  description: string,
  token: string,
  error: string,
) => {
  return `
    <!DOCTYPE html>
      <html lang="ru">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Верификационный код</title>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              background-color: #1E201D;
              color: #ffffff;
              margin: 0;
              padding: 0;
            }

            .container {
              width: 100%;
              max-width: 600px;
              margin: 0 auto;
              background-color: #171916;
              padding: 20px;
              border-radius: 10px;
              box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
            }

            .header {
              text-align: center;
              padding: 20px 0;
              background-color: #1E201D;
              color: #ffffff;
              border-radius: 10px 10px 0 0;
            }

            .content {
              padding: 20px;
              text-align: center;
            }

            .content p {
              font-size: 18px;
              margin: 0 0 20px;
              color: #777;
            }

            .token {
              display: inline-block;
              font-size: 24px;
              font-weight: bold;
              padding: 10px 20px;
              border: 2px solid #9C1C22;
              border-radius: 5px;
              background-color: #0d0d0d;
              color: #9C1C22;
            }

            .footer {
              text-align: center;
              padding: 10px 0;
              color: #777;
              font-size: 12px;
            }
          </style>
        </head>

        <body>
          <div class="container">
            <div class="header">
              <h1>${header}</h1>
            </div>
            <div class="content">
              <p>${description}</p>
              <div class="token">${token}</div>
            </div>
            <div class="footer">
              <p>${error}</p>
            </div>
          </div>
        </body>
      </html>
  `;
};

const sendActivationEmail = (email: string, token: string) => {
  return send({
    email,
    subject: 'Подтверждение регистрации',
    html: generateHTML(
      'Код подтверждения',
      'Ваш код подтверждения:',
      token,
      'Если вы не запрашивали код, проигнорируйте это письмо',
    ),
  });
};

const sendResetEmail = (email: string, token: string) => {
  return send({
    email,
    subject: 'Сброс пароля',
    html: generateHTML(
      'Код для сброса пароля',
      'Ваш код для сброса пароля:',
      token,
      'Если вы не запрашивали код, проигнорируйте это письмо',
    ),
  });
};

const sendSuccessResetEmail = (email: string) => {
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Подтверждение сброса пароля</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          background-color: #1E201D;
          color: #ffffff;
          margin: 0;
          padding: 0;
        }

        .container {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
          background-color: #171916;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
        }

        .header {
          text-align: center;
          padding: 20px 0;
          background-color: #1E201D;
          color: #ffffff;
          border-radius: 10px 10px 0 0;
        }

        .content {
          padding: 20px;
          text-align: center;
        }

        .content p {
          font-size: 18px;
          margin: 0 0 20px;
        }

        .content .highlight {
          color: #9C1C22;
          font-weight: bold;
        }

        .footer {
          text-align: center;
          padding: 10px 0;
          color: #777;
          font-size: 12px;
        }
      </style>
    </head>

    <body>
      <div class="container">
        <div class="header">
          <h1>Сброс пароля</h1>
        </div>
        <div class="content">
          <p>Ваш пароль был успешно сброшен</p>
          <p>Если вы не запрашивали сброс пароля, просим немедленно обратиться в службу поддержки</p>
          <p class="highlight">Спасибо за использование Project Midnight!</p>
        </div>
        <div class="footer">
          <p>Если у вас есть вопросы, вы всегда можете <a href="mailto:wavona.team@gmail.com"
              style="color: #9C1C22;">Обратиться в службу поддержки
            </a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  return send({ email, subject: 'Успешный сброс пароля', html });
};

export const emailService = {
  sendActivationEmail,
  sendResetEmail,
  sendSuccessResetEmail,
  send,
};
