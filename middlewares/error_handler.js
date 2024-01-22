function handleValidationError(error, req, res) {
  if (error.name === "ValidationError") {
    // Mongoose validation error
    const errors = {};
    for (const field in error.errors) {
      errors[field] = error.errors[field].message;
    }
    res.status(400).json({ errors });
  } else {
    // Other types of errors
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}

module.exports = handleValidationError;
