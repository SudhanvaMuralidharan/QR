# 🎫 QTicket Studio

A beautiful event ticket generator for organisers. Upload a registration Excel sheet and instantly generate print-ready, QR-coded tickets for every participant.

---

## 🚀 Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Run locally
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build for production
```bash
npm run build
```
The `dist/` folder is ready to deploy.

### 4. Deploy to Vercel (free)
```bash
npm install -g vercel
vercel
```
Or drag the `dist/` folder into [vercel.com](https://vercel.com).

---

## 📋 Excel Sheet Format

The app expects an `.xlsx` file with this structure:

| Row | Content |
|-----|---------|
| Row 1 | Group headers (Transaction Details, Student Details, Fee Details) |
| Row 2 | Column names |
| Row 3+ | Data |

### Required Columns
- `Transaction Ref No`
- `Transaction Date`
- `Transaction Amount`
- `EVENT NAME`
- `TEAM LEADER NAME`
- `COLLEGE NAME`
- `STUDENT ID`
- `MOBILE NO`
- `EMAIL ID`
- `Group Name`

---

## ✨ Features

- **Drag & drop** Excel file upload
- **Instant ticket generation** — one ticket per registration
- **QR codes** — scannable by any QR app, encodes all event & registrant details
- **Search & filter** by name, event, college, or student ID
- **Stats dashboard** — total registrations, events, amount collected
- **Print all tickets** with browser print dialog (A4 optimised)
- **Responsive** — works on desktop & tablet
