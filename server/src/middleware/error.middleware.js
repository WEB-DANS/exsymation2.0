export function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}
export function errorHandler(err, req, res, next) {
  if (res.headersSent) return next(err);
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";
  if (err.name === "ValidationError") { statusCode = 400; message = "Validation failed"; }
  else if (err.name === "CastError") { statusCode = 400; message = "Invalid resource ID"; }
  else if (err.code === 11000) { statusCode = 409; message = "A record with this value already exists"; }
  if (statusCode >= 500) { console.error(err); message = "Internal server error"; }
  res.status(statusCode).json({ success: false, message, ...(process.env.NODE_ENV === "development" ? { debug: err.message } : {}) });
}
