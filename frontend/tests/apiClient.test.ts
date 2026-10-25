import { afterEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiFetch } from "../src/services/apiClient";

function mockFetch(status: number, body: unknown) {
  vi.stubGlobal(
    "fetch",
    vi.fn().mockResolvedValue(
      new Response(JSON.stringify(body), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
    ),
  );
}

afterEach(() => vi.unstubAllGlobals());

describe("apiFetch", () => {
  it("returns the parsed body on success", async () => {
    mockFetch(200, { data: { status: "ok" } });
    await expect(apiFetch("/health")).resolves.toEqual({ data: { status: "ok" } });
  });

  it("throws an ApiError built from the error contract", async () => {
    mockFetch(400, {
      error: {
        code: "VALIDATION_ERROR",
        message: "Invalid request data",
        details: [{ field: "email", message: "Invalid email" }],
      },
    });

    await expect(apiFetch("/signup")).rejects.toMatchObject({
      status: 400,
      code: "VALIDATION_ERROR",
      details: [{ field: "email", message: "Invalid email" }],
    });
  });

  it("throws NETWORK_ERROR when the server cannot be reached", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("fetch failed")));

    const error = (await apiFetch("/health").catch((e) => e)) as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.code).toBe("NETWORK_ERROR");
  });
});
