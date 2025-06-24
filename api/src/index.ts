
import express from "express";
import customer from "./customer/customer.route";
import location from "./location/location.route";
import car from "./car/car.route";
import booking from "./booking/booking.route";
import insurance from "./insurance/insurance.route";
import maintenance from "./maintenance/maintenance.route";
import payment from "./payment/payment.route";
import reservation from "./reservation/reservation.route";
import cors from "cors";

const initilizeApp = () => {
  const app = express();

  //middleware
  app.use(express.json());
  app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  }))

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
