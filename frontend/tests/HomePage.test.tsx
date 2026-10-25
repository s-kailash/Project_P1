import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { HomePage } from "../src/pages/HomePage";
import { ApiError } from "../src/services/apiClient";
import { getHealth } from "../src/services/health.service";

vi.mock("../src/services/health.service", () => ({ getHealth: vi.fn() }));

function renderHome() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  render(
    <QueryClientProvider client={client}>
      <HomePage />
    </QueryClientProvider>,
  );
}

afterEach(() => vi.resetAllMocks());

describe("HomePage backend status", () => {
  it("shows the API status when the backend responds", async () => {
    vi.mocked(getHealth).mockResolvedValue({ data: { status: "ok" } });
    renderHome();

    expect(await screen.findByText(/API status: ok/i)).toBeInTheDocument();
  });

  it("shows an error message when the backend is unreachable", async () => {
    vi.mocked(getHealth).mockRejectedValue(
      new ApiError(0, "NETWORK_ERROR", "Could not reach the server"),
    );
    renderHome();

    expect(await screen.findByText(/could not reach the server/i)).toBeInTheDocument();
  });
});
