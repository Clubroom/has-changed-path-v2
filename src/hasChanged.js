const exec = require("@actions/exec");

async function main(pathsToSearch = "") {
  throwsForInvalidPaths(pathsToSearch);

  return hasChanged(pathsToSearch);
}

function throwsForInvalidPaths(pathsToSearch) {
  if (pathsToSearch && typeof pathsToSearch === "string") return;
  throw new Error("pathsToSearch needs to be a string");
}

function getCWD() {
  const { GITHUB_WORKSPACE = ".", SOURCE = "." } = process.env;
  return `${GITHUB_WORKSPACE}/${SOURCE}`;
}

async function hasChanged(pathsToSearch) {
  const paths = pathsToSearch.split(" ");

  //  --quiet: exits with 1 if there were differences (https://git-scm.com/docs/git-diff)

  await exec.exec("git", ["fetch", "origin", "master"], {
    ignoreReturnCode: true,
    silent: false,
    cwd: getCWD(),
  });
  const exitCode = await exec.exec(
    "git",
    ["diff", "--quiet", "FETCH_HEAD...HEAD", "--", ...paths],
    {
      ignoreReturnCode: true,
      silent: false,
      cwd: getCWD(),
    }
  );

  const pathsChanged = exitCode === 1;

  return pathsChanged;
}

module.exports = main;
