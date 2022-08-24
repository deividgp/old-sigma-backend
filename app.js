import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import cors from "cors"
import session from "express-session"
import channelRoutes from "./routes/channel.js";
import serverRoutes from "./routes/server.js";
import userRoutes from "./routes/user.js";
import authRoutes from "./routes/authentication.js";
import passport from "passport";
import cookieParser from "cookie-parser";
import isNotAuthenticated from "./utils/isNotAuthenticated.js";
import isAuthenticated from "./utils/isAuthenticated.js";
import isAdmin from "./utils/isAdmin.js";

const app = express();

// Middlewares
app.use(morgan('combined'))
app.use(helmet());
// For parsing application/json
app.use(express.json());
// For parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(authRoutes);
app.use("/channels", channelRoutes);
app.use("/servers", serverRoutes);
app.use("/users", userRoutes);
app.use(isAuthenticated);
app.use(isNotAuthenticated);
app.use(isAdmin);

export default app;