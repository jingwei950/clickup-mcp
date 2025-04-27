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
- `clickup://teams/{teamId}/documents/{documentId}` - Get details for a specific document

### Available Tools

#### get-teams

Retrieves all teams accessible by the API key.

#### create-space

Creates a new space within a specified team.

Parameters:

- `teamId` (required): ID of the team to create the space in.
- `name` (required): Name of the new space.

#### get-spaces

Retrieves all spaces within a specified team.

Parameters:

- `teamId` (required): ID of the team.

#### update-space

Updates an existing space.

Parameters:

- `spaceId` (required): ID of the space to update.
- `name` (optional): New name for the space.
- `color` (optional): New color for the space.
- `private` (optional): Set space privacy.
- `admin_can_manage` (optional): Allow admins to manage the space.
- `multiple_assignees` (optional): Enable multiple assignees.
- `features` (optional): Object defining feature settings.

#### delete-space

Deletes a space.

Parameters:

- `spaceId` (required): ID of the space to delete.

#### get-folders

Retrieves folders within a specified space.

Parameters:

- `spaceId` (required): ID of the space.
- `archived` (optional): Whether to include archived folders.

#### create-folder

Creates a new folder within a specified space.

Parameters:

- `spaceId` (required): ID of the space.
- `name` (required): Name of the new folder.

#### get-folder

Retrieves details for a specific folder.

Parameters:

- `folderId` (required): ID of the folder.

#### update-folder

Updates an existing folder.

Parameters:

- `folderId` (required): ID of the folder to update.
- `name` (required): New name for the folder.

#### delete-folder

Deletes a folder.

Parameters:

- `folderId` (required): ID of the folder to delete.

#### create-folder-from-template

Creates a new folder from a template.

Parameters:

- `spaceId` (required): ID of the space.
- `templateId` (required): ID of the template to use.
- `options` (required): Object with creation options (see `src/index.ts` for details).
  - `name` (required): Name for the new folder.
  - _... other optional template parameters_

#### get-lists

Retrieves lists within a specified folder.

Parameters:

- `folderId` (required): ID of the folder.

#### create-list

Creates a new list within a specified folder.

Parameters:

- `folderId` (required): ID of the folder.
- `name` (required): Name of the new list.
- `content` (optional): List description.
- `due_date` (optional): Due date (timestamp in ms).
- `due_date_time` (optional): Whether the due date includes time.
- `priority` (optional): Priority level (1-4).
- `assignee` (optional): User ID to assign.
- `status` (optional): Status name.

#### get-tasks

Retrieves tasks within a specified list.

Parameters:

- `listId` (required): ID of the list.

#### get-task

Retrieves details for a specific task.

Parameters:

- `taskId` (required): ID of the task.

#### create-task

Creates a new task in a specified list.

Parameters:

- `listId` (required): ID of the list.
- `name` (required): Name of the task.
- `description` (optional): Task description.
- `priority` (optional): Priority level.
- `dueDate` (optional): Due date string.
- `assignees` (optional): Array of user IDs.
- `tags` (optional): Array of tag names.

#### update-task

Updates an existing task.

Parameters:

- `taskId` (required): ID of the task.
- `name` (optional): New task name.
- `description` (optional): New description.
- `status` (optional): New status name.
- `priority` (optional): New priority level.
- `dueDate` (optional): New due date string.
- `assignees` (optional): New array of user IDs.
- `tags` (optional): New array of tag names.

#### delete-task

Deletes a task.

Parameters:

- `taskId` (required): ID of the task to delete.

#### search-documents

Searches for documents within a team.

Parameters:

- `teamId` (required): ID of the team.
- `query` (optional): Search query string.

#### create-document

Creates a new document within a team.

Parameters:

- `teamId` (required): ID of the team.
- `name` (required): Name of the document.
- `content` (optional): Document content.
- `assignees` (optional): Array of user IDs.
- `tags` (optional): Array of tag names.
- `status` (optional): Status name.
- `priority` (optional): Priority level.

#### get-document

Retrieves details for a specific document.

Parameters:

- `teamId` (required): ID of the team.
- `documentId` (required): ID of the document.

#### get-doc-pages

Retrieves pages within a specific document.

Parameters:

- `teamId` (required): ID of the team.
- `documentId` (required): ID of the document.

#### create-page

Creates a new page within a document.

Parameters:

- `teamId` (required): ID of the team.
- `documentId` (required): ID of the document.
- `title` (required): Title of the new page.
- `content` (optional): Page content.
- `parent` (optional): ID of the parent page.

#### get-space

Retrieves details for a specific space.

Parameters:

- `spaceId` (required): ID of the space.

#### get-page

Retrieves details for a specific page within a document.

Parameters:

- `teamId` (required): ID of the team.
- `documentId` (required): ID of the document.
- `pageId` (required): ID of the page.

#### edit-page

Edits an existing page within a document.

Parameters:

- `teamId` (required): ID of the team.
- `documentId` (required): ID of the document.
- `pageId` (required): ID of the page.
- `title` (optional): New title for the page.
- `content` (optional): New content for the page.

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
