import { OTP } from '../models/otp.model.js';

// Save OTP for a phone number
export async function saveOTP(phoneNumber: string, otp: string, expiresAt: Date) {
  return OTP.create({ phoneNumber, otp, expiresAt, used: false });
}

// Validate OTP (not expired, not used)
export async function validateOTP(phoneNumber: string, otp: string) {
  const record = await OTP.findOne({
    where: {
      phoneNumber,
      otp,
      used: false,
      expiresAt: { $gt: new Date() },
    },
    order: [['createdAt', 'DESC']],
  });
  return record;
}

// Mark OTP as used
export async function markOTPUsed(id: number) {
  return OTP.update({ used: true }, { where: { id } });
}

// For development: store the static OTP 123456 for a phone number
export async function storeDevOTP(phoneNumber: string) {
  const otp = '123456';
  // Set expiry to 10 minutes from now
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
  return saveOTP(phoneNumber, otp, expiresAt);
}
