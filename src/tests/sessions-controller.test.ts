import request from "supertest";
import { app } from "@/app";
import { prisma } from "@/database/prisma";

describe("SessionsController", () => {
  let user_id: string;

  afterAll(async () => {
    await prisma.user.delete({ where: { id: user_id } });
  });

  it("should authenticate and get an access token", async () => {
    const user = await request(app).post("/users").send({
      name: " Auth Test User",
      email: "auth.test.user@test.com",
      password: "password",
      role: "customer",
    });

    user_id = user.body.id;

    const session = await request(app).post("/sessions").send({
      email: "auth.test.user@test.com",
      password: "password",
    });
    expect(session.status).toBe(200);
    expect(session.body.token).toEqual(expect.any(String));
  });
});
