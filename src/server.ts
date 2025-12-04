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

// Initialize Database and run migrations
AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected!");
    
    // Run migrations in production (Render deployment)
    // Check if we're in production (Render sets PORT, or NODE_ENV=production)
    const isProduction = process.env.NODE_ENV === "production" || process.env.PORT;
    if (isProduction && !process.env.SKIP_MIGRATIONS) {
      try {
        console.log("Running migrations...");
        const migrations = await AppDataSource.runMigrations();
        if (migrations.length > 0) {
          console.log(`Successfully ran ${migrations.length} migration(s)`);
          migrations.forEach((m) => console.log(`  - ${m.name}`));
        } else {
          console.log("No pending migrations.");
        }
      } catch (migrationError) {
        console.error("Migration error:", migrationError);
        // Don't exit - allow server to start even if migrations fail
        // This prevents deployment failures if migrations were already run
      }
    }
    
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection error:", err));
