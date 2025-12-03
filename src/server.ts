import express from "express";
import cors from "cors";
import { AppDataSource } from "./config/database";
import itemRoutes from "./routes/item.routes";
import levelRoutes from "./routes/level.routes";
import categoryRoutes from "./routes/category.routes";
import adminRoutes from "./routes/admin.routes";
import "dotenv/config";

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173'], 
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Routes
app.use("/api/items", itemRoutes);
app.use("/api/levels", levelRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/admins", adminRoutes);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");
    app.listen(4000, () => console.log("Server running on port 4000"));
  })
  .catch((err) => console.error("DB connection error:", err));
