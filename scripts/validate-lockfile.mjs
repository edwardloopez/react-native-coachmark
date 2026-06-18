#!/usr/bin/env node
/**
 * Validates pnpm-lock.yaml for exotic dependency sources.
 * pnpm is resistant to lockfile injection, but this adds an explicit CI guard.
 * @see https://github.com/lirantal/npm-security-best-practices#5-prevent-npm-lockfile-injection
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const lockfilePath = resolve(process.cwd(), 'pnpm-lock.yaml');
const lockfile = readFileSync(lockfilePath, 'utf8');

const exoticPatterns = [
  { name: 'git+ protocol', pattern: /git\+/ },
  { name: 'git:// protocol', pattern: /git:\/\// },
  { name: 'GitHub shorthand', pattern: /github:[^\s]+/ },
  { name: 'Bitbucket shorthand', pattern: /bitbucket:[^\s]+/ },
  { name: 'GitLab shorthand', pattern: /gitlab:[^\s]+/ },
];

const violations = exoticPatterns
  .map(({ name, pattern }) => {
    const matches = lockfile.match(pattern);
    return matches ? { name, count: matches.length } : null;
  })
  .filter(Boolean);

if (violations.length > 0) {
  console.error('Lockfile security check failed. Exotic dependency sources found:');
  for (const { name, count } of violations) {
    console.error(`  - ${name}: ${count} occurrence(s)`);
  }
  process.exit(1);
}

console.log('Lockfile security check passed.');
