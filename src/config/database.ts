import "dotenv/config";
import { DataSource } from "typeorm";
import { Level } from "../entities/Level";
import { KitchenCategory } from "../entities/KitchenCategory";
import { Admin } from "../entities/Admin";
import { KitchenItem } from "../entities/KitchenItem";

// Determine environment
const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development" || !process.env.NODE_ENV;

// Parse DATABASE_URL if provided (used by Render and other cloud platforms)
let databaseConfig: any = {};

if (process.env.DATABASE_URL) {
  // Parse DATABASE_URL (format: postgres://user:password@host:port/database)
  const url = new URL(process.env.DATABASE_URL);
  databaseConfig = {
    type: "postgres" as const,
    host: url.hostname,
    port: parseInt(url.port) || 5432,
    username: url.username,
    password: url.password,
    database: url.pathname.slice(1), // Remove leading '/'
  };
} else {
  // Fall back to individual environment variables (for local development)
  databaseConfig = {
    type: "postgres" as const,
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  };
}

// Add common configuration
databaseConfig = {
  ...databaseConfig,
  // Entities
  entities: [Level, KitchenCategory, Admin, KitchenItem],
  
  // Development settings
  synchronize: isDevelopment ? true : false, // NEVER true in production!
  logging: isDevelopment ? true : false,
  
  // Production settings
  ...(isProduction && {
    // Render and most cloud providers require SSL
    ssl: process.env.DATABASE_URL ? {
      rejectUnauthorized: false // Render uses self-signed certificates
    } : (process.env.DB_SSL === "true" ? {
      rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false"
    } : false),
    extra: {
      max: 20, // Maximum number of connections in the pool
      connectionTimeoutMillis: 2000,
    }
  }),
};

export const AppDataSource = new DataSource(databaseConfig);
