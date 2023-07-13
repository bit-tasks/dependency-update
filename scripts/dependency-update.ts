import { context, getOctokit } from "@actions/github";
export type ExecFunction = (command: string, options?: {cwd: string}) => Promise<number>;

const run: (exec: ExecFunction, branch: string, githubToken: string, wsdir: string) => Promise<void> = async (exec, branch, githubToken, wsdir) => {

  const octokit = getOctokit(githubToken);
  const { owner, repo } = context.repo;

  const branchName = "bit-dependency-update";
  const commitMessage = "Update Bit envs and outdated (direct) external dependencies, as well as the workspace components using them."; // Commit message
  const prTitle = "Update bit dependencies";
  const prBody = "This PR updates the bit dependencies.";

  await exec('bit update -y', { cwd: wsdir });
  await exec('bit envs update"', { cwd: wsdir });

  const statusOutput = await exec('git status --porcelain', { cwd: wsdir });
  
 // if (statusOutput) {
    await exec(`git checkout -b ${branchName}`, { cwd: wsdir });
    await exec('git add .', { cwd: wsdir });
    await exec(`git commit -m "${commitMessage}"`, { cwd: wsdir });
    await exec(`git push origin ${branchName}`, { cwd: wsdir });
    
    await octokit.rest.pulls.create({
      owner: owner,
      repo: repo,
      title: prTitle,
      head: branchName,
      body: prBody,
      base: branch
    });
  //}
}

export default run;
