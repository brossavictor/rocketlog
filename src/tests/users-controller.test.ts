import request from "supertest";
import { app } from "@/app";
import { prisma } from "@/database/prisma";

describe("UserController", () => {
  let user_id: string;

  afterAll(async () => {
    await prisma.user.delete({ where: { id: user_id } });
  });

  it("should create a new user successfully.", async () => {
    const response = await request(app).post("/users").send({
      name: "Test User",
      email: "test.user@test.com",
      password: "password",
      role: "customer",
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe("Test User");

    user_id = response.body.id;
  });

  it("should thrown an error if an e-mail already exists", async () => {
    const response = await request(app).post("/users").send({
      name: "Duplicated User",
      email: "test.user@test.com",
      password: "password",
      role: "customer",
    });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe("This e-mail is already registered.");
  });

  it("should throw an error if the e-mail is invalid.", async () => {
    const response = await request(app).post("/users").send({
      name: "Test User",
      email: "invalid.email",
      password: "password",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Validation error.");
  });
});
