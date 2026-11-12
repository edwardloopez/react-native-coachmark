import { execSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';

const { name, version } = JSON.parse(readFileSync('package.json', 'utf8'));
const tag = `v${version}`;

const tagExists =
  execSync(`git tag -l "${tag}"`, { encoding: 'utf8' }).trim() === tag;

let created = false;
if (tagExists) {
  console.log(`Tag ${tag} already exists, skipping create`);
} else {
  execSync(`git tag "${tag}"`, { stdio: 'inherit' });
  console.log(`Created tag ${tag}`);
  created = true;
}

if (created && process.env.CHANGESETS_OUTPUT) {
  appendFileSync(
    process.env.CHANGESETS_OUTPUT,
    `${JSON.stringify({ type: 'git-tag', tag, packageName: name })}\n`
  );
  console.log(`Recorded ${tag} in CHANGESETS_OUTPUT`);
}

if (process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true') {
  try {
    execSync(`git push origin "${tag}"`, { stdio: 'inherit' });
    console.log(`Pushed tag ${tag}`);
  } catch (error) {
    console.warn(`Could not push tag ${tag}:`, error.message ?? error);
  }
}
