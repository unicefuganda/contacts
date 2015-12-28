'use strict';

module.exports = function CustomError(status, message) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.status = status;
};

require('util').inherits(module.exports, Error);