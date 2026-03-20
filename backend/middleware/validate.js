/**
 * Reusable validation middleware factory.
 * Pass an array of field rules; each rule is { field, required, minLength, type }.
 */
const validate = (rules) => (req, res, next) => {
  const errors = [];

  for (const rule of rules) {
    const val = req.body[rule.field];

    if (rule.required && (val === undefined || val === null || val === "")) {
      errors.push(`${rule.field} is required`);
      continue;
    }

    if (val !== undefined && rule.minLength && String(val).trim().length < rule.minLength) {
      errors.push(`${rule.field} must be at least ${rule.minLength} characters`);
    }

    if (val !== undefined && rule.type === "enum" && !rule.values.includes(val)) {
      errors.push(`${rule.field} must be one of: ${rule.values.join(", ")}`);
    }
  }

  if (errors.length) {
    return res.status(400).json({ success: false, message: errors[0], errors });
  }

  next();
};

module.exports = validate;
