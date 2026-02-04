import sgMail from "@sendgrid/mail";

export const initSendGrid = () => {
  const key = process.env.SENDGRID_API_KEY;
  if (!key) {
    console.warn("⚠️ SENDGRID_API_KEY missing. Email OTP will not work.");
    return;
  }
  sgMail.setApiKey(key);
};

export const sendOtpEmail = async ({ to, otp }) => {
  const from = process.env.SENDGRID_FROM_EMAIL;
  if (!from) throw new Error("SENDGRID_FROM_EMAIL missing in .env");

  const msg = {
    to,
    from,
    subject: "Your Productr OTP",
    text: `Your OTP is ${otp}. It expires soon.`,
    html: `<div style="font-family:Arial;">
      <h2>Productr OTP</h2>
      <p>Your OTP is: <b style="font-size:18px;">${otp}</b></p>
      <p>This OTP will expire in a few minutes.</p>
    </div>`
  };

  await sgMail.send(msg);
};
