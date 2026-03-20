const errorHandler = (err, req, res, next) => {
  console.error(`\x1b[31m[ERROR]\x1b[0m ${err.message}`);

  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ success: false, message: messages[0], errors: messages });
  }
  if (err.code === 11000) {
    return res.status(409).json({ success: false, message: "Duplicate entry" });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

module.exports = errorHandler;
