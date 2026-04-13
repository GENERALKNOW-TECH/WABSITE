import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for sending order confirmation email
  app.post("/api/send-confirmation", async (req, res) => {
    const { email, firstName, orderTotal, itemsCount } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY is not set. Skipping email sending.");
      return res.json({ success: true, message: "Email sending skipped (API key missing)" });
    }

    const resend = new Resend(resendApiKey);

    try {
      const { data, error } = await resend.emails.send({
        from: "GROW Sanitary <onboarding@resend.dev>",
        to: [email],
        subject: "Order Confirmation - GROW Sanitary & Kitchen Product",
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h1 style="color: #2563eb;">Order Confirmed!</h1>
            <p>Hi ${firstName || 'Valued Customer'},</p>
            <p>Thank you for your order from <strong>GROW Sanitary & Kitchen Product</strong>. We're excited to let you know that we've received your order and are preparing it for shipment.</p>
            
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Order Summary</h3>
              <p>Items: ${itemsCount || 'Multiple'}</p>
              <p>Total Amount: <strong>Rs. ${orderTotal || '---'}</strong></p>
            </div>

            <p>We'll send you another email when your order has shipped.</p>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
            
            <p style="font-size: 12px; color: #6b7280;">
              GROW Sanitary & Kitchen Product<br />
              123 Industrial Area, Phase 2, Karachi, Pakistan<br />
              info@growsanitary.pk
            </p>
          </div>
        `,
      });

      if (error) {
        console.error("Resend Error:", error);
        return res.status(500).json({ error: error.message });
      }

      res.json({ success: true, data });
    } catch (err) {
      console.error("Server Error:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
