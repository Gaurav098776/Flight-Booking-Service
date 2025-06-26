const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, SuccessResponse } = require("../utils/common");
const {BookingService} =  require('../services');



const inMemoDb = {}

async function createBooking(req, res) { 
  try {
    const response = await BookingService.createBooking({
      flightId : req.body.flightId,
      userId : req.body.userId,
      noOfSeats :  req.body.noOfSeats
    });
    SuccessResponse.data = response;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}


async function makePayment(req, res) { 
  try {
    const idempotencyKey =  req.headers['x-idempotency-key']
    if(!idempotencyKey ) {
       return res.status(StatusCodes.BAD_REQUEST).json({message: 'Idempotency key is missing'});
    }
    if( inMemoDb[idempotencyKey]) {
       return res.status(StatusCodes.BAD_REQUEST).json({message: 'Cannot retry on a successful payment'});
    }
    console.log(req.body.totalCost, req.body.userId, req.body.bookingId);
    
    const response = await BookingService.makePayment({
      totalCost : req.body.totalCost,
      userId : req.body.userId,
      bookingId :  req.body.bookingId
    });
    console.log('response', response);
    
    inMemoDb[idempotencyKey] = idempotencyKey;
    SuccessResponse.data = response;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    console.log(error);  
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  createBooking,
  makePayment
}