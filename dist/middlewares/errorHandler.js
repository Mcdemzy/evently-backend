"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error("Error:", err.message);
    // Default error response
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
};
exports.errorHandler = errorHandler;
