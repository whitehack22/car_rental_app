import type {Config} from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: "node",
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: [
    "/node_modules",
    "src/Drizzle/db.ts",
    "src/Drizzle/schema.ts",
  ],
  // testTimeout: 40000
  // collectCoverageFrom: [
  //   '<rootDir>/src/**/*.ts',
  // ]
};


export default config;