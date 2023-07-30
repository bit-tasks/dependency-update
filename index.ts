import * as core from "@actions/core";
import run from "./scripts/dependency-update";

try {
  const wsDir: string = core.getInput("ws-dir") || process.env.WSDIR || "./";
  const branch: string = core.getInput("branch") || "main";
  const allow = core.getInput('allow').split(',');

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    throw new Error("GitHub token not found");
  }
  const gitUserName = process.env.GIT_USER_NAME;
  if (!gitUserName) {
    throw new Error("Git user name not found");
  }

  const gitUserEmail = process.env.GIT_USER_EMAIL;
  if (!gitUserEmail) {
    throw new Error("Git user email token not found");
  }

  run(branch, githubToken, gitUserName, gitUserEmail, wsDir, allow);
} catch (error) {
  core.setFailed((error as Error).message);
}
