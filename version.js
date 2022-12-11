const gitCommitId = require('git-commit-id');
const fs=require("fs");
const commit = gitCommitId();
if (commit) {
    fs.writeFileSync('./client/dist/version.txt', commit);
} else {
    const version = `var version = '';`;
    fs.writeFileSync('./client/dist/version.txt', commit);
}