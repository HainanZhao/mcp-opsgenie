# JSON-RPC Testing

Simple approach to test your MCP server with JSON-RPC requests.

## Quick Test

1. **Start debug server**: `npx tsx --inspect=9229 src/index.ts`
2. **Copy/paste** the JSON into your debug server terminal
3. **Press Enter** to send the request

## Test JSON Snippets

### List Tools:
```json
{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}
```
