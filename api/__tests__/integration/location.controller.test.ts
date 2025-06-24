// __tests__/integration/location.controller.test.ts

import request from "supertest";
import app from "../../src/index";
import db from "../../src/Drizzle/db";
import { LocationTable } from "../../src/Drizzle/schema";
import { eq } from "drizzle-orm";
import * as locationService from "../../src/location/location.service"; 

let createdLocationId: number;

const testLocation = {
  locationName: "Eldoret", 
  address: "Eldoret", 
  contactNumber: "0987654321",
};

afterAll(async () => {
  if (createdLocationId) {
    await db.delete(LocationTable).where(eq(LocationTable.locationID, createdLocationId));
  }
  await db.$client.end();
});

describe("Location API Integration Tests", () => {
  it("should create a location", async () => {
    const res = await request(app).post("/api/location").send(testLocation);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Location created successfully");
    expect(res.body.location).toHaveProperty("locationID");

    createdLocationId = res.body.location.locationID;
  });

  it("should get all locations", async () => {
    const res = await request(app).get("/api/locations");

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it("should get location by ID", async () => {
    const res = await request(app).get(`/api/location/${createdLocationId}`);

    
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toMatchObject({
      locationID: createdLocationId,
      locationName: testLocation.locationName,
    });
    console.log("LOCATION DATA", res.body.data);
  });

  it("should update a location", async () => {
    const updatedLocation = {
        locationName: "Updated Location", 
        address: "Updated Address",
    };

    const res = await request(app)
      .put(`/api/location/${createdLocationId}`)
      .send(updatedLocation);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message", "Location updated successfully");
  });

  it("should delete a location", async () => {
    const res = await request(app).delete(`/api/location/${createdLocationId}`);

    expect(res.statusCode).toBe(204);
    expect(res.body).toEqual({});
  });

  // ----------------------------
  // 🔴 EDGE CASES BELOW
  // ----------------------------

  it("should return 400 for invalid location ID format", async () => {
    const res = await request(app).get("/api/location/not-a-number");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid ID");
  });

  it("should return 404 for non-existent location ID", async () => {
    const res = await request(app).get("/api/location/999999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "Location not found");
  });

  it("should not create a location with missing required fields", async () => {
    const res = await request(app)
      .post("/api/location")
      .send({});

    expect(res.statusCode).toBe(500); // Or 400, depending on how validation is handled
    expect(res.body).toHaveProperty("error");
  });

  it("should not update a location with invalid ID", async () => {
    const res = await request(app)
      .put("/api/location/invalid-id")
      .send({ address: "Eldoret" });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid ID");
  });

  it("should not delete a location with invalid ID", async () => {
    const res = await request(app).delete("/api/location/invalid-id");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid ID");
  });

  it("should not update a non-existent location", async () => {
    const res = await request(app)
      .put("/api/location/999999")
      .send({ address: "Nyeri" });

    expect(res.statusCode).toBe(404); // This could be adjusted to 404 if handled
    expect(res.body).toHaveProperty("message", "Location not found");
  });

  it("should not delete a non-existent location", async () => {
    const res = await request(app).delete("/api/location/999999");

    expect(res.statusCode).toBe(204); // You might want to change this to 404 in the controller
  });

  it("should return 500 if createLocation throws an error", async () => {
  jest.spyOn(locationService, "createLocation").mockImplementation(() => {
    throw new Error("Simulated createLocation error");
  });

    const res = await request(app)
      .post("/api/location")
      .send({
        locationName: "Eldoret", 
        address: "Eldoret", 
        contactNumber: "0987654321",
      });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Simulated createLocation error");

    (locationService.createLocation as jest.Mock).mockRestore();
  });

  it("should return 500 if getAllLocations throws an error", async () => {
  jest.spyOn(locationService, "getAllLocations").mockImplementation(() => {
    throw new Error("Simulated getAllLocations error");
  });

    const res = await request(app).get("/api/locations");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Simulated getAllLocations error");

    (locationService.getAllLocations as jest.Mock).mockRestore();
  });

  it("should return 500 if getLocationById throws an error", async () => {
  jest.spyOn(locationService, "getLocationById").mockImplementation(() => {
    throw new Error("Simulated getLocationById error");
  });

    const res = await request(app).get("/api/location/1");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Simulated getLocationById error");

    (locationService.getLocationById as jest.Mock).mockRestore();
  });

  it("should return 500 if updateLocation throws an error", async () => {
  jest.spyOn(locationService, "updateLocation").mockImplementation(() => {
    throw new Error("Simulated updateLocation error");
  });

    const res = await request(app)
      .put("/api/location/1")
      .send({
        locationName: "Updated Location", 
        address: "Updated Address",
      });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Simulated updateLocation error");

    (locationService.updateLocation as jest.Mock).mockRestore();
  });

  it("should return 500 if deleteLocation throws an error", async () => {
  jest.spyOn(locationService, "deleteLocation").mockImplementation(() => {
    throw new Error("Simulated deleteLocation error");
  });

    const res = await request(app).delete("/api/location/1");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Simulated deleteLocation error");

    (locationService.deleteLocation as jest.Mock).mockRestore();
  });

  it("should return 500 if getLocationsById throws an error", async () => {
  jest.spyOn(locationService, "getLocationsById").mockImplementation(() => {
    throw new Error("Simulated getLocationsById error");
  });

    const res = await request(app).get("/api/locations/1");

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty("error", "Simulated getLocationsById error");

    (locationService.getLocationsById as jest.Mock).mockRestore();
  });

  it("should return 404 if no bookings found for given ID", async () => {
  jest.spyOn(locationService, "getLocationsById").mockResolvedValue([]);

    const res = await request(app).get("/api/locations/99999");

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "No locations found");

    (locationService.getLocationsById as jest.Mock).mockRestore();
  });

  it("should return 400 if location creation fails", async () => {
  jest.spyOn(locationService, "createLocation").mockResolvedValue(null); // simulate failure

    const res = await request(app).post("/api/location").send({
      locationName: "Eldoret", 
      address: "Eldoret", 
      contactNumber: "0987654321",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Location not created");

    (locationService.createLocation as jest.Mock).mockRestore();
  });

  it("should return 400 for invalid location ID format", async () => {
    const res = await request(app).get("/api/location/invalid-id");

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("message", "Invalid ID");
  });

});
