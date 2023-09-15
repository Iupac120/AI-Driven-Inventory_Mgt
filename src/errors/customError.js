export class CustomApiError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
    }
  }
  
  export class BadRequestError extends CustomApiError {
    constructor(message) {
      super(message, 400);
    }
  }
  
  export class UnAuthorizedError extends CustomApiError { // Corrected class name
    constructor(message) {
      super(message, 401);
    }
  }
  
  export class ForbiddenError extends CustomApiError {
    constructor(message) {
      super(message, 403);
    }
  }
  
  export class NotFoundError extends CustomApiError {
    constructor(message) {
      super(message, 404);
    }
  }
  

// export class BadRequestError extends Error {
//     constructor(message){
//       super(message)
//       this.status = 400;
//       this.errorType = "BadUserRequestError";
//     }
// }

// export class NotFoundError extends Error {
//   constructor(message){
//     super(message)
//     this.status = 404;
//     this.errorType = "NotFoundError";
//   }
// }

// export class UnAuthorizedError extends Error {
//   constructor(message){
//     super(message)
//     this.status = 401;
//     this.errorType = "UnAuthorizedError";
//   }
// }

// export class FailedRequestError extends Error {
//   constructor(message){
//     super(message)
//     this.status = 500;
//     this.errorType = "FailedRequestError";
//   }
// }