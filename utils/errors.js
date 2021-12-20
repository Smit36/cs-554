class AxiosError extends Error {
  constructor(error) {
    if (!error || typeof error !== "object" || !error.isAxiosError) {
      super(error);
    } else {
      const { message = "", request = {}, response = {} } = error;
      super(message);
      this.error = error;
      this.data = response.data;
      this.status = response.status;
      this.statusText = response.statusText;
      this.response = response;
      this.request = request;
    }
  }
}

class HttpError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.status = code;
  }
}

class QueryError extends Error {}

class ValidationError extends Error {}

const defaultErrorHandling = (error, req, res, next) => {
  if (
    error instanceof AxiosError ||
    error instanceof HttpError ||
    error instanceof QueryError ||
    error instanceof ValidationError
  ) {
    console.error(error);
    const { message, status = 400, data = {} } = error;
    res.status(status).json({ ...data, message });
  } else {
    next(error);
  }
};

module.exports = {
  AxiosError,
  HttpError,
  QueryError,
  ValidationError,
  defaultErrorHandling
};
