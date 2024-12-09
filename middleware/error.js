const ErrorResponse = require("../utils/errorResponse");

function errorHandler(err,req,res,next){
    // console.log(err.name);
    // console.log(err.stack)
    let error = {...err}
    // console.log(err);
    error.message = err.message;
    //mongoose bad objectId error
    if(err.name === 'CastError'){
        const errMsg = `Not found with id ${err.value}`
        error = new ErrorResponse(errMsg,404);
    }

    //mongoose duplicate key error
    if(err.code === 11000){
        const errMsg = `Duplicate value`
        error = new ErrorResponse(errMsg,400);
    }

    //mongoose validation error
    if(err.name === 'ValidationError'){
        const errMsg = Object.values(err.errors).map(val => val.message);
        error = new ErrorResponse(errMsg,400);
    }


    res.status(error.statusCode || 500).json({
        success:false,
        error:error.message || 'server error'
    });
}

module.exports = errorHandler;