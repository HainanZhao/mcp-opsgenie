#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { OpsgenieClient } from './opsgenie.js';
import { log, error } from './logger.js';
import 'dotenv/config';

interface ServerArgs {
  apiKey?: string;
}

class OpsgeneMCPServer {
  private server: Server;
  private opsgenieClient: OpsgenieClient;

  constructor(args: ServerArgs = {}) {
    this.server = new Server(
      {
        name: 'opsgenie-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.opsgenieClient = new OpsgenieClient(args.apiKey);
    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'create_alert',
            description: 'Create a new alert in Opsgenie',
            inputSchema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Alert message (required)',
                },
                alias: {
                  type: 'string',
                  description: 'Client-defined identifier for the alert',
                },
                description: {
                  type: 'string',
                  description: 'Description field of the alert',
                },
                teams: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' }
                    }
                  },
                  description: 'Teams that the alert will be routed to',
                },
                tags: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Tags to be attached to the alert',
                },
                details: {
                  type: 'object',
                  description: 'Additional details as key-value pairs',
                },
                entity: {
                  type: 'string',
                  description: 'Entity field of the alert',
                },
                priority: {
                  type: 'string',
                  enum: ['P1', 'P2', 'P3', 'P4', 'P5'],
                  description: 'Priority level of the alert',
                },
              },
              required: ['message'],
            },
          },
          {
            name: 'list_alerts',
            description: 'List alerts from Opsgenie',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query to filter alerts',
                },
                limit: {
                  type: 'number',
                  description: 'Maximum number of alerts to return (default: 20)',
                  minimum: 1,
                  maximum: 100,
                },
                sort: {
                  type: 'string',
                  enum: ['createdAt', 'updatedAt', 'tinyId', 'alias', 'message', 'status', 'acknowledged', 'isSeen', 'snoozed', 'snoozedUntil', 'count', 'lastOccurredAt', 'source', 'owner', 'integration.name', 'integration.type', 'report.ackTime', 'report.closeTime', 'report.acknowledgedBy', 'report.closedBy'],
                  description: 'Field to sort the results by',
                },
                order: {
                  type: 'string',
                  enum: ['asc', 'desc'],
                  description: 'Sort order (default: desc)',
                },
                searchIdentifier: {
                  type: 'string',
                  description: 'Identifier to search for specific alert',
                },
                searchIdentifierType: {
                  type: 'string',
                  enum: ['id', 'tiny', 'alias'],
                  description: 'Type of the search identifier',
                },
              },
            },
          },
          {
            name: 'get_alert',
            description: 'Get details of a specific alert',
            inputSchema: {
              type: 'object',
              properties: {
                identifier: {
                  type: 'string',
                  description: 'Identifier of the alert',
                },
                identifierType: {
                  type: 'string',
                  enum: ['id', 'tiny', 'alias'],
                  description: 'Type of the identifier (default: id)',
                },
              },
              required: ['identifier'],
            },
          },
          {
            name: 'acknowledge_alert',
            description: 'Acknowledge an alert',
            inputSchema: {
              type: 'object',
              properties: {
                identifier: {
                  type: 'string',
                  description: 'Identifier of the alert to acknowledge',
                },
                identifierType: {
                  type: 'string',
                  enum: ['id', 'tiny', 'alias'],
                  description: 'Type of the identifier (default: id)',
                },
                note: {
                  type: 'string',
                  description: 'Additional note for the acknowledgment',
                },
                source: {
                  type: 'string',
                  description: 'Source of the action',
                },
                user: {
                  type: 'string',
                  description: 'User who is acknowledging the alert',
                },
              },
              required: ['identifier'],
            },
          },
          {
            name: 'close_alert',
            description: 'Close an alert',
            inputSchema: {
              type: 'object',
              properties: {
                identifier: {
                  type: 'string',
                  description: 'Identifier of the alert to close',
                },
                identifierType: {
                  type: 'string',
                  enum: ['id', 'tiny', 'alias'],
                  description: 'Type of the identifier (default: id)',
                },
                note: {
                  type: 'string',
                  description: 'Additional note for closing the alert',
                },
                source: {
                  type: 'string',
                  description: 'Source of the action',
                },
                user: {
                  type: 'string',
                  description: 'User who is closing the alert',
                },
              },
              required: ['identifier'],
            },
          },
          {
            name: 'snooze_alert',
            description: 'Snooze an alert for a specified time',
            inputSchema: {
              type: 'object',
              properties: {
                identifier: {
                  type: 'string',
                  description: 'Identifier of the alert to snooze',
                },
                identifierType: {
                  type: 'string',
                  enum: ['id', 'tiny', 'alias'],
                  description: 'Type of the identifier (default: id)',
                },
                endTime: {
                  type: 'string',
                  description: 'Date and time when snoozing will end (ISO 8601 format)',
                },
                note: {
                  type: 'string',
                  description: 'Additional note for snoozing',
                },
                source: {
                  type: 'string',
                  description: 'Source of the action',
                },
                user: {
                  type: 'string',
                  description: 'User who is snoozing the alert',
                },
              },
              required: ['identifier', 'endTime'],
            },
          },
          {
            name: 'unacknowledge_alert',
            description: 'Remove acknowledgment from an alert',
            inputSchema: {
              type: 'object',
              properties: {
                identifier: {
                  type: 'string',
                  description: 'Identifier of the alert to unacknowledge',
                },
                identifierType: {
                  type: 'string',
                  enum: ['id', 'tiny', 'alias'],
                  description: 'Type of the identifier (default: id)',
                },
                note: {
                  type: 'string',
                  description: 'Additional note for the unacknowledgment',
                },
                source: {
                  type: 'string',
                  description: 'Source of the action',
                },
                user: {
                  type: 'string',
                  description: 'User who is unacknowledging the alert',
                },
              },
              required: ['identifier'],
            },
          },
          {
            name: 'add_note_to_alert',
            description: 'Add a note to an alert',
            inputSchema: {
              type: 'object',
              properties: {
                identifier: {
                  type: 'string',
                  description: 'Identifier of the alert',
                },
                identifierType: {
                  type: 'string',
                  enum: ['id', 'tiny', 'alias'],
                  description: 'Type of the identifier (default: id)',
                },
                note: {
                  type: 'string',
                  description: 'Note content to add',
                },
                source: {
                  type: 'string',
                  description: 'Source of the action',
                },
                user: {
                  type: 'string',
                  description: 'User who is adding the note',
                },
              },
              required: ['identifier', 'note'],
            },
          },
        ] as Tool[],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'create_alert':
            return await this.handleCreateAlert(args);
          case 'list_alerts':
            return await this.handleListAlerts(args);
          case 'get_alert':
            return await this.handleGetAlert(args);
          case 'acknowledge_alert':
            return await this.handleAcknowledgeAlert(args);
          case 'close_alert':
            return await this.handleCloseAlert(args);
          case 'snooze_alert':
            return await this.handleSnoozeAlert(args);
          case 'unacknowledge_alert':
            return await this.handleUnacknowledgeAlert(args);
          case 'add_note_to_alert':
            return await this.handleAddNoteToAlert(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error: any) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private async handleCreateAlert(args: any) {
    const result = await this.opsgenieClient.createAlert(args);
    return {
      content: [
        {
          type: 'text',
          text: `Alert created successfully!\n\nAlert ID: ${result.alertId}\nRequest ID: ${result.requestId}\nResult: ${result.result}`,
        },
      ],
    };
  }

  private async handleListAlerts(args: any) {
    const result = await this.opsgenieClient.listAlerts(args);
    const alertsList = result.data.map((alert: any) => 
      `• ${alert.message} (ID: ${alert.id}, Status: ${alert.status}, Priority: ${alert.priority})`
    ).join('\n');
    
    return {
      content: [
        {
          type: 'text',
          text: `Found ${result.data.length} alerts:\n\n${alertsList}`,
        },
      ],
    };
  }

  private async handleGetAlert(args: any) {
    const result = await this.opsgenieClient.getAlert(args.identifier, args.identifierType);
    return {
      content: [
        {
          type: 'text',
          text: `Alert Details:\n\nMessage: ${result.data.message}\nStatus: ${result.data.status}\nPriority: ${result.data.priority}\nCreated: ${result.data.createdAt}\nUpdated: ${result.data.updatedAt}\nSource: ${result.data.source}\nOwner: ${result.data.owner || 'N/A'}\nTags: ${result.data.tags?.join(', ') || 'None'}\nTeams: ${result.data.teams?.map((t: any) => t.name).join(', ') || 'None'}`,
        },
      ],
    };
  }

  private async handleAcknowledgeAlert(args: any) {
    const result = await this.opsgenieClient.acknowledgeAlert(args.identifier, args.identifierType, args);
    return {
      content: [
        {
          type: 'text',
          text: `Alert acknowledged successfully!\n\nResult: ${result.result}\nRequest ID: ${result.requestId}`,
        },
      ],
    };
  }

  private async handleCloseAlert(args: any) {
    const result = await this.opsgenieClient.closeAlert(args.identifier, args.identifierType, args);
    return {
      content: [
        {
          type: 'text',
          text: `Alert closed successfully!\n\nResult: ${result.result}\nRequest ID: ${result.requestId}`,
        },
      ],
    };
  }

  private async handleSnoozeAlert(args: any) {
    const result = await this.opsgenieClient.snoozeAlert(args.identifier, args.identifierType, args);
    return {
      content: [
        {
          type: 'text',
          text: `Alert snoozed successfully!\n\nResult: ${result.result}\nRequest ID: ${result.requestId}\nSnooze until: ${args.endTime}`,
        },
      ],
    };
  }

  private async handleUnacknowledgeAlert(args: any) {
    const result = await this.opsgenieClient.unacknowledgeAlert(args.identifier, args.identifierType, args);
    return {
      content: [
        {
          type: 'text',
          text: `Alert unacknowledged successfully!\n\nResult: ${result.result}\nRequest ID: ${result.requestId}`,
        },
      ],
    };
  }

  private async handleAddNoteToAlert(args: any) {
    const result = await this.opsgenieClient.addNoteToAlert(args.identifier, args.identifierType, args);
    return {
      content: [
        {
          type: 'text',
          text: `Note added to alert successfully!\n\nResult: ${result.result}\nRequest ID: ${result.requestId}`,
        },
      ],
    };
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    log('Opsgenie MCP Server started');
  }
}

async function main(): Promise<void> {
  const apiKey = process.env.OPSGENIE_API_KEY;
  
  if (!apiKey) {
    error('OPSGENIE_API_KEY environment variable is required');
    process.exit(1);
  }

  const server = new OpsgeneMCPServer({ apiKey });
  await server.run();
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    console.error('Server error:', error);
    process.exit(1);
  });
}