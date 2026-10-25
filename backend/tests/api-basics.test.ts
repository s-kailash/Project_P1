import express from "express";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { app } from "../src/app";
import { errorHandler } from "../src/middleware/errorHandler";
import { validate } from "../src/middleware/validate";

describe("API basics", () => {
  it("health endpoint returns ok", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ data: { status: "ok" } });
  });

  it("unknown routes return the contract error", async () => {
    const res = await request(app).get("/api/v1/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe("NOT_FOUND");
  });

  it("malformed JSON returns 400", async () => {
    const res = await request(app)
      .post("/api/v1/health")
      .set("Content-Type", "application/json")
      .send("{bad json");
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("INVALID_JSON");
  });
});

describe("validate middleware and error handler", () => {
  const testApp = express();
  testApp.use(express.json());
  testApp.post(
    "/signup",
    validate({ body: z.object({ email: z.string().email() }) }),
    (_req, res) => {
      res.status(201).json({ data: true });
    },
  );
  testApp.get("/boom", () => {
    throw new Error("secret database password");
  });
  testApp.use(errorHandler);

  it("rejects invalid input with field details", async () => {
    const res = await request(testApp).post("/signup").send({ email: "nope" });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe("VALIDATION_ERROR");
    expect(res.body.error.details[0].field).toBe("email");
  });

  it("accepts valid input", async () => {
    const res = await request(testApp).post("/signup").send({ email: "a@b.com" });
    expect(res.status).toBe(201);
  });

  it("hides internal error details on unexpected errors", async () => {
    const res = await request(testApp).get("/boom");
    expect(res.status).toBe(500);
    expect(JSON.stringify(res.body)).not.toContain("secret");
  });
});