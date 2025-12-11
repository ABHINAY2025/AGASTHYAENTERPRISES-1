import express from "express";
import puppeteer from "puppeteer";
import cors from "cors";

const app = express();

app.use(cors({
  origin: "*",           // <-- allow all for development
  methods: "GET,POST",
  allowedHeaders: "Content-Type",
}));

app.get("/download-invoice", async (req, res) => {
  try {
    const url = req.query.url;

    if (!url) return res.status(400).send("Missing URL");

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"],
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=invoice.pdf",
      "Access-Control-Allow-Origin": "*",   // <-- important
    });

    res.send(pdfBuffer);

  } catch (err) {
    console.error(err);
    res.status(500).send("PDF generation failed");
  }
});

app.listen(4000, () => console.log("PDF server running on :4000"));
