module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    testMatch: ["**/*.test.ts"],
    collectCoverageFrom: [
        "src/**/*.ts",
        "!src/app.ts", // Exclude server startup file
        "!src/types/**/*.ts", // Exclude type definitions
    ],
};
