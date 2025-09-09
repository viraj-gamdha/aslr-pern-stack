import express from "express";
import helmet from "helmet";
import cors, { CorsOptions } from "cors";
import { errorMiddleware } from "@/middlewares/error.js";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import rateLimit from "express-rate-limit";
import { authRoutes } from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import { projectRoutes } from "./routes/project.js";
import { documentRoutes } from "./routes/document.js";
import { uploadRoutes } from "./routes/fileUpload.js";
import { aiAssistRoutes } from "./routes/aiAssist.js";

config({ path: "./.env" });
export const envMode = process.env.NODE_ENV?.trim() || "development";
const port = process.env.PORT || 4000;

// App init
const app = express();
app.use(
  helmet({
    contentSecurityPolicy: envMode !== "development",
    crossOriginEmbedderPolicy: envMode !== "development",
  })
);

//
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// CORS
export const allowedOrigins: string[] =
  process.env.ALLOWED_ORIGINS?.split(",").map((o) => o.trim()) || [];
const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS!"));
    }
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Ip rate limit
const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, /// 10 min.
  max: 100,
  message: "Limit exceeded!",
});
app.use(rateLimiter);

// Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/ai-assist", aiAssistRoutes);
// ---

// All other routes
app.all("/{*any}", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Not found!",
  });
});

// Global error middleware
app.use(errorMiddleware);

app.listen(port, () =>
  console.log("Server is working on Port:" + port + " in " + envMode + " Mode.")
);
