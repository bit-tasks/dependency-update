import { context, getOctokit } from '@actions/github';
import { exec, getExecOutput } from '@actions/exec';

const extractDependencyChanges = (output: string) => {
  const depSection = output.split('dependencies:')[1]?.split('✔')[0];
  if (!depSection) return '';
  return depSection
    .split('\n')
    .filter(line => line.trim().startsWith('-') || line.trim().startsWith('+'))
    .join('\n');
};

const extractUpdatedEnvs = (output: string) => {
  const match = output.match(/the following component\(s\) env has been successfully updated:[\s\S]+?(?=please run|$)/);
  return match ? match[0].trim() : '';
};

const run = async (
  branch: string,
  githubToken: string,
  gitUserName: string,
  gitUserEmail: string,
  wsdir: string,
  allow: string[],
  versionUpdatePolicy: string,
  packagePatterns: string,
  componentPatterns: string,
  envPatterns: string
) => {
  const octokit = getOctokit(githubToken);
  const { owner, repo } = context.repo;

  const branchName = 'bit-dependency-update';
  const commitMessage =
    'Update Bit envs, outdated (direct) external dependencies, and workspace components according to the defined CI task parameter --allow';
  const prTitle = 'Update bit dependencies';
  const prBody = 'This PR updates the bit dependencies.';


  let updateResult, envsUpdateResult;
  let dependencyChanges = '', updatedEnvs = '';

  if (allow.includes('all') || allow.includes('workspace-components')) {
    await exec(`bit checkout head --all "${componentPatterns}"`, [], { cwd: wsdir });
  }
  if (allow.includes('all') || allow.includes('envs')) {
    envsUpdateResult = await getExecOutput(`bit envs update "${envPatterns}"`, [], {
      cwd: wsdir,
      env: {
        ...process.env,
        BIT_DISABLE_SPINNER: "false",
      }
    });
    updatedEnvs = extractUpdatedEnvs(envsUpdateResult.stdout);
  }
  if (allow.includes('all') || allow.includes('external-dependencies')) {
    const semverOption = versionUpdatePolicy ? `--${versionUpdatePolicy}` : '';
    updateResult = await getExecOutput(`bit update -y ${semverOption} "${packagePatterns}"`, [], {
      cwd: wsdir,
      env: {
        ...process.env,
        BIT_DISABLE_SPINNER: "false",
      }
    });
    dependencyChanges = extractDependencyChanges(updateResult.stdout);
  }

  let statusOutput = '';

  const options = {
    listeners: {
      stdout: (data: any) => {
        statusOutput += data.toString();
      },
    },
    cwd: wsdir,
  };

  await exec('git status --porcelain', [], options);

  if (statusOutput) {
    await exec(`git config --global user.name "${gitUserName}"`, [], {
      cwd: wsdir,
    });
    await exec(`git config --global user.email "${gitUserEmail}"`, [], {
      cwd: wsdir,
    });
    await exec(`git checkout -b ${branchName}`, [], { cwd: wsdir });
    await exec('git add .', [], { cwd: wsdir });
    await exec(`git commit -m "${commitMessage}"`, [], { cwd: wsdir });
    await exec(`git push origin ${branchName} --force`, [], { cwd: wsdir });

    const prBody = `This PR updates the bit dependencies.\n\n` +
      (dependencyChanges ? `## Dependency Changes\n\n\`\`\`\n${dependencyChanges}\`\`\`\n\n` : '') +
      (updatedEnvs ? `## Updated Envs\n\n\`\`\`\n${updatedEnvs}\`\`\`\n` : '');

    try {
      await octokit.rest.pulls.create({
        owner: owner,
        repo: repo,
        title: prTitle,
        head: branchName,
        body: prBody,
        base: branch,
      });
    } catch (error: any) {
      if (error.status === 422) {
        console.log(`A pull request already exists for ${branchName}.`);
      } else {
        // If the error is anything other than a PR already existing, rethrow it
        throw error;
      }
    }
  }
};

export default run;
