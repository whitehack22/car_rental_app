// __tests__/integration/booking.controller.test.ts

import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { BookingsTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";
import * as bookingService from "../../src/booking/booking.service"; 

let createdBookingId: number;

const testBooking = {
  carID: 1, 
  customerID: 1, 
  rentalStartDate: "2024-06-05", 
  rentalEndDate: "2024-06-10", 
  totalAmount: "250.00"
};

afterAll(async () => {
  if (createdBookingId) {
    await db.delete(BookingsTable).where(eq(BookingsTable.bookingID, createdBookingId));
  }
  await db.$client.end();
});

describe("Booking API Integration Tests", () => {
  it("should create a booking", async () => {
    const res = await request(app).post("/api/booking").send(testBooking);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Booking created successfully");
    expect(res.body.booking).toHaveProperty("bookingID");

    createdBookingId = res.body.booking.bookingID;
  });

  it("should get all bookings", async () => {
    const res = await request(app).get("/api/bookings");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should get booking by ID", async () => {
    const res = await request(app).get(`/api/booking/${createdBookingId}`);

    
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toMatchObject({
      bookingID: createdBookingId,
      rentalEndDate: testBooking.rentalEndDate,
    });
    console.log("BOOKING DATA", res.body.data);
  });

  it("should update a booking", async () => {
    const updatedBooking = {
        rentalStartDate: "2024-07-06", 
        rentalEndDate: "2024-07-13", 
    };

    const res = await request(app)
      .put(`/api/booking/${createdBookingId}`)
      .send(updatedBooking);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Booking updated successfully");
  });

  it("should delete a booking", async () => {
    const res = await request(app).delete(`/api/booking/${createdBookingId}`);

    expect(res.statusCode).toBe(204);
    expect(res.body).toEqual({});
  });

  // ----------------------------
  // 🔴 EDGE CASES BELOW
  // ----------------------------

  it("should return 400 for invalid booking ID format", async () => {
    const res = await request(app).get("/api/booking/not-a-number");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid ID");
  });

  it("should return 404 for non-existent booking ID", async () => {
    const res = await request(app).get("/api/booking/999999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Booking not found");
  });

  it("should not create a booking with missing required fields", async () => {
    const res = await request(app)
      .post("/api/booking")
      .send({});

    expect(res.statusCode).toBe(500); // Or 400, depending on how validation is handled
    expect(res.body).toHaveProperty("error");
  });

  it("should not update a booking with invalid ID", async () => {
    const res = await request(app)
      .put("/api/booking/invalid-id")
      .send({ rentalStartDate: "2025-06-05" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid ID");
  });

  it("should not delete a booking with invalid ID", async () => {
    const res = await request(app).delete("/api/booking/invalid-id");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid ID");
  });

  it("should not update a non-existent booking", async () => {
    const res = await request(app)
      .put("/api/booking/999999")
      .send({ rentalStartDate: "2025-06-11" });

    expect(res.statusCode).toBe(404); // This could be adjusted to 404 if handled
    expect(res.body).toHaveProperty("message", "Booking not found");
  });

  it("should not delete a non-existent booking", async () => {
    const res = await request(app).delete("/api/booking/999999");

    expect(res.statusCode).toBe(204); // You might want to change this to 404 in the controller
  });

  it("should return 500 if createBooking throws an error", async () => {
  jest.spyOn(bookingService, "createBooking").mockImplementation(() => {
    throw new Error("Simulated createBooking error");
  });

    const res = await request(app)
      .post("/api/booking")
      .send({
        carID: 1,
        customerID: 1,
        rentalStartDate: "2024-06-05",
        rentalEndDate: "2024-06-10",
        totalAmount: "250.00",
      });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Simulated createBooking error");

    (bookingService.createBooking as jest.Mock).mockRestore();
  });

  it("should return 500 if getAllBookings throws an error", async () => {
  jest.spyOn(bookingService, "getAllBookings").mockImplementation(() => {
    throw new Error("Simulated getAllBookings error");
  });

    const res = await request(app).get("/api/bookings");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Simulated getAllBookings error");

    (bookingService.getAllBookings as jest.Mock).mockRestore();
  });

  it("should return 500 if getBookingById throws an error", async () => {
  jest.spyOn(bookingService, "getBookingById").mockImplementation(() => {
    throw new Error("Simulated getBookingById error");
  });

    const res = await request(app).get("/api/booking/1");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Simulated getBookingById error");

    (bookingService.getBookingById as jest.Mock).mockRestore();
  });

  it("should return 500 if updateBooking throws an error", async () => {
  jest.spyOn(bookingService, "updateBooking").mockImplementation(() => {
    throw new Error("Simulated updateBooking error");
  });

    const res = await request(app)
      .put("/api/booking/1")
      .send({
        rentalStartDate: "2024-06-15",
        rentalEndDate: "2024-06-20",
      });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Simulated updateBooking error");

    (bookingService.updateBooking as jest.Mock).mockRestore();
  });

  it("should return 500 if deleteBooking throws an error", async () => {
  jest.spyOn(bookingService, "deleteBooking").mockImplementation(() => {
    throw new Error("Simulated deleteBooking error");
  });

    const res = await request(app).delete("/api/booking/1");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Simulated deleteBooking error");

    (bookingService.deleteBooking as jest.Mock).mockRestore();
  });

  it("should return 500 if getBookingsById throws an error", async () => {
  jest.spyOn(bookingService, "getBookingsById").mockImplementation(() => {
    throw new Error("Simulated getBookingsById error");
  });

    const res = await request(app).get("/api/bookings/1");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Simulated getBookingsById error");

    (bookingService.getBookingsById as jest.Mock).mockRestore();
  });

  it("should return 404 if no bookings found for given ID", async () => {
  jest.spyOn(bookingService, "getBookingsById").mockResolvedValue([]);

    const res = await request(app).get("/api/bookings/99999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "No bookings found");

    (bookingService.getBookingsById as jest.Mock).mockRestore();
  });

  it("should return 400 if booking creation fails", async () => {
  jest.spyOn(bookingService, "createBooking").mockResolvedValue(null); // simulate failure

    const res = await request(app).post("/api/booking").send({
      carID: 1,
      customerID: 1,
      rentalStartDate: "2024-06-01",
      rentalEndDate: "2024-06-03",
      totalAmount: "300.00"
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Booking not created");

    (bookingService.createBooking as jest.Mock).mockRestore();
  });

  it("should return 400 for invalid booking ID format", async () => {
    const res = await request(app).get("/api/booking/invalid-id");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid ID");
  });

});
