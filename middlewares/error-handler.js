module.exports.ErrorMessage = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    sucess: false,
    statusCode,
    message: err.message,
    validation: err.validation,
  });
};
