import * as core from "@actions/core";
import { exec } from "@actions/exec";
import run, { ExecFunction } from "./scripts/dependency-update";

try {

  const stdExec: ExecFunction = (
    command: string,
    options?: { cwd: string }
  ): Promise<number> => exec(command, [], options);

  const wsDir: string = core.getInput("ws-dir") || process.env.WSDIR || "./";
  const branch: string = core.getInput("branch") || "main";
  
  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    throw new Error("GitHub token not found");
  }

  run(stdExec, branch, githubToken, wsDir);
  
} catch (error) {
  core.setFailed((error as Error).message);
}
