#!/usr/bin/env node

import "dotenv/config";
import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ClickUpClient } from "./clickup/client.js";

// Get ClickUp API key from environment variable
const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY;

if (!CLICKUP_API_KEY) {
  console.error("CLICKUP_API_KEY environment variable is required");
  process.exit(1);
}

// Initialize ClickUp client
const clickupClient = new ClickUpClient(CLICKUP_API_KEY);

// Create an MCP server
const server = new McpServer({
  name: "ClickUp MCP Server",
  version: "1.0.0",
});

// Add resources
server.resource("teams", "clickup://teams", async (uri) => {
  const teams = await clickupClient.getTeams();
  return {
    contents: [
      {
        uri: uri.href,
        text: JSON.stringify(teams, null, 2),
      },
    ],
  };
});

server.resource(
  "spaces",
  new ResourceTemplate("clickup://teams/{teamId}/spaces", { list: undefined }),
  async (uri, { teamId }) => {
    const id = Array.isArray(teamId) ? teamId[0] : teamId;
    const spaces = await clickupClient.getSpaces(id);
    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(spaces, null, 2),
        },
      ],
    };
  }
);

server.resource(
  "folders",
  new ResourceTemplate("clickup://spaces/{spaceId}/folders", {
    list: undefined,
  }),
  async (uri, { spaceId }) => {
    const id = Array.isArray(spaceId) ? spaceId[0] : spaceId;
    const folders = await clickupClient.getFolders(id);
    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(folders, null, 2),
        },
      ],
    };
  }
);

server.resource(
  "lists",
  new ResourceTemplate("clickup://folders/{folderId}/lists", {
    list: undefined,
  }),
  async (uri, { folderId }) => {
    const id = Array.isArray(folderId) ? folderId[0] : folderId;
    const lists = await clickupClient.getLists(id);
    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(lists, null, 2),
        },
      ],
    };
  }
);

server.resource(
  "tasks",
  new ResourceTemplate("clickup://lists/{listId}/tasks", { list: undefined }),
  async (uri, { listId }) => {
    const id = Array.isArray(listId) ? listId[0] : listId;
    const tasks = await clickupClient.getTasks(id);
    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(tasks, null, 2),
        },
      ],
    };
  }
);

server.resource(
  "task",
  new ResourceTemplate("clickup://tasks/{taskId}", { list: undefined }),
  async (uri, { taskId }) => {
    const id = Array.isArray(taskId) ? taskId[0] : taskId;
    const task = await clickupClient.getTask(id);
    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(task, null, 2),
        },
      ],
    };
  }
);

// Add tools
server.tool(
  "create-task",
  {
    listId: z.string(),
    name: z.string(),
    description: z.string().optional(),
    priority: z.number().optional(),
    dueDate: z.string().optional(),
    assignees: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  },
  async (params) => {
    try {
      const task = await clickupClient.createTask(params);
      return {
        content: [{ type: "text", text: JSON.stringify(task, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error creating task: ${error}` }],
        isError: true,
      };
    }
  }
);

server.tool(
  "update-task",
  {
    taskId: z.string(),
    name: z.string().optional(),
    description: z.string().optional(),
    status: z.string().optional(),
    priority: z.number().optional(),
    dueDate: z.string().optional(),
    assignees: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
  },
  async (params) => {
    try {
      const task = await clickupClient.updateTask(params.taskId, params);
      return {
        content: [{ type: "text", text: JSON.stringify(task, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error updating task: ${error}` }],
        isError: true,
      };
    }
  }
);

server.tool(
  "delete-task",
  {
    taskId: z.string(),
  },
  async (params) => {
    try {
      await clickupClient.deleteTask(params.taskId);
      return {
        content: [
          { type: "text", text: `Task ${params.taskId} deleted successfully` },
        ],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error deleting task: ${error}` }],
        isError: true,
      };
    }
  }
);

// Add prompts
server.prompt(
  "create-task-from-requirements",
  { requirements: z.string() },
  ({ requirements }) => ({
    messages: [
      {
        role: "user",
        content: {
          type: "text",
          text: `Create a ClickUp task based on these requirements:\n\n${requirements}`,
        },
      },
    ],
  })
);

// Start the server with stdio transport
async function runServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("ClickUp MCP Server started");
}

runServer().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
