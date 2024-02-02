const request = require("supertest");
const { server } = require("../index");
const { v4: uuidv4 } = require("uuid");
const generateRandomNumber = () => Math.floor(Math.random() * 1000) + 1;

describe("Operaciones CRUD de cafes", () => {
  test("GET /getting all coffees and an array with at least 1 object", async () => {
    const response = await request(server).get("/cafes");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });
  test("DELETE /cafes/:id getting status 404 for an inexisting id", async () => {
    const nonExistingId = uuidv4();
    const fakeToken = "notARealToken";

    const response = await request(server)
      .delete(`/cafes/${nonExistingId}`)
      .set("Authorization", fakeToken);

    expect(response.status).toBe(404);
  });

  test("POST /cafes add a new coffe and get status 201", async () => {
    const newCafe = {
      id: 5,
      nombre: "Latte",
    };

    const response = await request(server).post("/cafes").send(newCafe);

    expect(response.status).toBe(201);
  });

  test("PUT /cafes get status code 400 if we try to update a coffe with a different id", async () => {
    const cafeToUpdate = {
      id: 1,
      nombre: "Cortado Actualizado",
    };
    const randomId = generateRandomNumber();
    const response = await request(server)
      .put(`/cafes/${randomId}`)
      .send(cafeToUpdate);

    expect(response.status).toBe(400);
  });
});

afterAll(() => {
  server.close();
});
