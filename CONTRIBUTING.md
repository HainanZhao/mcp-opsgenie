# Contributing to MCP Opsgenie Server

Thank you for your interest in contributing to the MCP Opsgenie Server! This guide will help you get started with development.

## Development Setup

### Prerequisites

- Node.js 18+ 
- Git
- Opsgenie API key (for testing)

### Getting Started

1. **Clone the repository:**
```bash
git clone <repository-url>
cd mcp-opsgenie
```

2. **Install dependencies:**
```bash
npm run setup
```

3. **Set up environment:**
```bash
# .env file is created automatically by npm run setup
# Edit .env and add your OPSGENIE_API_KEY
```

4. **Build and test:**
```bash
npm run build
npm test
```

## Project Structure

```
src/
├── index.ts       # Main MCP server implementation
├── opsgenie.ts    # Opsgenie client wrapper with API methods
├── logger.ts      # Logging utilities
└── types/         # TypeScript type definitions
    └── opsgenie-sdk.d.ts  # Custom types for opsgenie-sdk

dist/              # Compiled JavaScript output
test.js           # Test script for API validation
```

## Development Workflow

### Building

```bash
npm run build     # Compile TypeScript
```

### Running in Development

```bash
npm run dev      # Start with auto-reload using tsx
```

### Testing

```bash
npm test         # Build and run tests
```

The test script validates:
- Opsgenie client initialization
- API connectivity
- Basic list alerts functionality

### Git Workflow

Use standard git commands:

```bash
git status              # Check status
git add .               # Stage all changes
git commit -m "message" # Commit with message
git push origin main    # Push to remote
```

## Code Structure

### MCP Server (`src/index.ts`)

The main server implements the Model Context Protocol with:
- Tool registration and schema definitions
- Request handlers for each Opsgenie operation
- Error handling and response formatting
- Server lifecycle management

### Opsgenie Client (`src/opsgenie.ts`)

Wrapper around the opsgenie-sdk providing:
- Promise-based API instead of callbacks
- Enhanced error handling
- TypeScript type safety
- Consistent parameter validation

### Type Definitions (`src/types/opsgenie-sdk.d.ts`)

Custom TypeScript definitions for opsgenie-sdk since it doesn't include types:
- Interface definitions for all API methods
- Parameter type definitions
- Callback type definitions

## Adding New Features

### Adding a New Opsgenie Tool

1. **Add the method to OpsgenieClient** (`src/opsgenie.ts`):
```typescript
async newMethod(params: NewMethodParams): Promise<any> {
  return new Promise((resolve, reject) => {
    opsgenie.someApi.newMethod(params, (err, result) => {
      if (err) {
        error('Opsgenie New Method Error:', err);
        return reject(new Error(`Failed to execute new method: ${err.message}`));
      }
      log('Opsgenie New Method Success:', result);
      resolve(result);
    });
  });
}
```

2. **Add tool definition** in `src/index.ts` to the tools array:
```typescript
{
  name: 'new_method',
  description: 'Description of what this method does',
  inputSchema: {
    type: 'object',
    properties: {
      // Define your parameters here
    },
    required: ['required_param'],
  },
}
```

3. **Add handler** in the CallToolRequestSchema handler:
```typescript
case 'new_method':
  return await this.handleNewMethod(args);
```

4. **Implement the handler method**:
```typescript
private async handleNewMethod(args: any) {
  const result = await this.opsgenieClient.newMethod(args);
  return {
    content: [
      {
        type: 'text',
        text: `Operation successful: ${result.message}`,
      },
    ],
  };
}
```

### Adding Type Definitions

If you're using new opsgenie-sdk methods, add them to `src/types/opsgenie-sdk.d.ts`:

```typescript
interface SomeApi {
  newMethod(params: NewMethodParams, callback: (err: any, result: any) => void): void;
}

export const someApi: SomeApi;
```

## Testing Guidelines

### Manual Testing

1. **API Connectivity:**
```bash
make test
```

2. **Individual Tools:**
Create test scripts that exercise specific tools with your API key.

3. **MCP Integration:**
Test with an MCP client like Claude Desktop or other MCP-compatible applications.

### Adding Tests

When adding new features:
1. Add validation to the test script
2. Test error conditions
3. Verify parameter validation
4. Test with real Opsgenie API (with caution)

## Code Style

- Use TypeScript strict mode
- Follow existing naming conventions
- Add proper error handling for all API calls
- Include descriptive comments for complex logic
- Use meaningful variable and function names

## Error Handling

- Always wrap opsgenie-sdk calls in try-catch or promise rejection handling
- Provide meaningful error messages to users
- Log errors with context for debugging
- Don't expose internal API details in user-facing errors

## Documentation

When adding features:
1. Update tool descriptions in the MCP server
2. Add examples to EXAMPLES.md
3. Update README.md if it affects user-facing functionality
4. Document any new environment variables or configuration

## Performance Considerations

- The opsgenie-sdk uses callbacks; always promisify them
- Consider rate limiting for bulk operations
- Log performance metrics for slow operations
- Cache results when appropriate

## Security

- Never log API keys or sensitive data
- Validate all user inputs
- Use environment variables for configuration
- Follow least-privilege principles for API permissions

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md (if it exists)
3. Test thoroughly
4. Create a git tag
5. Build and test the distribution

## Getting Help

- Check existing issues and documentation
- Look at the opsgenie-sdk documentation
- Review MCP protocol specifications
- Check Opsgenie API documentation for new features

## License

This project is licensed under the MIT License - see the LICENSE file for details.