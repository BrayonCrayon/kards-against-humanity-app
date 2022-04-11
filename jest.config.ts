import type { Config } from "@jest/types";
const path = require("path");

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  moduleDirectories: ["node_modules", path.join(__dirname, "src")],
};
export default config;
