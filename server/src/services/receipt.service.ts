import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";
import cloudinary from "../config/cloudinary";
import type { IOrder } from "../models/Order";

const BRAND_BLACK = "#0a0a0a";
const BRAND_CRIMSON = "#DC143C";
const BRAND_MUTED = "#888888";
const RECEIPTS_DIR = path.join(process.cwd(), "receipts");

function formatKes(amount: number): string {
  return `KES ${amount.toLocaleString("en-KE", { minimumFractionDigits: 0 })}`;
}

function ensureReceiptsDir(): void {
  if (!fs.existsSync(RECEIPTS_DIR)) {
    fs.mkdirSync(RECEIPTS_DIR, { recursive: true });
  }
}

function drawReceipt(doc: PDFKit.PDFDocument, order: IOrder): void {
  const pageWidth = doc.page.width;
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;

  doc.rect(0, 0, pageWidth, doc.page.height).fill(BRAND_BLACK);

  doc
    .fillColor("#ffffff")
    .font("Helvetica-Bold")
    .fontSize(28)
    .text("SHINKUSEN", margin, 50);

  doc
    .fillColor(BRAND_CRIMSON)
    .font("Helvetica")
    .fontSize(9)
    .text("A NESTURE-X ORIGINAL", margin, 82);

  doc
    .moveTo(margin, 105)
    .lineTo(pageWidth - margin, 105)
    .lineWidth(1.5)
    .strokeColor(BRAND_CRIMSON)
    .stroke();

  doc
    .fillColor("#ffffff")
    .font("Courier")
    .fontSize(10)
    .text(`RECEIPT  ${order.receiptNumber}`, margin, 120)
    .fillColor(BRAND_MUTED)
    .text(
      `DATE  ${new Date(order.createdAt).toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" })}`,
      margin,
      136,
    );

  let y = 170;
  doc.fillColor(BRAND_CRIMSON).font("Helvetica-Bold").fontSize(11).text("CUSTOMER", margin, y);
  y += 18;
  doc.fillColor("#ffffff").font("Helvetica").fontSize(10);
  doc.text(order.customer.name, margin, y);
  y += 15;
  doc.text(order.customer.phone, margin, y);
  y += 15;
  if (order.customer.email) {
    doc.text(order.customer.email, margin, y);
    y += 15;
  }
  doc.text(order.customer.location, margin, y);
  y += 30;

  doc.fillColor(BRAND_CRIMSON).font("Helvetica-Bold").fontSize(11).text("ITEMS", margin, y);
  y += 20;

  const columns = {
    item: margin,
    size: margin + 220,
    colour: margin + 290,
    qty: margin + 370,
    price: margin + 410,
    total: margin + 480,
  };

  doc.fillColor(BRAND_MUTED).font("Helvetica-Bold").fontSize(9);
  doc.text("ITEM", columns.item, y);
  doc.text("SIZE", columns.size, y);
  doc.text("COLOUR", columns.colour, y);
  doc.text("QTY", columns.qty, y);
  doc.text("PRICE", columns.price, y);
  doc.text("TOTAL", columns.total, y);
  y += 14;

  doc.moveTo(margin, y).lineTo(pageWidth - margin, y).strokeColor("#1e1e1e").lineWidth(1).stroke();
  y += 10;

  doc.font("Helvetica").fontSize(9.5).fillColor("#ffffff");

  for (const item of order.items) {
    doc.text(item.title, columns.item, y, { width: 210 });
    doc.text(item.size, columns.size, y);
    doc.text(item.colour, columns.colour, y);
    doc.text(String(item.qty), columns.qty, y);
    doc.text(formatKes(item.unitPrice), columns.price, y);
    doc.text(formatKes(item.lineTotal), columns.total, y);
    y += 20;
  }

  y += 10;
  doc.moveTo(margin, y).lineTo(pageWidth - margin, y).strokeColor("#1e1e1e").lineWidth(1).stroke();
  y += 16;

  const totalsX = columns.price;
  doc.font("Helvetica").fontSize(10).fillColor(BRAND_MUTED);
  doc.text("Subtotal", totalsX - 60, y);
  doc.fillColor("#ffffff").text(formatKes(order.subtotal), totalsX, y, { align: "left" });
  y += 16;

  doc.fillColor(BRAND_MUTED).text("Shipping", totalsX - 60, y);
  doc.fillColor("#ffffff").text(formatKes(order.shipping), totalsX, y);
  y += 16;

  doc.font("Helvetica-Bold").fontSize(13).fillColor(BRAND_CRIMSON).text("TOTAL", totalsX - 60, y);
  doc.fillColor("#ffffff").text(formatKes(order.total), totalsX, y);
  y += 30;

  doc.font("Courier").fontSize(9).fillColor(BRAND_MUTED);
  doc.text(`M-PESA REF  ${order.mpesaRef ?? "PENDING"}`, margin, y);

  const footerY = doc.page.height - 90;
  doc
    .moveTo(margin, footerY - 15)
    .lineTo(pageWidth - margin, footerY - 15)
    .strokeColor(BRAND_CRIMSON)
    .lineWidth(1)
    .stroke();

  doc
    .font("Times-Italic")
    .fontSize(11)
    .fillColor(BRAND_MUTED)
    .text(
      '"Come now, let us reason together, saith the LORD: though your sins be as scarlet, they shall be as white as snow." -- Isaiah 1:18',
      margin,
      footerY,
      { width: contentWidth, align: "center" },
    );
}

export async function generateReceipt(order: IOrder): Promise<{ localPath: string; url: string }> {
  ensureReceiptsDir();

  const fileName = `${order.receiptNumber}.pdf`;
  const localPath = path.join(RECEIPTS_DIR, fileName);

  await new Promise<void>((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 0 });
    const stream = fs.createWriteStream(localPath);

    doc.pipe(stream);
    drawReceipt(doc, order);
    doc.end();

    stream.on("finish", resolve);
    stream.on("error", reject);
  });

  const upload = await cloudinary.uploader.upload(localPath, {
    resource_type: "raw",
    folder: "shinkusen/receipts",
    public_id: order.receiptNumber,
    overwrite: true,
  });

  return { localPath, url: upload.secure_url };
}
