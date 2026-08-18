// Quick diagnostic script to check environment variables
// Run with: node apps/game/check-env.js

require('dotenv').config({ path: require('path').join(__dirname, '..', '..', '.env') });
require('dotenv').config();

console.log('\n=== Environment Variable Check ===\n');

const vars = [
  'DATABASE_URL',
  'API_URL',
  'HISCORES_UPDATE_SECRET',
  'GAME_SERVER_SECRET',
  'SERVER_ID',
  'NODE_ENV'
];

let allGood = true;

for (const varName of vars) {
  const value = process.env[varName];
  if (value) {
    // Mask secrets
    if (varName.includes('SECRET') || varName.includes('URL')) {
      const masked = value.substring(0, 8) + '...' + value.substring(value.length - 4);
      console.log(`✓ ${varName}: ${masked}`);
    } else {
      console.log(`✓ ${varName}: ${value}`);
    }
  } else {
    console.log(`✗ ${varName}: NOT SET`);
    allGood = false;
  }
}

console.log('\n' + (allGood ? '✓ All required variables are set!' : '✗ Some variables are missing!'));
console.log('\nIf variables are missing, run: .\\setup-env.ps1\n');
