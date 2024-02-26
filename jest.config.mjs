import jestConfig from "next/jest.js";

const createJestConfig = jestConfig({
  dir: "./",
});

/** @type {import ("jest").Config} */
const config = {
  collectCoverage: false,
  moduleNameMapper: {
    // Only needed for what is not covered by tsconfig's `paths` option
    "^utils/(.*)$": "<rootDir>/utils/$1",
  },
  testEnvironment: "jsdom",
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testEnvironmentOptions: { customExportConditions: [''] },
};

export default createJestConfig(config);
