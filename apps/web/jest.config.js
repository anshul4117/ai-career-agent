module.exports = {
  moduleFileExtensions: ["js", "json", "ts", "tsx"],
  rootDir: "src",
  testRegex: ".*\\.test\\.(t|j)sx?$",
  transform: {
    "^.+\\.(t|j)sx?$": [
      "ts-jest",
      {
        tsconfig: {
          module: "commonjs",
          moduleResolution: "node",
          esModuleInterop: true,
          jsx: "react-jsx",
          target: "es2020",
          paths: {
            "@/*": ["./*"],
          },
        },
      },
    ],
  },
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testEnvironment: "node",
};
