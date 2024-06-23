const brevo = require('@getbrevo/brevo');
const fs = require('fs');
const path = require('path');

async function sendVerifyEmail(userId) {
    const { BASE_URL, BREVO_API_KEY, BREVO_EMAIL } = process.env;

    let apiInstance = new brevo.TransactionalEmailsApi();
    const Account = require('../models/Account');
    const account = await Account.findById(userId);
    let apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = BREVO_API_KEY;

    let sendSmtpEmail = new brevo.SendSmtpEmail();

    sendSmtpEmail.subject = "Verify Your PicScape Account";

    const imagePath = path.join(__dirname, '../assets/logo.png');
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');
    const imageSrc = `data:image/png;base64,${base64Image}`;

    sendSmtpEmail.htmlContent = `
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f9f9f9;
        }
        .logo {
          text-align: center;
          margin-bottom: 20px;
        }
        .content {
          background-color: #fff;
          padding: 20px;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="${imageSrc}" width="150">
        </div>
        <div class="content">
          <h2>Verify Your Email Address</h2>
          <p>Dear ${account.username},</p>
          <p>Welcome to PicScape! Please click the button below to verify your email address:</p>
          <p><a href="${BASE_URL}/account/activate?activationToken=${account.activationToken}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>Thank you,<br> Your PicScape Team</p>
        </div>
      </div>
    </body>
    </html>
    `;

    sendSmtpEmail.sender = {
      "name": "PicScape",
      "email": BREVO_EMAIL
    };

    sendSmtpEmail.to = [
      { "email": account.email, "name": account.username }
    ];

    sendSmtpEmail.headers = {
      "X-Mailer": "Brevo"
    };

    sendSmtpEmail.params = {
      "account": account,
    };

    try {
        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        //console.log('Email sent successfully. Response:', response);
        return response;
    } catch (error) {
        //console.error('Error sending email:', error);
        throw error;
    }
}

async function sendLoginVerificationEmail(userId, verificationCode) {
  const { BREVO_API_KEY } = process.env;

  let apiInstance = new brevo.TransactionalEmailsApi();
  const Account = require('../models/Account');
  const account = await Account.findById(userId);
  let apiKey = apiInstance.authentications['apiKey'];
  apiKey.apiKey = BREVO_API_KEY;

  let sendSmtpEmail = new brevo.SendSmtpEmail();

  sendSmtpEmail.subject = "Login Verification for Your PicScape Account";

  const imagePath = path.join(__dirname, '../assets/logo.png');
  const imageData = fs.readFileSync(imagePath);
  const base64Image = imageData.toString('base64');
  const imageSrc = `data:image/png;base64,${base64Image}`;

  sendSmtpEmail.htmlContent = `
  <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 5px;
        background-color: #f9f9f9;
      }
      .logo {
        text-align: center;
        margin-bottom: 20px;
      }
      .content {
        background-color: #fff;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0,0,0,0.1);
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="logo">
        <img src="${imageSrc}" width="150">
      </div>
      <div class="content">
        <h2>Login Verification</h2>
        <p>Dear ${account.username},</p>
        <p>We detected a login attempt to your PicScape account. Please use the following code to verify your login:</p>
        <h3>${verificationCode}</h3>
        <p>If you did not attempt to login, please ignore this email or contact support.</p>
        <p>Thank you,<br> Your PicScape Team</p>
      </div>
    </div>
  </body>
  </html>
  `;

  sendSmtpEmail.sender = {
    "name": "PicScape",
    "email": BREVO_EMAIL
  };

  sendSmtpEmail.to = [
    { "email": account.email, "name": account.username }
  ];

  sendSmtpEmail.headers = {
    "X-Mailer": "Brevo"
  };

  sendSmtpEmail.params = {
    "account": account,
  };

  try {
      const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
      //console.log('Email sent successfully. Response:', response);
      return response;
  } catch (error) {
      //console.error('Error sending email:', error);
      throw error;
  }
}

module.exports = { sendVerifyEmail, sendLoginVerificationEmail };
