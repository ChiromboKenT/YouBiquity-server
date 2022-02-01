import HttpStatusCode from "./HttpStatusCodes";

class AppError extends Error {
  statusCode: HttpStatusCode;
  status: "fail" | "error";

  constructor();
  constructor(message?: string, statusCode?: HttpStatusCode) {
    super(message);
    this.statusCode = statusCode || 500;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
