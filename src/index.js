// src/index.js
const fs = require("fs-extra");
const path = require("path");
const inquirer = require("inquirer");
const chalk = require("chalk");
const ora = require("ora");

async function createProject() {
  // Ask for project name
  const { projectName } = await inquirer.prompt([
    {
      type: "input",
      name: "projectName",
      message: "What is the name of your project?",
      validate: (input) => {
        if (/^([a-z\-\_\d])+$/.test(input)) return true;
        return "Project name may only include lowercase letters, numbers, underscores and hashes.";
      },
    },
  ]);

  const targetDir = path.join(process.cwd(), projectName);

  // Check if directory already exists
  if (fs.existsSync(targetDir)) {
    const { overwrite } = await inquirer.prompt({
      type: "confirm",
      name: "overwrite",
      message: `Directory ${projectName} already exists. Overwrite?`,
      default: false,
    });

    if (!overwrite) {
      console.log(chalk.red("Operation cancelled"));
      return;
    }

    fs.removeSync(targetDir);
  }

  // Copy template files
  const spinner = ora("Creating project...").start();
  try {
    // Define template directory (included in the package)
    const templateDir = path.resolve(__dirname, "../template");

    // Copy template to target directory
    fs.copySync(templateDir, targetDir);

    // Update package.json with new project name
    const packageJsonPath = path.join(targetDir, "package.json");
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
    packageJson.name = projectName;
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    spinner.succeed(
      `Project ${chalk.green(projectName)} created successfully!`
    );

    console.log("\nNext steps:");
    console.log(`  cd ${projectName}`);
    console.log("  npm install");
    console.log("  npm run dev");
  } catch (error) {
    spinner.fail("Failed to create project");
    console.error(chalk.red(error));
  }
}

module.exports = { createProject };
