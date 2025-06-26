// create-feature-branch.js
import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get feature name from command line or prompt
if (process.argv.length > 2) {
  createFeatureBranch(process.argv[2]);
} else {
  rl.question('Enter feature name (without fet- prefix): ', (featureName) => {
    createFeatureBranch(featureName);
    rl.close();
  });
}

function createFeatureBranch(featureName) {
  try {
    // Clean feature name (replace spaces with dashes, lowercase)
    const cleanName = featureName.trim().toLowerCase().replace(/\s+/g, '-');
    const branchName = `fet-${cleanName}`;
    
    // Make sure we're up to date with main
    console.log('Fetching latest changes from main...');
    execSync('git fetch origin main', { stdio: 'inherit' });
    
    // Create and checkout new branch
    console.log(`Creating feature branch: ${branchName}`);
    execSync(`git checkout -b ${branchName} origin/main`, { stdio: 'inherit' });
    
    console.log(`\nFeature branch ${branchName} created successfully!`);
    console.log('\nNext steps:');
    console.log('1. Make your changes');
    console.log('2. When ready to create a PR, create a pull request to main');
    console.log('3. The PR workflow will automatically update the version');
  } catch (error) {
    console.error('Error creating feature branch:', error.message);
    process.exit(1);
  }
}