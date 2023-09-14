import {CustomApiError} from "../errors/customError.js"

export const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomApiError){
        res.status(err.statusCode).json({msg: err.message})
    }
    return res.status(500).json({msg: 'Something went wrong, please try again'})
}

