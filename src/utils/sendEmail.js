// import nodemailer from "nodemailer";

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// export default async function sendEmail(to, subject, text) {
//   await transporter.sendMail({
//     from: process.env.EMAIL_USER,
//     to,
//     subject,
//     text,
//   });
// }


import nodemailer from "nodemailer";

const createTransporter = () => nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,  // Use app password here
  },
});

const transporter = createTransporter();  // Reuse instance

export default async function sendEmail(to, subject, text, html = null) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      ...(html && { html }),  // Optional HTML body
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);  // For debugging (logs in Vercel dashboard)
    return info;  // Returns { messageId, envelope, etc. }
  } catch (error) {
    console.error("Email send failed:", error);
    throw error;  // Re-throw for caller to handle (e.g., return 500 in API)
  }
}