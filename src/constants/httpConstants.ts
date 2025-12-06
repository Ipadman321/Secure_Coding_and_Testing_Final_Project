export const HTTP_STATUS = {
    // Success Responses
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204, // NEW: For successful DELETE operations, etc.

    // Client-side error responses
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,

    // Server-side error responses
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502, // NEW: For external service failures
    SERVICE_UNAVAILABLE: 503, // NEW: For temporary service outages

} as const;