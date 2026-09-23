# AgriLedger

AgriLedger is a React + TypeScript + Vite web application backed by an Express API, PostgreSQL, and Prisma.

## Development

1. Install dependencies with `npm install`.
2. Configure `.env` and the `VITE_FIREBASE_*` browser variables.
3. Run the API with `npm run dev:server` and the web app with `npm run dev`.

Firebase is used only to authenticate users. PostgreSQL is the source of truth for AgriLedger users, farmers, transactions, payments, inventory, reports, and settings.
