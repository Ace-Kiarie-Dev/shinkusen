# SHINKUSEN

Faith meets streetwear. A Nesture-X Original.

> "Come now, let us reason together, saith the LORD: though your sins be as scarlet, they shall be as white as snow." -- Isaiah 1:18

Custom-made apparel (tees, hoodies, sweatshirts, sweatpants) sitting at the intersection of Christian faith, anime culture, and Kenyan identity, built out of Nairobi.

## Stack

- **Client**: React + Vite + TypeScript, Tailwind CSS + custom brand CSS
- **Server**: Node.js + Express + TypeScript
- **Database**: MongoDB Atlas
- **Images**: Cloudinary
- **PDF receipts**: PDFKit
- **Auth**: JWT, single-user admin, seeded via script
- **Payments**: M-Pesa STK Push (Daraja API, Buy Goods Till)
- **WhatsApp**: Twilio

## Structure

```
shinkusen/
  client/   React + Vite + TypeScript storefront and admin panel
  server/   Express + TypeScript API
```

## Getting started

### Server

```bash
cd server
cp .env.example .env   # fill in the values
npm install
npm run dev
```

### Client

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

### Seed the admin user

```bash
cd server
npm run seed:admin
```

Uses `SEED_ADMIN_NAME`, `SEED_ADMIN_EMAIL`, and `SEED_ADMIN_PASSWORD` from `server/.env`.
