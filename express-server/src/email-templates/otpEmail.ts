export const otpEmail = (name: string, otp: number) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <title>Email Verification OTP</title>
    <style>
      body {
        font-family: "Segoe UI", Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f8f9fa;
        color: #333333;
        line-height: 1.6;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        padding: 2rem;
        background-color: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      }
      .content {
        text-align: center;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #eeeeee;
      }
      .otp-container {
        margin: 1.5rem 0;
      }
      .otp {
        background-color: #7f0e70;
        color: #ffffff;
        padding: 12px 24px;
        font-size: 24px;
        font-weight: bold;
        border-radius: 6px;
        letter-spacing: 8px;
        display: inline-block;
        margin: 0 auto;
      }
      .footer {
        margin-top: 1.5rem;
        text-align: center;
        color: #666666;
        font-size: 14px;
      }
      .social-icon {
        margin: 16px 0;
      }
      .social-icon a {
        display: inline-block;
      }
      .social-icon img {
        width: 26px;
        height: 26px;
        transition: opacity 0.2s;
      }
      .social-icon img:hover {
        opacity: 0.8;
      }
      .logo {
        max-width: 160px;
        height: auto;
        margin-bottom: 1rem;
        border: 1px solid #eeeeee;
        border-radius: 8px;
        padding: 1rem;
      }
      .contact-info {
        margin-top: 1rem;
        font-size: 13px;
        color: #777777;
      }
      .contact-info a {
        color: #7f0e70;
        text-decoration: none;
        font-weight: 500;
      }
      .note {
        font-size: 12px;
        color: #999999;
        margin-top: 1.5rem;
        font-style: italic;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="content">
        <h2 style="margin-bottom: 1.5rem">Email Verification</h2>
        <p>Dear ${name},</p>
        <p>Please use the following OTP to verify your email address:</p>

        <div class="otp-container">
          <div class="otp">${otp}</div>
        </div>

        <p style="margin-top: 1.5rem">
          This verification code is valid for 10 minutes.
        </p>
        <p>
          If you didn't request this code, you can safely ignore this email.
        </p>
      </div>

      <div class="footer">
        <img
          class="logo"
          src="https://rubygem.in/logo.png"
          alt="Rubygem Jewels"
        />

        <div class="social-icon">
          <a href="https://www.instagram.com/rubygem.in" target="_blank">
            <img
              src="https://rubygem.in/instagram.png"
              alt="Instagram"
            />
          </a>
        </div>

        <div class="contact-info">
          Need help? Contact us at
          <a href="mailto:sales@rubygem.in">support@rubygem.in</a>
        </div>

        <div class="note">
          © ${new Date().getFullYear()} Rubygem. All rights reserved.
        </div>
      </div>
    </div>
  </body>
</html>
`;
};
