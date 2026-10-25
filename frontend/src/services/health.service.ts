import { apiFetch } from "./apiClient";
import type { ApiResponse } from "./types";

export type HealthStatus = { status: string };

export function getHealth() {
  return apiFetch<ApiResponse<HealthStatus>>("/health");
}