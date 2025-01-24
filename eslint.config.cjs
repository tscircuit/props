module.exports = {
  plugins: ["@tscircuit/lint"],
  rules: {
    "@tscircuit/lint/camel-case": "error", // Sirf camel-case rule enable karo
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"], // TypeScript files ko include karo
      parser: require("@typescript-eslint/parser"),
    },
  ],
};
