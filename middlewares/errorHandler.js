const errorHandler = (err, req, res, next) => {
    // If res.statusCode is still 200, override to 500
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    res.status(statusCode);
    res.json({
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  }
  

module.exports = errorHandler;
