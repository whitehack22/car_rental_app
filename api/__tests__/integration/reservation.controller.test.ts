// __tests__/integration/reservation.controller.test.ts

import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { ReservationTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";
import * as reservationService from "../../src/reservation/reservation.service"; 

let createdReservationId: number;

const testReservation = {
  customerID: 1, 
  carID: 1, 
  reservationDate: "2024-06-01", 
  pickupDate: "2024-06-05", 
  returnDate: "2024-06-10"
};

afterAll(async () => {
  if (createdReservationId) {
    await db.delete(ReservationTable).where(eq(ReservationTable.reservationID, createdReservationId));
  }
  await db.$client.end();
});

describe("Reservation API Integration Tests", () => {
  it("should create a reservation", async () => {
    const res = await request(app).post("/api/reservation").send(testReservation);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Reservation created successfully");
    expect(res.body.reservation).toHaveProperty("reservationID");

    createdReservationId = res.body.reservation.reservationID;
  });

  it("should get all reservations", async () => {
    const res = await request(app).get("/api/reservations");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should get reservation by ID", async () => {
    const res = await request(app).get(`/api/reservation/${createdReservationId}`);

    
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toMatchObject({
      reservationID: createdReservationId,
      reservationDate: testReservation.reservationDate,
    });
    console.log("RESERVATION DATA", res.body.data);
  });

  it("should update a reservation", async () => {
    const updatedReservation = {
          reservationDate: "2025-06-01", 
          pickupDate: "2025-06-05", 
    };

    const res = await request(app)
      .put(`/api/reservation/${createdReservationId}`)
      .send(updatedReservation);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Reservation updated successfully");
  });

  it("should delete a reservation", async () => {
    const res = await request(app).delete(`/api/reservation/${createdReservationId}`);

    expect(res.statusCode).toBe(204);
    expect(res.body).toEqual({});
  });

  // ----------------------------
  // 🔴 EDGE CASES BELOW
  // ----------------------------

  it("should return 400 for invalid reservation ID format", async () => {
    const res = await request(app).get("/api/reservation/not-a-number");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid ID");
  });

  it("should return 404 for non-existent reservation ID", async () => {
    const res = await request(app).get("/api/reservation/999999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Reservation not found");
  });

  it("should not create a reservation with missing required fields", async () => {
    const res = await request(app)
      .post("/api/reservation")
      .send({});

    expect(res.statusCode).toBe(500); // Or 400, depending on how validation is handled
    expect(res.body).toHaveProperty("error");
  });

  it("should not update a reservation with invalid ID", async () => {
    const res = await request(app)
      .put("/api/reservation/invalid-id")
      .send({ pickupDate: "2024-06-11" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid ID");
  });

  it("should not delete a reservation with invalid ID", async () => {
    const res = await request(app).delete("/api/reservation/invalid-id");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid ID");
  });

  it("should not update a non-existent reservation", async () => {
    const res = await request(app)
      .put("/api/reservation/999999")
      .send({ pickupDate: "2024-06-12" });

    expect(res.statusCode).toBe(404); // This could be adjusted to 404 if handled
    expect(res.body).toHaveProperty("message", "Reservation not found");
  });

  it("should not delete a non-existent reservation", async () => {
    const res = await request(app).delete("/api/reservation/999999");

    expect(res.statusCode).toBe(204); // You might want to change this to 404 in the controller
  });

  it("should return 500 if createReservation throws an error", async () => {
  jest.spyOn(reservationService, "createReservation").mockImplementation(() => {
    throw new Error("Simulated createReservation error");
  });

    const res = await request(app)
      .post("/api/reservation")
      .send({
        customerID: 1, 
        carID: 1, 
        reservationDate: "2024-06-01", 
        pickupDate: "2024-06-05", 
        returnDate: "2024-06-10",
      });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Simulated createReservation error");

    (reservationService.createReservation as jest.Mock).mockRestore();
  });

  it("should return 500 if getAllReservations throws an error", async () => {
  jest.spyOn(reservationService, "getAllReservations").mockImplementation(() => {
    throw new Error("Simulated getAllReservations error");
  });

    const res = await request(app).get("/api/reservations");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Simulated getAllReservations error");

    (reservationService.getAllReservations as jest.Mock).mockRestore();
  });

  it("should return 500 if getReservationById throws an error", async () => {
  jest.spyOn(reservationService, "getReservationById").mockImplementation(() => {
    throw new Error("Simulated getReservationById error");
  });

    const res = await request(app).get("/api/reservation/1");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Simulated getReservationById error");

    (reservationService.getReservationById as jest.Mock).mockRestore();
  });

  it("should return 500 if updateReservation throws an error", async () => {
  jest.spyOn(reservationService, "updateReservation").mockImplementation(() => {
    throw new Error("Simulated updateReservation error");
  });

    const res = await request(app)
      .put("/api/reservation/1")
      .send({
        pickupDate: "2022-06-05", 
        returnDate: "2022-06-10"
      });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Simulated updateReservation error");

    (reservationService.updateReservation as jest.Mock).mockRestore();
  });

  it("should return 500 if deleteReservation throws an error", async () => {
  jest.spyOn(reservationService, "deleteReservation").mockImplementation(() => {
    throw new Error("Simulated deleteReservation error");
  });

    const res = await request(app).delete("/api/reservation/1");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Simulated deleteReservation error");

    (reservationService.deleteReservation as jest.Mock).mockRestore();
  });

  it("should return 500 if getReservationsById throws an error", async () => {
  jest.spyOn(reservationService, "getReservationsById").mockImplementation(() => {
    throw new Error("Simulated getReservationsById error");
  });

    const res = await request(app).get("/api/reservations/2");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Simulated getReservationsById error");

    (reservationService.getReservationsById as jest.Mock).mockRestore();
  });

  it("should return 404 if no reservation found for given ID", async () => {
  jest.spyOn(reservationService, "getReservationsById").mockResolvedValue([]);

    const res = await request(app).get("/api/reservations/99999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "No reservations found");

    (reservationService.getReservationsById as jest.Mock).mockRestore();
  });

  it("should return 400 if reservation creation fails", async () => {
  jest.spyOn(reservationService, "createReservation").mockResolvedValue(null); // simulate failure

    const res = await request(app).post("/api/reservation").send({
      customerID: 1, 
      carID: 1, 
      reservationDate: "2024-06-01", 
      pickupDate: "2024-06-05", 
      returnDate: "2024-06-10"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Reservation not created");

    (reservationService.createReservation as jest.Mock).mockRestore();
  });

  it("should return 400 for invalid reservation ID format", async () => {
    const res = await request(app).get("/api/reservation/invalid-id");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid ID");
  });

});
