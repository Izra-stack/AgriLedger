import { app } from "./app.js";

const PORT = Number(process.env.PORT || 5000);

app.listen(PORT, () => {
  console.log(`AgriLedger API running on http://localhost:${PORT}`);
});
