import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import veniceRoutes from "./routes/venice-routes.js";
import castRoutes from "./routes/cast-routes.js";
import indexRoutes from "./routes/index-routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use("/api", indexRoutes);
app.use("/api", veniceRoutes);
app.use("/api", castRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
