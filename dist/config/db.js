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
exports.connectDB = connectDB;
exports.disconnectDB = disconnectDB;
exports.testDBConnection = testDBConnection;
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Connect to MongoDB database
 */
function connectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const dbHOST = process.env.DB_HOST;
            if (!dbHOST) {
                throw new Error("Database HOST (DB_HOST) not set in environment variables");
            }
            yield mongoose_1.default.connect(dbHOST, {
                serverSelectionTimeoutMS: 5000,
            });
            console.log(" MongoDB connection successful");
        }
        catch (error) {
            console.error("MongoDB connection error:", error);
            process.exit(1); // Exit the application if DB connection fails
        }
    });
}
/**
 * Disconnect from MongoDB
 */
function disconnectDB() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield mongoose_1.default.disconnect();
            console.log(" MongoDB disconnected");
        }
        catch (error) {
            console.error("MongoDB disconnection error:", error);
        }
    });
}
/**
 * Test MongoDB Connection
 */
function testDBConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield connectDB();
            console.log(" Database connection test passed!");
            yield disconnectDB();
        }
        catch (error) {
            console.error(" Database test connection failed:", error);
        }
    });
}
//# sourceMappingURL=db.js.map