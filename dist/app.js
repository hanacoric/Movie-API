"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startServer = startServer;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const db_1 = require("./config/db");
const db_2 = require("./config/db");
const movieRoutes_1 = __importDefault(require("./routes/movieRoutes"));
// Load environment variables
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
/**
 * Middleware setup
 */
// Enable CORS for cross-origin requests
app.use((0, cors_1.default)());
// Use JSON body parser
app.use(express_1.default.json());
// Custom middleware to log requests
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`);
    next();
});
/**
 * API Routes
 */
app.use("/api", movieRoutes_1.default);
/**
 * Error Handling Middleware
 */
app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res
        .status(err.status || 500)
        .json({ message: err.message || "Internal Server Error" });
});
(0, db_2.testDBConnection)();
/**
 * Start Server
 */
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (0, db_1.connectDB)();
            const PORT = parseInt(process.env.PORT, 10) || 4000;
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        }
        catch (error) {
            console.error("Failed to start server:", error);
            process.exit(1);
        }
    });
}
//# sourceMappingURL=app.js.map