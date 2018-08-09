/**
 * @author Claudio Djohnnatha Duarte Lourenço <cdjohnnatha@gmail.com>
 */
const logger = require('node-color-log');
const EventEmitter = require('events').EventEmitter;
const HoustonErrorEvent = new EventEmitter();
/**
 * Show all fields from error object in all functions.
 * @param {*} error Object error or error message which will be handled to print.
 */
function Logger(error) {
    let errorMessage = `code: ${error.code}, error: ${error.error}`;
    if(error.message) {
      errorMessage = `${errorMessage} message: ${error.message}`;
    }
    if(error.data) {
      errorMessage = `${errorMessage} data: \n${JSON.stringify(error.data)}`;
    }

    // logger.error(errorMessage);
  }

  /**
   * Validates the functions entries by string or object.
   * @param {string|Object} value - It will check if value is string or object.
   */
  function DataValidation(value) {
    if (typeof value !== 'string' && typeof value !== 'object') {
      // logger.warn(`The key ${value} is being ignored, have a different required type. Must be object or string`);
      return false;
    }
    return true;
  }

  /**
   * Get an object and clean by fields where is undefined, empty or null.
   * @param {object} data
   */
  async function CleaningData(data) {
    let cleanedData = data;
    await Object.entries(cleanedData).forEach((value) => {
      if(value[1] === undefined || value[1] === null) {
        logger.warn(`The key ${value[0]} is being ignored because have an undefined, empty or null value`);
        delete cleanedData[value[0]];
      }
    });
    return cleanedData;
  }
  /**
   * Creates a Javascript object error, add extra fields and console everything.
   * @param {object} errorObject - One of objects such as BAD_REQUEST in houstClientErrors.
   * @param {number} message - Custom message (Optional).
   * @param {string} data - Aditional data (Optional).
  */
  function DefaultError(errorObject, {message = undefined, data = undefined}) {
    let defaultError = new Error();
    defaultError.code = errorObject.code;
    defaultError.error = errorObject.string;
    defaultError.name = errorObject.name;
    if (DataValidation(data)) {
      defaultError.data = data;
    }
    if (DataValidation(message)) {
      defaultError.message = message;
    }
    Logger(defaultError);
    HoustonErrorEvent.emit('weHaveAProblem', defaultError);
    return CleaningData(defaultError);
  }

  /**
   * @param {object} code - One of objects created by this application.
   * @param {object} error - Error object.
   * @param {string} name - Error name.
   * @param {number} message - Custom message (Optional).
   * @param {string} data - Aditional data (Optional).
   * @param {function} cb - callback function to get the error object.
  */
 function CustomError({
    code = 500,
    error='Internal Server Error',
    name='INTERNAL_SERVER_ERROR',
    message=undefined,
    data=undefined
  }) {
  let customError = new Error();
  customError.code = DataValidation(code) ? code : undefined;
  customError.error = DataValidation(error) ? error : undefined;
  customError.name = DataValidation(name) ? name : undefined;
  customError.data = DataValidation(data) ? data : undefined;
  customError.message = DataValidation(message) ? message : undefined;
  Logger(customError);
  HoustonErrorEvent.emit('weHaveAProblem', customError);
  return CleaningData(customError);
}

  /**
   * @param {Object} error - Error object.
  */
  function ThrowError(error) {
    Logger(error);
    return error;
  }

module.exports = {
    Logger,
    CustomError,
    DefaultError,
    ThrowError,
    DataValidation,
    CleaningData,
    HoustonErrorEvent,
};