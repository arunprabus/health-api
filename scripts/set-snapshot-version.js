// set-snapshot-version.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packagePath = path.join(__dirname, '..', 'package.json');

// Read the package.json
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Get current version without -SNAPSHOT suffix if it exists
let version = packageJson.version.replace(/-SNAPSHOT$/, '');

// Split version into components
const [major, minor, patch] = version.split('.').map(Number);

// Get the release type from arguments or default to 'minor'
let releaseType = 'minor';
if (process.argv.length > 2) {
  releaseType = process.argv[2];
}

// Calculate next version based on release type
let nextVersion;
switch (releaseType) {
  case 'major':
    nextVersion = `${major + 1}.0.0-SNAPSHOT`;
    break;
  case 'minor':
    nextVersion = `${major}.${minor + 1}.0-SNAPSHOT`;
    break;
  case 'patch':
    nextVersion = `${major}.${minor}.${patch + 1}-SNAPSHOT`;
    break;
  default:
    nextVersion = `${major}.${minor + 1}.0-SNAPSHOT`;
}

// Update package.json
packageJson.version = nextVersion;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`Version updated to ${nextVersion}`);

// Try to get current branch name
try {
  const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  console.log(`Current branch: ${branchName}`);
  
  if (branchName === 'main') {
    console.log('On main branch - remember to create a new feature branch for development');
    console.log('Example: npm run feature my-new-feature');
  }
} catch (error) {
  console.log('Could not determine current branch');
}