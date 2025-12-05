import { Request, Response} from "express";
import isAuthorized from "../src/api/v1/middleware/authorize";
import { AuthorizationOptions } from "../src/api/v1/models/authorizationOptions";

describe("Authorization Middleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let nextFunction: jest.Mock;

    beforeEach(() => {
        // Reset for each test
        mockRequest = {
            params: {},
        };

        mockResponse = {
            locals: {},
        };

        nextFunction = jest.fn();
    });

    it("should call next() when user has required role", () => {
        // Arrange
        mockResponse.locals = {
            uid: "user123",
            role: "admin",
        };

        const options: AuthorizationOptions = {
            hasRole: ["admin", "manager"],
        };

        const middleware = isAuthorized(options);

        // Act
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledWith();
    });

    it("should call next with AuthorizationError when role is missing", () => {
        // Arrange
        mockResponse.locals = {
            uid: "user123",
            // No role specified
        };

        const options: AuthorizationOptions = {
            hasRole: ["admin"],
        };

        const middleware = isAuthorized(options);

        // Act
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Forbidden: No role found",
                code: "ROLE_NOT_FOUND",
            })
        );
    });

    it("should call next with AuthorizationError when user has insufficient role", () => {
        // Arrange
        mockResponse.locals = {
            uid: "user123",
            role: "user",
        };

        const options: AuthorizationOptions = {
            hasRole: ["admin"],
        };

        const middleware = isAuthorized(options);

        // Act
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Forbidden: Insufficient role",
                code: "INSUFFICIENT_ROLE",
            })
        );
    });

    it("should call next() when allowSameUser is true and IDs match", () => {
        // Arrange
        const userId = "user123";

        mockRequest.params = {
            id: userId,
        };

        mockResponse.locals = {
            uid: userId,
            role: "user", // role that normally wouldn't have access
        };

        const options: AuthorizationOptions = {
            hasRole: ["admin"], // roles with higher permission
            allowSameUser: true,
        };

        const middleware = isAuthorized(options);

        // Act
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledWith();
    });

    it("should call next with AuthorizationError when allowSameUser is true but IDs don't match", () => {
        // Arrange
        mockRequest.params = {
            id: "user123",
        };

        mockResponse.locals = {
            uid: "differentUser456", // Different user ID
            role: "user",
        };

        const options: AuthorizationOptions = {
            hasRole: ["admin"],
            allowSameUser: true,
        };

        const middleware = isAuthorized(options);

        // Act
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Forbidden: Insufficient role",
                code: "INSUFFICIENT_ROLE",
            })
        );
    });

    it("should call next with AuthorizationError when allowSameUser is false and IDs match but role is insufficient", () => {
        // Arrange
        const userId = "user123";

        mockRequest.params = {
            id: userId,
        };

        mockResponse.locals = {
            uid: userId,
            role: "user",
        };

        const options: AuthorizationOptions = {
            hasRole: ["admin"],
            allowSameUser: false, // Explicitly disabled
        };

        const middleware = isAuthorized(options);

        // Act
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Forbidden: Insufficient role",
                code: "INSUFFICIENT_ROLE",
            })
        );
    });

    it("should handle empty hasRole array gracefully", () => {
        // Arrange
        mockResponse.locals = {
            uid: "user123",
            role: "admin",
        };

        const options: AuthorizationOptions = {
            hasRole: [], // Empty role array
        };

        const middleware = isAuthorized(options);

        // Act
        middleware(
            mockRequest as Request,
            mockResponse as Response,
            nextFunction
        );

        // Assert
        expect(nextFunction).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Forbidden: Insufficient role",
                code: "INSUFFICIENT_ROLE",
            })
        );
    });
});