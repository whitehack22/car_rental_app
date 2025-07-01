import { Express } from "express";
import { createCarController, deleteCarController, getAllCarsController, 
    getCarByIdController, getCarsByIdController, updateCarController } from "./car.controller";
import { adminRoleAuth, bothRoleAuth } from '../middleware/bearAuth';




const car = (app: Express) => {
    // create car
    app.route("/api/car").post(
        adminRoleAuth,
        async (req, res, next) => {
            try {
                await createCarController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get all cars
    app.route("/api/cars").get(
        bothRoleAuth,
        async (req, res, next) => {
            try {
                await getAllCarsController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get car by ID
    app.route("/api/car/:id").get(
        bothRoleAuth,
        async (req, res, next) => {
            try {
                await getCarByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //update cars
    app.route("/api/car/:id").put(
        adminRoleAuth,
        async (req, res, next) => {
            try {
                await updateCarController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //delete car
    app.route("/api/car/:id").delete(
        adminRoleAuth,
        async (req, res, next) => {
            try {
                await deleteCarController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    //get multiple cars by ID
    app.route("/api/cars/:id").get(
        bothRoleAuth,
        async (req, res, next) => {
            try {
                await getCarsByIdController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}


export default car;


