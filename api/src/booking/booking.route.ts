import { Express } from "express";
import { createBookingController, deleteBookingController, getAllBookingsController, 
    getBookingByIdController, getBookingsByCustomerIdController, getBookingsByIdController, updateBookingController } from "./booking.controller";
import { adminRoleAuth, bothRoleAuth, userRoleAuth } from '../middleware/bearAuth';




const booking = (app: Express) => {
    // create booking
    app.route("/api/booking").post(
        userRoleAuth,
        async (req, res, next) => {
            try {
                await createBookingController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get all bookings
    app.route("/api/bookings").get(
        adminRoleAuth,
        async (req, res, next) => {
            try {
                await getAllBookingsController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get booking by ID
    app.route("/api/booking/:id").get(
        bothRoleAuth,
        async (req, res, next) => {
            try {
                await getBookingByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //update cars
    app.route("/api/booking/:id").put(
        bothRoleAuth,
        async (req, res, next) => {
            try {
                await updateBookingController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete car
    app.route("/api/booking/:id").delete(
        bothRoleAuth,
        async (req, res, next) => {
            try {
                await deleteBookingController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get multiple cars by ID
    app.route("/api/bookings/:id").get(
        bothRoleAuth,
        async (req, res, next) => {
            try {
                await getBookingsByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // Get bookings by customer ID
        app.route("/api/bookings/customer/:customerID").get(
        userRoleAuth,
        async (req, res, next) => {
            try {
            await getBookingsByCustomerIdController(req, res);
            } catch (error) {
            next(error);
            }
        }
        );

}


export default booking;


