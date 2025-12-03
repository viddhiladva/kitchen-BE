import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/database";
import itemRoutes from "./routes/item.routes";
import levelRoutes from "./routes/level.routes";
import categoryRoutes from "./routes/category.routes";
import adminRoutes from "./routes/admin.routes";
import "dotenv/config";

const app = express();

// PORT from .env (fallback to 4000 for local development)
const PORT = process.env.PORT || 4000;

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check endpoint for Render
app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/items", itemRoutes);
app.use("/api/levels", levelRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admins", adminRoutes);

// Initialize Database
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection error:", err));
