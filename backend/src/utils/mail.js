const nodemailer = require('nodemailer');

// Simple mail sender using SMTP env vars. If not configured, logs email to console.
const getTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  return null;
};

const sendMail = async ({ to, subject, html, text }) => {
  const transporter = getTransporter();
  if (!transporter) {
    console.log('EMAIL (no SMTP configured) -> to:', to);
    console.log('subject:', subject);
    console.log('text:', text || html);
    return;
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to,
    subject,
    text,
    html,
  });
};

module.exports = { sendMail };
