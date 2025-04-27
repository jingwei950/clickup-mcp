# ClickUp MCP Server

A Model Context Protocol (MCP) server for ClickUp that enables AI models to interact with ClickUp teams, spaces, folders, lists, and tasks.

## Features

- **Resources**: Access ClickUp teams, spaces, folders, lists, and tasks
- **Tools**: Create, update, and delete tasks
- **Prompts**: Use templated prompts for common ClickUp operations

## Installation

### Prerequisites

- Node.js (v18 or later)
- A ClickUp API key

### Install

```bash
# Clone the repository
git clone https://github.com/yourusername/clickup-mcp.git
cd clickup-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

## Usage

### Running the Server

Set your ClickUp API key as an environment variable and start the server:

```bash
export CLICKUP_API_KEY="your-clickup-api-key"
npm start
```

### Using with Claude Desktop

To use this server with Claude Desktop, add the following to your Claude Desktop configuration:

```json
{
  "mcpServers": {
    "clickup": {
      "command": "npm",
      "args": ["run", "start"],
      "cwd": "/path/to/clickup-mcp",
      "env": {
        "CLICKUP_API_KEY": "your-clickup-api-key"
      }
    }
  }
}
```

### Available Resources

- `clickup://teams` - List all teams
- `clickup://teams/{teamId}/spaces` - List spaces for a team
- `clickup://spaces/{spaceId}/folders` - List folders for a space
- `clickup://folders/{folderId}/lists` - List lists for a folder
- `clickup://lists/{listId}/tasks` - List tasks for a list
- `clickup://tasks/{taskId}` - Get details for a specific task

### Available Tools

#### create-task

Creates a new task in a specified list.

Parameters:

- `listId` (required): The ID of the list to create the task in
- `name` (required): The name of the task
- `description` (optional): Detailed description of the task
- `priority` (optional): Priority level (1-4)
- `dueDate` (optional): Due date in milliseconds or ISO format
- `assignees` (optional): Array of user IDs to assign
- `tags` (optional): Array of tag names

#### update-task

Updates an existing task.

Parameters:

- `taskId` (required): The ID of the task to update
- `name` (optional): New name for the task
- `description` (optional): New description
- `status` (optional): New status
- `priority` (optional): New priority level (1-4)
- `dueDate` (optional): New due date
- `assignees` (optional): New array of assignee user IDs
- `tags` (optional): New array of tag names

#### delete-task

Deletes a task.

Parameters:

- `taskId` (required): The ID of the task to delete

### Available Prompts

#### create-task-from-requirements

Helps create a task with AI assistance based on requirements.

Parameters:

- `requirements` (required): Description of task requirements

## Development

```bash
# Run in development mode
npm run dev

# Watch for changes
npm run watch
```

## License

MIT
