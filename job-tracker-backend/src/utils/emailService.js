// In production, integrate with SendGrid, SES, etc.
export const sendPasswordResetEmail = async (email, resetToken) => {
  // eslint-disable-next-line no-console
  console.log(`Password reset token for ${email}: ${resetToken}`);
  // Replace with real email sending.
};
