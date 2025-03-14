import type { Config } from "@jest/types";

// TODO: should be able to delete this config
const path = require("path");

// Sync object
const config: Config.InitialOptions = {
  verbose: true,
  moduleDirectories: ["node_modules", path.join(__dirname, "src")]
};
export default config;
