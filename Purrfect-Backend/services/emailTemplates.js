export const verificationTemplate = (name, code) => {
  return `
    <div style="font-family:sans-serif;padding:20px">
      <h2>Welcome to Purrfect 🐱</h2>
      <p>Hello ${name},</p>
      <p>Your verification code is:</p>

      <h1 style="letter-spacing:5px;color:#2a6b6b">
        ${code}
      </h1>

      <p>Please verify your account.</p>
    </div>
  `;
};