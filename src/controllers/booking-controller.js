const { StatusCodes } = require("http-status-codes");
const { ErrorResponse, SuccessResponse } = require("../utils/common");
const {BookingService} =  require('../services')

async function createBooking(req, res) { 
  console.log('req.body',req.body);
  try {
   
    const response = await BookingService.createBooking({
      flightId : req.body.flightId,
      userId : req.body.flightId,
      noOfSeats :  req.body.noOfSeats
    });
    SuccessResponse.data = response;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    console.log(error)
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  createBooking
}