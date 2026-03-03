import app from "./app.js";
import { env } from "./config/env.js";
import "./config/db.js";

app.listen(env.port, () => {
  console.log(`EcoRoute backend running on http://localhost:${env.port}`);
});
