# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-26

### Added

- Initial release of MCP Opsgenie Server
- Complete Opsgenie API integration with 8 tools:
  - `opsgenie_create_alert`: Create new alerts
  - `opsgenie_list_alerts`: List and search alerts with filtering
  - `opsgenie_get_alert`: Get detailed alert information
  - `opsgenie_acknowledge_alert`: Acknowledge alerts
  - `opsgenie_close_alert`: Close resolved alerts
  - `opsgenie_snooze_alert`: Snooze alerts for specified time periods
  - `opsgenie_unacknowledge_alert`: Remove acknowledgment from alerts
  - `opsgenie_add_note_to_alert`: Add notes to existing alerts
- Model Context Protocol (MCP) server implementation
- TypeScript support with full type definitions
- Environment-based configuration with `.env` support
- Comprehensive error handling and logging
- Docker support for containerized deployment
- Integration with Claude Desktop and other MCP clients

### Developer Features

- TypeScript development environment
- Automated build and test workflows
- Development server with auto-reload
- Comprehensive API documentation
- Example usage and configuration guides
