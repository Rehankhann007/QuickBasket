const SibApiV3Sdk = require("sib-api-v3-sdk");

const sendOtp = async (email, otp) => {
  let defaultClient = SibApiV3Sdk.ApiClient.instance;

  let apiKey = defaultClient.authentications["api-key"];
  apiKey.apiKey = process.env.BREVO_API_KEY;

  let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  let sendSmtpEmail = {
    to: [{ email }],
    sender: { email: process.env.BREVO_SENDER },
    subject: "QuickBasket OTP Verification",
    htmlContent: `<h2>Your OTP is: ${otp}</h2>`,
  };

  return apiInstance.sendTransacEmail(sendSmtpEmail);
};

module.exports = sendOtp;