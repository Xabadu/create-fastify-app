#! /usr/bin/env node

const { spawn } = require("child_process");
const ora = require("ora");

const TEMPLATE_URL = "https://github.com/Xabadu/fastify-app-starter-template";
const appName = process.argv[2];

const setupApp = async () => {
  const spinner = ora();
  if (appName != null) {
    const workingDirectory = `${process.cwd()}/${appName}`;
    spinner.text = "📦 Cloning repo from GitHub\n";
    spinner.start();

    await run("git", ["clone", TEMPLATE_URL, appName]);
    await run("rm", ["-rf", `${appName}/.git`]);

    spinner.text = "🛠  Installing dependencies\n";
    await run("npm", ["install"], { cwd: workingDirectory });

    spinner.text = "⚙️  Setting up repo\n";
    await run("git", ["init"], { cwd: workingDirectory });
    await run("git", ["add", "."], { cwd: workingDirectory });
    await run("git", ["commit", "-m", "Initial commit"], {
      cwd: workingDirectory,
    });
    await run("git", ["branch", "-m", "main"], {
      cwd: workingDirectory,
    });

    spinner.succeed("🔥 All tasks completed\n");
    console.log("To get started: ");
    console.log(`1. cd ${appName}`);
    console.log("2. npm run dev");
    console.log("3. Build ✌️");
  } else {
    spinner.fail("Error - No app name passed as an argument\n");
    spinner.info("Usage: create-fastify-app app-name");
  }
};

const run = (command, args, opts) => {
  const task = spawn(command, args, opts);

  return new Promise((resolve) => {
    task.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    task.stderr.on("data", (data) => {
      console.log(data.toString());
    });

    task.on("close", () => {
      resolve();
    });
  });
};

setupApp();
