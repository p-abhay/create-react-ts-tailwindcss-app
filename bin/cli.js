#!/usr/bin/env node
// bin/cli.js

const { createProject } = require("../src/index");

// Run the CLI
createProject().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
