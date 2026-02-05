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
    subject: "🔐 Your Productr Login OTP",
    html: `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Productr OTP</title>
  </head>
  <body style="margin:0; padding:0; background:#f6f7fb; font-family:Arial, Helvetica, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 16px;">
          
          <!-- Card -->
          <table width="100%" style="max-width:520px; background:#ffffff; border-radius:14px; box-shadow:0 10px 30px rgba(0,0,0,0.08);" cellpadding="0" cellspacing="0">
            
            <!-- Header -->
            <tr>
              <td style="padding:24px; border-radius:14px 14px 0 0;
                background: linear-gradient(135deg, #0b157a, #4f46e5); color:#ffffff;">
                <h2 style="margin:0; font-size:20px;">Productr</h2>
                <p style="margin:6px 0 0; font-size:13px; opacity:0.9;">
                  Secure Login Verification
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:28px;">
                <p style="margin:0 0 14px; color:#111827; font-size:14px;">
                  Hi 👋,
                </p>

                <p style="margin:0 0 18px; color:#374151; font-size:14px; line-height:1.5;">
                  Use the OTP below to log in to your <b>Productr</b> account.
                  This OTP is valid for a short time only.
                </p>

                <!-- OTP Box -->
                <div style="
                  margin:20px 0;
                  text-align:center;
                  font-size:28px;
                  letter-spacing:6px;
                  font-weight:700;
                  color:#0b157a;
                  background:#f3f4f6;
                  padding:14px;
                  border-radius:10px;
                ">
                  ${otp}
                </div>

                <p style="margin:0; color:#6b7280; font-size:12px;">
                  ⏱ This OTP will expire in a few minutes.
                </p>
              </td>
            </tr>

            <!-- Divider -->
            <tr>
              <td style="padding:0 28px;">
                <hr style="border:none; border-top:1px solid #e5e7eb;" />
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 28px 28px;">
                <p style="margin:0; color:#6b7280; font-size:12px; line-height:1.5;">
                  If you didn’t request this OTP, you can safely ignore this email.
                  Your account remains secure.
                </p>

                <p style="margin:14px 0 0; color:#9ca3af; font-size:11px;">
                  © ${new Date().getFullYear()} Productr. All rights reserved.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
    text: `Your Productr OTP is ${otp}. It will expire in a few minutes.`
  };

  await sgMail.send(msg);
};
