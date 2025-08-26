# Opsgenie MCP Server

A Model Context Protocol (MCP) server for integrating with Opsgenie's alert management system.

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

## Setup

### Prerequisites

- Node.js 18+ 
- Opsgenie API key

### Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd mcp-opsgenie
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.example .env
```

4. Edit `.env` file and add your Opsgenie API key:
```
OPSGENIE_API_KEY=your_actual_api_key_here
```

### Building

```bash
npm run build
```

### Running

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## Configuration

The server requires an Opsgenie API key which can be provided via:
- Environment variable: `OPSGENIE_API_KEY`
- Through the MCP client configuration

## MCP Client Configuration

Add this server to your MCP client configuration:

```json
{
  "mcpServers": {
    "opsgenie": {
      "command": "node",
      "args": ["/path/to/mcp-opsgenie/dist/index.js"],
      "env": {
        "OPSGENIE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## Usage Examples

### Creating an Alert
```json
{
  "tool": "create_alert",
  "arguments": {
    "message": "Database connection failed",
    "description": "Unable to connect to production database",
    "priority": "P1",
    "teams": [{"name": "Backend Team"}],
    "tags": ["database", "production", "critical"]
  }
}
```

### Listing Alerts
```json
{
  "tool": "list_alerts",
  "arguments": {
    "query": "status:open",
    "limit": 10,
    "sort": "createdAt",
    "order": "desc"
  }
}
```

### Acknowledging an Alert
```json
{
  "tool": "acknowledge_alert",
  "arguments": {
    "identifier": "alert-id-here",
    "note": "Investigating the issue",
    "user": "john.doe@company.com"
  }
}
```

## API Reference

### Alert Creation
- **message** (required): Alert message
- **alias**: Client-defined identifier
- **description**: Detailed description
- **teams**: Array of team objects with name field
- **tags**: Array of string tags
- **details**: Additional key-value details
- **entity**: Entity field
- **priority**: P1, P2, P3, P4, or P5

### Alert Management
- **identifier** (required): Alert ID, tiny ID, or alias
- **identifierType**: Type of identifier ('id', 'tiny', 'alias')
- **note**: Additional note for actions
- **source**: Source of the action
- **user**: User performing the action

## Error Handling

The server provides detailed error messages for:
- Authentication failures
- Invalid parameters
- Network connectivity issues
- Opsgenie API errors

## Development

### Project Structure
```
src/
├── index.ts       # Main MCP server
├── opsgenie.ts    # Opsgenie client wrapper
└── logger.ts      # Logging utilities
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.