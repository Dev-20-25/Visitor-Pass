# Visitor Pass Application

A modern, responsive visitor registration system built with Next.js, MongoDB, and Signature Pad.

## Features

- **Modern UI**: Sleek, mobile-first design with Outfit typography.
- **Digital Signature**: Integrated signature pad for users to sign digitally.
- **Real-time Check-in**: Automatically records entry time upon submission.
- **Responsive**: Optimized for all screens, specifically mobile devices.
- **MongoDB Integration**: Stores visitor data in MongoDB Atlas.

## Getting Started

### 1. Prerequisites

- Node.js 18+
- MongoDB Atlas Account (Free tier)

### 2. Setup MongoDB

1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Get your connection string.
3. Update the `MONGODB_URI` in `.env.local`.

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Filling the Form

1. **Name, Phone Number, Reason**: Mandatory fields.
2. **Email**: Optional field.
3. **Digital Signature**: Mandatory signature using the box.
4. **Submit**: Click to record your visit and "In Time".

## QR Code Usage

To use this with a QR code:

1. Deploy the application to a platform like Vercel.
2. Generate a QR code for your deployed URL.
3. Place the QR code at your reception for visitors to scan.
