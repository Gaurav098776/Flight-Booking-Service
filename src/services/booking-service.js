const axios = require("axios");
const db = require("../models");
const { BookingRepository} = require("../repositories");
const { ServerConfig } = require("../config");
const AppError = require("../utils/errors/app-error");
const { StatusCodes } = require("http-status-codes");

const bookingRepository =  new BookingRepository();

// unmanaged db transaction
async function createBooking(data) {
  const transaction = await db.sequelize.transaction();
  try {
    const flight = await axios.get(
      `${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}`
    );

    const flightData = flight.data.data;

    if (data.noOfSeats > flightData.totalSeats) {
      throw new AppError("Not enough seats available", StatusCodes.BAD_REQUEST);
    }
    const totalBilingAmount =  data.noOfSeats * flightData.price;
   
    const bookingPayload = {...data, totalCost : totalBilingAmount}
    console.log(bookingPayload);
    const booking = await bookingRepository.create(bookingPayload,transaction)
     await axios.patch(`${ServerConfig.FLIGHT_SERVICE}/api/v1/flights/${data.flightId}/seats`,{
      seats : data.noOfSeats
    })

    await transaction.commit();
    return booking;

  } catch (error) {
    await transaction.rollback(); // <- FIXED: added ()
    throw error; // <- FIXED: propagate error to controller
  }
}


module.exports = {
  createBooking,
};
