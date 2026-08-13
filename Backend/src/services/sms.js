// Sends the real SMS. Requires a Twilio account (or swap in any other SMS
// provider's SDK — MSG91, AWS SNS, etc. — the shape of `sendSMS` below is
// all that matters to the rest of the app).
//
// Without credentials set in .env, this quietly logs to the console instead
// of sending, so the app still runs end-to-end in development.

require('dotenv').config();

const {
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  TWILIO_FROM_NUMBER
} = process.env;

const isConfigured = TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN && TWILIO_FROM_NUMBER;

let client = null;
if (isConfigured) {
  const twilio = require('twilio');
  client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
}

/**
 * @param {string} to - phone number in E.164 format, e.g. +919876543210
 * @param {string} body - message text
 */
async function sendSMS(to, body) {
  if (!isConfigured) {
    console.log(`[sms:disabled] Would send to ${to}: ${body}`);
    return { sent: false, reason: 'Twilio credentials not configured (see backend/.env.example)' };
  }
  try {
    const message = await client.messages.create({
      to,
      from: TWILIO_FROM_NUMBER,
      body
    });
    return { sent: true, sid: message.sid };
  } catch (err) {
    console.error(`[sms:error] ${to}:`, err.message);
    return { sent: false, reason: err.message };
  }
}

module.exports = { sendSMS, isConfigured };
