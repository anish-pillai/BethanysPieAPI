const logRepo = require('../repos/logRepo');

const errorHelper = {
  logErrorToConsole: function (err, req, res, next) {
    console.log('Log Entry:', JSON.stringify(errorHelper.errorBuilder(err)));
    console.log('*'.repeat(80));
    next(err);
  },
  logErrorsToFile: function (err, req, res, next) {
    let errorObject = errorHelper.errorBuilder(err);
    errorObject.requestInfo = {
      hostname: req.hostname,
      path: req.path,
      app: req.app,
    };
    logRepo.write(errorObject, function (data) {
      console.log(data);
    });
    next(err);
  },
  clientErrorHandler: function (err, req, res, next) {
    if (req.xhr) {
      res.status(500).json({
        status: 500,
        statusTest: 'Internal Server Error',
        message: err.message,
        error: {
          code: err.code || 'INTERNAL_SERVER_ERROR',
          errno: err.errno || 0,
          call: err.syscall || '',
          stack: err.stack || '',
          message: err.message,
          name: err.name,
          type: err.type,
        },
      });
    } else {
      next(err);
    }
  },
  errorHandler: function (err, req, res, next) {
    res.status(500).json(errorHelper.errorBuilder(err));
  },

  // function errorBuilder to return status & statusTest & message & error & code & errno & call
  errorBuilder: function (err) {
    return {
      status: err.status || 500,
      statusTest: 'Internal Server Error',
      message: err.message,
      error: {
        code: err.code || 'INTERNAL_SERVER_ERROR',
        errno: err.errno || 0,
        call: err.syscall || '',
        stack: err.stack || '',
        message: err.message,
        name: err.name,
        type: err.type,
      },
    };
  },
};

module.exports = errorHelper;
