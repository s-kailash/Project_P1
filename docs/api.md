# API Contract

## Base path
All endpoints live under `/api/v1`.

## Success responses
- Single resource:  { "data": { ... } }
- List:             { "data": [ ... ], "meta": { "page": 1, "limit": 20, "total": 134, "totalPages": 7 } }

## Error responses (always this shape)
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Human-readable summary",
    "details": [ { "field": "email", "message": "Invalid email" } ]
  }
}
`details` is optional and only used for validation errors.

## Pagination, sorting, filtering
- `page` (default 1) and `limit` (default 20, max 100)
- `sort=field` ascending, `sort=-field` descending (e.g. `sort=-createdAt`)
- Filters are plain query params: `?status=OPEN&severity=P1&serviceId=...`
- Example: GET /api/v1/incidents?status=OPEN&severity=P1&page=2&limit=20&sort=-createdAt

## Status codes
| Code | Meaning |
|---|---|
| 200 | OK (read or update) |
| 201 | Created |
| 204 | Success, no body (e.g. delete) |
| 400 | Invalid input (validation failed) |
| 401 | Not logged in / invalid or expired token |
| 403 | Logged in but not allowed (role lacks permission) |
| 404 | Not found (also used when a resource belongs to another workspace) |
| 409 | Conflict (e.g. email already registered, invalid state transition) |
| 429 | Too many requests (rate limit) |
| 500 | Unexpected server error (never leak internals) |