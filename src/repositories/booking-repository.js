const { StatusCodes } = require("http-status-codes");

const { Booking } = require("../models");
const {Op} =  require('sequelize')
const { Enums } = require("../utils/common");
const { CANCELLED,BOOKED } = Enums.BOOKING_STATUS;

const CrudRepository = require("./crud-repositories");

class BookingRepository extends CrudRepository {
  constructor() {
    super(Booking);
  }

  async createBooking(data, transaction) {
    const response = await Booking.create(data, { transaction: transaction });
    console.log("response", response);
    return response;
  }
 async get(data, transaction) {
        const response = await Booking.findByPk(data, {transaction: transaction});
        if(!response) {
            throw new AppError('Not able to fund the resource', StatusCodes.NOT_FOUND);
        }
        return response;
    }

    async update(id, data, transaction) { // data -> {col: value, ....}
        const response = await Booking.update(data, {
            where: {
                id: id
            }
        }, {transaction: transaction});
        return response;
    }

    async cancelOldBookings(timestamp) {
        console.log("in repo")
        const response = await Booking.update({status: CANCELLED},{
            where: {
                [Op.and]: [
                    {
                        createdAt: {
                            [Op.lt]: timestamp
                        }
                    }, 
                    {
                        status: {
                            [Op.ne]: BOOKED
                        }
                    },
                    {
                        status: {
                            [Op.ne]: CANCELLED
                        }
                    }
                ]
                
            }
        });
        return response;
    }
}

module.exports = BookingRepository;
