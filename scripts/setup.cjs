#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('Setting up MCP Opsgenie Server...\n');

// Check if .env exists
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('✅ Created .env file from .env.example');
  } else {
    // Create a basic .env file
    const envContent = `# Opsgenie API Configuration
OPSGENIE_API_KEY=your_opsgenie_api_key_here

# Debug logging (optional)
DEBUG=false
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file');
  }
  
  console.log('\n🔧 Next steps:');
  console.log('1. Edit .env and add your actual OPSGENIE_API_KEY');
  console.log('2. Get your API key from: https://support.atlassian.com/opsgenie/docs/create-a-default-api-integration/');
  console.log('3. Run "npm test" to validate your setup');
} else {
  console.log('✅ .env file already exists');
}

console.log('\n📖 Quick start:');
console.log('  npm test       # Test your setup');
console.log('  npm run dev    # Start development server');
console.log('  npm start      # Start production server');
console.log('\nFor more information, see README.md');