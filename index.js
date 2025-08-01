import express from "express";
import dotenv from "dotenv";
import cors from 'cors';
import bodyParser from "body-parser";
import nodemailer from "nodemailer";

import { Client, Account } from "node-appwrite";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();



const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Appwrite client setup
const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY); 

const account = new Account(client);

// Nodemailer transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Route to send password reset email
app.post("/send_recovery_email", async (req, res) => {
  const { email } = req.body;

  try {
    const response = await account.createRecovery(
      email,
      process.env.RECOVERY_REDIRECT_URL
    );

    const recoveryLink = `${process.env.RECOVERY_REDIRECT_URL}?userId=${response.userId}&secret=${response.secret}`;

    await transporter.sendMail({
      from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <h2>Reset Your Password</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${recoveryLink}">${recoveryLink}</a>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    });

    res.json({ success: true, message: "Recovery email sent!" });
  } catch (err) {
    console.error("Recovery Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Render password reset page
app.get("/recovery", (req, res) => {
  const { userId, secret } = req.query;
  console.log("Recovery Page Params →", userId, secret); // 👈 Add this
  res.render("reset", { userId, secret });
});
// Handle password reset POST
app.post("/reset_password", async (req, res) => {
  const { userId, secret, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.send("Passwords do not match.");
  }

  try {
    await account.updateRecovery(userId, secret, password, confirmPassword);
    res.send("Password reset successful!");
  } catch (err) {
    console.error("Password reset error:", err.message);
    res.send("Password reset failed.");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running at http://localhost:${PORT}`);
});
