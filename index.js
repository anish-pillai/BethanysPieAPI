// Bring the express server & create application
const express = require('express');
const app = express();
const port = 3000;
const router = express.Router();
const pieRepo = require('./repos/pieRepo');
const errorHelper = require('./helpers/errorHelper');
// Configure middleware to support JSON data parsing
app.use(express.json());

// Create a GET to return the list of all pies
router.get('/', function (req, res, next) {
  pieRepo.get(
    function (data) {
      res.status(200).json({
        status: 200,
        statusTest: 'success',
        message: 'All pies',
        data: data,
      });
    },
    function (err) {
      next(err);
    }
  );
});

router.get('/search', function (req, res, next) {
  let searchObject = {
    id: req.query.id,
    name: req.query.name,
  };

  pieRepo.search(
    searchObject,
    function (data) {
      res.status(200).json({
        status: 200,
        statusTest: 'success',
        message: 'Search results',
        data: data,
      });
    },
    function (err) {
      next(err);
    }
  );
});

// Create a GET to return a single pie
router.get('/:id', function (req, res, next) {
  pieRepo.getById(req.params.id, function (data) {
    if (data) {
      res.status(200).json({
        status: 200,
        statusTest: 'success',
        message: 'Single pie',
        data: data,
      });
    } else {
      res.status(404).json({
        status: 404,
        statusTest: 'error',
        message: 'This pie does not exist',
        error: {
          code: 'NOT_FOUND',
          message: 'The pie does not exist',
        },
      });
    }
  });
});

// Create a POST to add a new pie
router.post('/', function (req, res, next) {
  pieRepo.insert(
    req.body,
    function (data) {
      res.status(201).json({
        status: 201,
        statusTest: 'success',
        message: 'New pie added',
        data: data,
      });
    },
    function (err) {
      next(err);
    }
  );
});

// Create a PUT to update a pie
router.put('/:id', function (req, res, next) {
  pieRepo.getById(req.params.id, function (data) {
    if (data) {
      pieRepo.update(req.body, req.params.id, function (data) {
        res.status(200).json({
          status: 200,
          statusTest: 'success',
          message: 'Pie updated',
          data: data,
        });
      });
    } else {
      res.status(404).json({
        status: 404,
        statusTest: 'error',
        message: 'This pie does not exist',
        error: {
          code: 'NOT_FOUND',
          message: 'The pie does not exist',
        },
      });
    }
  });
});

// Create a DELETE to delete a pie
router.delete('/:id', function (req, res, next) {
  pieRepo.getById(
    req.params.id,
    function (data) {
      if (data) {
        pieRepo.delete(req.params.id, function (data) {
          res.status(200).json({
            status: 200,
            statusTest: 'success',
            message: 'Pie deleted',
            data: data,
          });
        });
      } else {
        res.status(404).json({
          status: 404,
          statusTest: 'error',
          message: 'This pie does not exist',
          error: {
            code: 'NOT_FOUND',
            message: 'The pie does not exist',
          },
        });
      }
    },
    function (err) {
      next(err); // pass errors to Express.js error handler for middleware chaining.
      // If we don't pass the error to the error handler, the error will be lost.
      // The error handler will then return a 500 error to the client.
      // If we pass the error to the error handler, the error handler will return the error to the client.
      // The client will then see the error and handle it appropriately.
      // This is a good practice to follow when using Express.js.
      // It ensures that the error is handled properly and that the error is returned to the client.
      // This is a good practice to follow when using Express.js.
      // It ensures that the error is handled properly and that the error is returned to the client.
      // This is a good practice to follow when using Express.js.
      // It ensures that the error is handled properly and that the error is returned to the client.
      // This is a good practice to follow when using Express.js.
    }
  );
});

// Create a PATCH to update the pie
router.patch('/:id', function (req, res, next) {
  pieRepo.getById(req.params.id, function (data) {
    if (data) {
      pieRepo.update(req.body, req.params.id, function (data) {
        res.status(200).json({
          status: 200,
          statusTest: 'success',
          message: 'Pie updated',
          data: data,
        });
      });
    } else {
      res.status(404).json({
        status: 404,
        statusTest: 'error',
        message: 'This pie does not exist',
        error: {
          code: 'NOT_FOUND',
          message: 'The pie does not exist',
        },
      });
    }
  });
});

// Configure router so all the routes are prefixed with /api/v1
app.use('/api/v1', router);

// Configure exception logger that uses next & then pass to the later
app.use(errorHelper.logErrorToConsole);
app.use(errorHelper.logErrorsToFile);

// Configure the server to handle default exceptions to be handled finally
app.use(errorHelper.clientErrorHandler);
app.use(errorHelper.errorHandler);

// Start the server
const server = app.listen(port, function () {
  console.log(`Node server running on port ${port}`);
});
