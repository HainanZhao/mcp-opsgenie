# Opsgenie MCP Server

A Model Context Protocol (MCP) server for integrating with Opsgenie's alert management system. This server allows you to manage Opsgenie alerts through any MCP-compatible client like Claude Desktop.

## Features

This MCP server provides comprehensive Opsgenie integration with the following tools:

- **create_alert**: Create new alerts in Opsgenie
- **list_alerts**: List and search alerts with filtering options
- **get_alert**: Get detailed information about a specific alert
- **acknowledge_alert**: Acknowledge alerts
- **close_alert**: Close resolved alerts
- **snooze_alert**: Snooze alerts for a specified time period
- **unacknowledge_alert**: Remove acknowledgment from alerts
- **add_note_to_alert**: Add notes to existing alerts

## Quick Start

### Prerequisites

- Node.js 18+
- Opsgenie API key ([Get one here](https://support.atlassian.com/opsgenie/docs/create-a-default-api-integration/))

### Installation

1. **Download or clone this server:**
```bash
git clone https://github.com/HainanZhao/mcp-opsgenie.git
cd mcp-opsgenie
```

2. **Set up the project:**
```bash
npm run setup
```

3. **Configure your API key:**
```bash
# Edit .env and add your OPSGENIE_API_KEY
```

4. **Test your setup:**
```bash
npm test
```

## Available Commands

```bash
npm run setup      # Install dependencies, build, and create .env
npm run build      # Build TypeScript to JavaScript
npm run dev        # Start development server with auto-reload
npm test           # Run tests to validate setup
npm start          # Start the MCP server
npm run clean      # Remove build artifacts
```

## Configuration

### Environment Variables

Create a `.env` file with your Opsgenie API key:

```env
OPSGENIE_API_KEY=your_opsgenie_api_key_here
```

### MCP Client Configuration

Add this server to your MCP client configuration. For Claude Desktop, add to your config file:

```json
{
  "mcpServers": {
    "opsgenie": {
      "command": "/path/to/mcp-opsgenie/dist/index.js",
      "env": {
        "OPSGENIE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**Alternative using npm/npx (if installed globally):**
```json
{
  "mcpServers": {
    "opsgenie": {
      "command": "npx",
      "args": ["mcp-opsgenie"],
      "env": {
        "OPSGENIE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

**Claude Desktop config locations:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

## Usage Examples

### Creating an Alert

Ask your MCP client to create an alert:

> "Create a P1 alert in Opsgenie with message 'Database connection failed' for the Backend Team"

Or provide specific details:
- **Message**: "Database connection failed"
- **Priority**: P1 (Critical)
- **Teams**: Backend Team
- **Tags**: database, production, critical
- **Description**: Detailed problem description

### Managing Alerts

- **List alerts**: "Show me all open P1 alerts"
- **Get alert details**: "Get details for alert ID abc123"
- **Acknowledge**: "Acknowledge alert abc123 with note 'Investigating'"
- **Close alert**: "Close alert abc123 with note 'Issue resolved'"
- **Snooze**: "Snooze alert abc123 until 2024-12-25 10:00 AM"

### Searching Alerts

Use Opsgenie's powerful query syntax:
- "List alerts with status open and priority P1"
- "Show me alerts tagged with 'database' from the last 24 hours"
- "Find all unacknowledged alerts for the Backend Team"

## API Reference

### Alert Priorities

- **P1**: Critical - Immediate action required
- **P2**: High - Quick response needed  
- **P3**: Medium - Normal priority (default)
- **P4**: Low - Can be addressed during business hours
- **P5**: Informational - For awareness

### Search Query Examples

- `status:open` - Open alerts only
- `priority:P1` - P1 priority alerts
- `tag:production` - Alerts with "production" tag
- `team:"Backend Team"` - Alerts for specific team
- `createdAt>"2024-01-01"` - Alerts after a date
- `status:open AND priority:P1` - Combine conditions

## Troubleshooting

### Common Issues

**"Authentication failed"**
- Verify your API key is correct in the `.env` file
- Ensure the API key has necessary permissions in Opsgenie

**"Cannot find module"**
- Run `npm install` to install dependencies
- Make sure you've run `npm run build` to compile TypeScript

**"No alerts found"**
- Check if you have alerts in your Opsgenie account
- Verify your search query syntax
- Try listing without filters first

### Getting Help

- Check the [examples documentation](EXAMPLES.md) for detailed usage patterns
- Review your Opsgenie API permissions
- Ensure network connectivity to `api.opsgenie.com`

## What You Can Do

With this MCP server, you can:

✅ **Create alerts** with full customization (priority, teams, tags, etc.)  
✅ **Search and filter** alerts using Opsgenie's query language  
✅ **Manage alert lifecycle** (acknowledge, close, snooze)  
✅ **Add notes** and collaborate on incident resolution  
✅ **Integrate** with any MCP-compatible AI assistant  
✅ **Automate** alert management through natural language  

## Security Notes

- Keep your API key secure and never commit it to version control
- Use environment variables for configuration
- Consider using API keys with minimal required permissions
- The server only makes outbound connections to Opsgenie's API

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and contribution guidelines.

## License

MIT License - see LICENSE file for details.