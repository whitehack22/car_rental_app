
import express from "express";
import customer from "./customer/customer.route";
import location from "./location/location.route";
import car from "./car/car.route";
import booking from "./booking/booking.route";
import insurance from "./insurance/insurance.route";
import maintenance from "./maintenance/maintenance.route";
import payment from "./payment/payment.route";
import reservation from "./reservation/reservation.route";
import { logger } from './middleware/logger';
import { rateLimiterMiddleware } from './middleware/rateLimiter';
import cors from "cors";

const initilizeApp = () => {
  const app = express();

  //middleware
  app.use(express.json());
  app.use(cors({
    origin: "https://car-rental-app-one.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }))
  app.use(logger)
  app.use(rateLimiterMiddleware)

  //route
  customer(app);
  location(app);
  car(app);
  booking(app);
  insurance(app);
  maintenance(app);
  payment(app);
  reservation(app);


  app.get('/', (req, res) => {
    res.send('Hello Express!')
  })

  return app;
}

const app = initilizeApp();
export default app;
