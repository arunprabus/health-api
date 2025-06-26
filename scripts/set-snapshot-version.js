// set-snapshot-version.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packagePath = path.join(__dirname, '..', 'package.json');

// Read the package.json
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Get current version without -SNAPSHOT suffix if it exists
let version = packageJson.version.replace(/-SNAPSHOT$/, '');

// Split version into components
const [major, minor, patch] = version.split('.').map(Number);

// Increment the minor version and reset patch to 0 for next development cycle
const nextVersion = `${major}.${minor + 1}.0-SNAPSHOT`;

// Update package.json
packageJson.version = nextVersion;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`Version updated to ${nextVersion}`);