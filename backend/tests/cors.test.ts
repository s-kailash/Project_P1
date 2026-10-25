import request from "supertest";
import { describe, expect, it } from "vitest";
import { app } from "../src/app";

describe("CORS", () => {
  it("allows the configured frontend origin", async () => {
    const res = await request(app).get("/api/v1/health").set("Origin", "http://localhost:5173");

    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
    expect(res.headers["access-control-allow-credentials"]).toBe("true");
  });

  it("does not allow other origins", async () => {
    const res = await request(app).get("/api/v1/health").set("Origin", "http://evil.example");

    expect(res.headers["access-control-allow-origin"]).toBeUndefined();
  });

  it("answers preflight requests", async () => {
    const res = await request(app)
      .options("/api/v1/health")
      .set("Origin", "http://localhost:5173")
      .set("Access-Control-Request-Method", "POST");

    expect(res.status).toBe(204);
    expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
  });
});
