#!/usr/bin/env node

import "dotenv/config";
import {
  McpServer,
  ResourceTemplate,
} from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ClickUpService } from "./clickup/client.js";
import * as clickupMethods from "./clickup/methods/index.js"; // Import all methods under a namespace
import { registerAll } from "./tools/index.js"; // Import the tool registration function

// Get ClickUp API key from environment variable
const CLICKUP_API_KEY = process.env.CLICKUP_API_KEY;

if (!CLICKUP_API_KEY) {
  console.error("CLICKUP_API_KEY environment variable is required");
  process.exit(1);
}

// Initialize ClickUp service
const clickupService = new ClickUpService(CLICKUP_API_KEY);

// Create an MCP server
const server = new McpServer({
  name: "ClickUp MCP Server",
  version: "1.0.0",
});

// Add resources
server.resource("teams", "clickup://teams", async (uri) => {
  const teams = await clickupMethods.getTeams(clickupService); // Use namespace
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
    const spaces = await clickupMethods.getSpaces(clickupService, id); // Use namespace
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
    const folders = await clickupMethods.getFolders(clickupService, id); // Use namespace
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
    const lists = await clickupMethods.getLists(clickupService, id); // Use namespace
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
    const tasks = await clickupMethods.getTasks(clickupService, id); // Use namespace
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
    const task = await clickupMethods.getTask(clickupService, id); // Use namespace
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

server.resource(
  "document",
  new ResourceTemplate("clickup://teams/{teamId}/documents/{documentId}", {
    list: undefined,
  }),
  async (uri, { teamId, documentId }) => {
    const team_id = Array.isArray(teamId) ? teamId[0] : teamId;
    const doc_id = Array.isArray(documentId) ? documentId[0] : documentId;
    const doc = await clickupMethods.getDocument(
      clickupService,
      team_id,
      doc_id
    ); // Use namespace
    return {
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(doc, null, 2),
        },
      ],
    };
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

// Register all tools
registerAll(server, clickupService);

// Note: createAuditLog is not exposed as a tool.

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
