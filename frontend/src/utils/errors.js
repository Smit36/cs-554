export class HttpError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code;
    this.status = code;
  }
}

export class QueryError extends Error {}

export class ValidationError extends Error {}

export class AxiosError extends Error {
  constructor(error) {
    if (!error || typeof error !== 'object' || !error.isAxiosError) {
      super(error);
    } else {
      const { request = {}, response = {} } = error;
      const message = response.data?.message || error.message || '';
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
