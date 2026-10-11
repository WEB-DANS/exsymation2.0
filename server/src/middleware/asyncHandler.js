// Express 5 forwards rejected async handler promises automatically.
// This wrapper is also useful if adapting the code to Express 4.
export const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next);
