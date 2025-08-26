#!/usr/bin/env node

// Simple test script to verify the Opsgenie client works
import { OpsgenieClient } from './src/opsgenie.js';
import 'dotenv/config';

async function testOpsgenieClient() {
  try {
    console.log('Testing Opsgenie MCP Server...');
    
    // Test client initialization
    const apiKey = process.env.OPSGENIE_API_KEY;
    if (!apiKey) {
      console.log('⚠️  OPSGENIE_API_KEY not set. Please create a .env file with your API key.');
      console.log('   Copy .env.example to .env and add your API key.');
      return;
    }
    
    const client = new OpsgenieClient(apiKey);
    console.log('✅ Opsgenie client initialized successfully');
    
    // Test list alerts (read-only operation)
    console.log('\n🔍 Testing list alerts...');
    const alerts = await client.listAlerts({ limit: 5 });
    console.log(`✅ Successfully listed ${alerts.data?.length || 0} alerts`);
    
    console.log('\n🎉 All tests passed! The MCP server is ready to use.');
    console.log('\nTo start the MCP server, run: npm start');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\nPlease check:');
    console.log('1. Your OPSGENIE_API_KEY is correct');
    console.log('2. You have network connectivity to api.opsgenie.com');
    console.log('3. Your API key has the necessary permissions');
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  testOpsgenieClient();
}