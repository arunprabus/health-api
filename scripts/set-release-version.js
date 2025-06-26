// set-release-version.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packagePath = path.join(__dirname, '..', 'package.json');

// Read the package.json
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Get current version without -SNAPSHOT suffix
const version = packageJson.version.replace(/-SNAPSHOT$/, '');

// Update package.json with release version (no -SNAPSHOT suffix)
packageJson.version = version;
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`Version set to release: ${version}`);