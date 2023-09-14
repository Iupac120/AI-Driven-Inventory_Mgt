export class CustomApiError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
    }
}

export class BadRequestError extends CustomApiError {
    constructor(message){
        super(message,400)
    }
}

export class UnAuthorizedError extends CustomApiError{
    constructor(message){
        super(message,401)
    }
}

export class ForBiddenError extends CustomApiError{
    constructor(message){
        super(message,403)
    }
}

export class NotFoundError extends CustomApiError{
    constructor(message){
        super(message,404)
    }
}
