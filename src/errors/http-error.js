class HttpError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

class BadRequestError extends HttpError {
  constructor(message) {
    super(message, 400);
    this.name = "BadRequestError";
  }
}

class NotFoundError extends HttpError {
  constructor(message) {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

module.exports = {
  HttpError,
  BadRequestError,
  NotFoundError,
};
