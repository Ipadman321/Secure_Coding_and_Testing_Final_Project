export interface AuthorizationOptions {
    hasRole: Array<"admin" | "officer" | "user" | "manager">;
    allowSameUser?: boolean;
}
