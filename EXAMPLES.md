# Example usage of the Opsgenie MCP Server tools

## 1. Create Alert
Create a new alert in Opsgenie with various parameters:

```json
{
  "tool": "create_alert",
  "arguments": {
    "message": "High CPU usage detected on server-01",
    "description": "CPU usage has been above 90% for the last 10 minutes on production server server-01",
    "priority": "P2",
    "alias": "cpu-high-server01-2024",
    "teams": [
      {"name": "Infrastructure Team"},
      {"name": "DevOps"}
    ],
    "tags": ["cpu", "performance", "server-01", "production"],
    "details": {
      "server": "server-01",
      "cpu_usage": "92%",
      "memory_usage": "78%",
      "environment": "production"
    },
    "entity": "server-01"
  }
}
```

## 2. List Alerts
List alerts with filtering options:

```json
{
  "tool": "list_alerts",
  "arguments": {
    "query": "status:open AND priority:P1",
    "limit": 10,
    "sort": "createdAt",
    "order": "desc"
  }
}
```

## 3. Get Alert Details
Get detailed information about a specific alert:

```json
{
  "tool": "get_alert",
  "arguments": {
    "identifier": "123e4567-e89b-12d3-a456-426614174000",
    "identifierType": "id"
  }
}
```

## 4. Acknowledge Alert
Acknowledge an alert with a note:

```json
{
  "tool": "acknowledge_alert",
  "arguments": {
    "identifier": "cpu-high-server01-2024",
    "identifierType": "alias",
    "note": "Investigating the CPU spike. Checking for runaway processes.",
    "user": "engineer@company.com"
  }
}
```

## 5. Close Alert
Close a resolved alert:

```json
{
  "tool": "close_alert",
  "arguments": {
    "identifier": "cpu-high-server01-2024",
    "identifierType": "alias",
    "note": "Issue resolved. Restarted the problematic service.",
    "user": "engineer@company.com"
  }
}
```

## 6. Snooze Alert
Snooze an alert for a specific time:

```json
{
  "tool": "snooze_alert",
  "arguments": {
    "identifier": "cpu-high-server01-2024",
    "identifierType": "alias",
    "endTime": "2024-12-25T10:00:00Z",
    "note": "Snoozing during maintenance window",
    "user": "engineer@company.com"
  }
}
```

## 7. Add Note to Alert
Add additional information to an alert:

```json
{
  "tool": "add_note_to_alert",
  "arguments": {
    "identifier": "cpu-high-server01-2024",
    "identifierType": "alias",
    "note": "Update: Found the root cause - memory leak in application XYZ. Working on fix.",
    "user": "engineer@company.com"
  }
}
```

## 8. Unacknowledge Alert
Remove acknowledgment from an alert:

```json
{
  "tool": "unacknowledge_alert",
  "arguments": {
    "identifier": "cpu-high-server01-2024",
    "identifierType": "alias",
    "note": "Issue has reoccurred, needs further investigation",
    "user": "engineer@company.com"
  }
}
```

## Query Syntax for List Alerts

The `query` parameter in `list_alerts` supports Opsgenie's search syntax:

- `status:open` - Open alerts only
- `status:closed` - Closed alerts only
- `priority:P1` - P1 priority alerts
- `message:"database"` - Alerts containing "database" in message
- `tag:production` - Alerts with "production" tag
- `team:"Backend Team"` - Alerts assigned to specific team
- `createdAt>"2024-01-01"` - Alerts created after a date
- `acknowledged:true` - Acknowledged alerts

Combine multiple conditions with `AND`, `OR`, and `NOT`:
- `status:open AND priority:P1`
- `tag:production OR tag:staging`
- `NOT acknowledged:true`

## Priority Levels

- **P1**: Critical - Immediate action required
- **P2**: High - Quick response needed
- **P3**: Medium - Normal priority
- **P4**: Low - Can be addressed during business hours
- **P5**: Informational - For awareness

## Identifier Types

- **id**: Opsgenie's internal UUID for the alert
- **tiny**: Short numeric ID (e.g., 123)
- **alias**: Custom identifier you specify when creating the alert