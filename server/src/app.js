import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import mongoSanitize from "./middlewares/mongoSanitize.middleware.js";
import hppSafe from "./middlewares/hpp.middleware.js";

import logger from "./utils/logger.js";
import { limiter } from "./middlewares/rateLimiter.middleware.js";
import { notFound, errorHandler } from "./middlewares/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Behind nginx/Docker — needed for correct req.ip (rate limiter) and secure cookies.
app.set("trust proxy", 1);

app.use(helmet());
// Permissive until frontend URL is known — then restrict via FRONTEND_URL.
app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.use(cookieParser());
app.use(mongoSanitize);
// Collapse duplicated query params to a single value.
app.use(hppSafe);
app.use(morgan("combined", { stream: logger.stream }));

app.use(limiter);

app.get("/", (req, res) => {
  res.send("Exsymation 2.0 is running!");
});

app.use("/api/auth", authRoutes);

// Must stay after all routes.
app.use(notFound);

// Must stay last.
app.use(errorHandler);

export default app;
