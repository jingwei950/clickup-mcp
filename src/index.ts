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

server.resource(
  "document",
  new ResourceTemplate("clickup://teams/{teamId}/documents/{documentId}", {
    list: undefined,
  }),
  async (uri, { teamId, documentId }) => {
    const team_id = Array.isArray(teamId) ? teamId[0] : teamId;
    const doc_id = Array.isArray(documentId) ? documentId[0] : documentId;
    const doc = await clickupClient.getDocument(team_id, doc_id);
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

// Add tools

// Corresponds to getTeams
server.tool("get-teams", {}, async () => {
  try {
    const teams = await clickupClient.getTeams();
    return {
      content: [{ type: "text", text: JSON.stringify(teams, null, 2) }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error getting teams: ${error}` }],
      isError: true,
    };
  }
});

// Corresponds to createSpace
server.tool(
  "create-space",
  {
    teamId: z.string(),
    name: z.string(), // Add other optional parameters if needed based on API
  },
  async (params) => {
    try {
      const { teamId, ...spaceParams } = params;
      const space = await clickupClient.createSpace(teamId, spaceParams);
      return {
        content: [{ type: "text", text: JSON.stringify(space, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error creating space: ${error}` }],
        isError: true,
      };
    }
  }
);

// Corresponds to getSpaces
server.tool(
  "get-spaces",
  {
    teamId: z.string(),
  },
  async (params) => {
    try {
      const spaces = await clickupClient.getSpaces(params.teamId);
      return {
        content: [{ type: "text", text: JSON.stringify(spaces, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting spaces: ${error}` }],
        isError: true,
      };
    }
  }
);

// Corresponds to updateSpace
server.tool(
  "update-space",
  {
    spaceId: z.string(),
    name: z.string().optional(),
    color: z.string().optional(),
    private: z.boolean().optional(),
    admin_can_manage: z.boolean().optional(),
    multiple_assignees: z.boolean().optional(),
    features: z.record(z.any()).optional(), // Allows passing the features object
  },
  async (params) => {
    try {
      const { spaceId, ...updateParams } = params;
      const space = await clickupClient.updateSpace(spaceId, updateParams);
      return {
        content: [{ type: "text", text: JSON.stringify(space, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error updating space: ${error}` }],
        isError: true,
      };
    }
  }
);

// Corresponds to deleteSpace
server.tool(
  "delete-space",
  {
    spaceId: z.string(),
  },
  async (params) => {
    try {
      await clickupClient.deleteSpace(params.spaceId);
      return {
        content: [
          {
            type: "text",
            text: `Space ${params.spaceId} deleted successfully`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error deleting space: ${error}` }],
        isError: true,
      };
    }
  }
);

// Corresponds to getFolders
server.tool(
  "get-folders",
  {
    spaceId: z.string(),
    archived: z.boolean().optional(),
  },
  async (params) => {
    try {
      const folders = await clickupClient.getFolders(
        params.spaceId,
        params.archived
      );
      return {
        content: [{ type: "text", text: JSON.stringify(folders, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting folders: ${error}` }],
        isError: true,
      };
    }
  }
);

// Corresponds to createFolder
server.tool(
  "create-folder",
  {
    spaceId: z.string(),
    name: z.string(),
  },
  async (params) => {
    try {
      const folder = await clickupClient.createFolder(params.spaceId, {
        name: params.name,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(folder, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error creating folder: ${error}` }],
        isError: true,
      };
    }
  }
);

// Corresponds to getFolder
server.tool(
  "get-folder",
  {
    folderId: z.string(),
  },
  async (params) => {
    try {
      const folder = await clickupClient.getFolder(params.folderId);
      return {
        content: [{ type: "text", text: JSON.stringify(folder, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting folder: ${error}` }],
        isError: true,
      };
    }
  }
);

// Corresponds to updateFolder
server.tool(
  "update-folder",
  {
    folderId: z.string(),
    name: z.string(),
  },
  async (params) => {
    try {
      const folder = await clickupClient.updateFolder(params.folderId, {
        name: params.name,
      });
      return {
        content: [{ type: "text", text: JSON.stringify(folder, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error updating folder: ${error}` }],
        isError: true,
      };
    }
  }
);

// Corresponds to deleteFolder
server.tool(
  "delete-folder",
  {
    folderId: z.string(),
  },
  async (params) => {
    try {
      await clickupClient.deleteFolder(params.folderId);
      return {
        content: [
          {
            type: "text",
            text: `Folder ${params.folderId} deleted successfully`,
          },
        ],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error deleting folder: ${error}` }],
        isError: true,
      };
    }
  }
);

// Corresponds to createFolderFromTemplate
server.tool(
  "create-folder-from-template",
  {
    spaceId: z.string(),
    templateId: z.string(),
    options: z.object({
      name: z.string(),
      return_immediately: z.boolean().optional(),
      content: z.string().optional(),
      time_estimate: z.boolean().optional(),
      automation: z.boolean().optional(),
      include_views: z.boolean().optional(),
      old_due_date: z.boolean().optional(),
      old_start_date: z.boolean().optional(),
      old_followers: z.boolean().optional(),
      comment_attachments: z.boolean().optional(),
      recur_settings: z.boolean().optional(),
      old_tags: z.boolean().optional(),
      old_statuses: z.boolean().optional(),
      subtasks: z.boolean().optional(),
      custom_type: z.boolean().optional(),
      old_assignees: z.boolean().optional(),
      attachments: z.boolean().optional(),
      comment: z.boolean().optional(),
      old_status: z.boolean().optional(),
      external_dependencies: z.boolean().optional(),
      internal_dependencies: z.boolean().optional(),
      priority: z.boolean().optional(),
      custom_fields: z.boolean().optional(),
      old_checklists: z.boolean().optional(),
      relationships: z.boolean().optional(),
      old_subtask_assignees: z.boolean().optional(),
      start_date: z.string().datetime({ offset: true }).optional(), // Expect ISO 8601 format
      due_date: z.string().datetime({ offset: true }).optional(), // Expect ISO 8601 format
      remap_start_date: z.boolean().optional(),
      skip_weekends: z.boolean().optional(),
      archived: z.number().int().min(1).max(2).optional().nullable(), // Allow 1, 2, or null
    }),
  },
  async (params) => {
    try {
      const folder = await clickupClient.createFolderFromTemplate(
        params.spaceId,
        params.templateId,
        params.options
      );
      return {
        content: [{ type: "text", text: JSON.stringify(folder, null, 2) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error creating folder from template: ${error}`,
          },
        ],
        isError: true,
      };
    }
  }
);

// Corresponds to getLists
server.tool(
  "get-lists",
  {
    folderId: z.string(),
  },
  async (params) => {
    try {
      const lists = await clickupClient.getLists(params.folderId);
      return {
        content: [{ type: "text", text: JSON.stringify(lists, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting lists: ${error}` }],
        isError: true,
      };
    }
  }
);

// Corresponds to createList
server.tool(
  "create-list",
  {
    folderId: z.string(),
    name: z.string(),
    content: z.string().optional(),
    due_date: z.number().int().optional(), // Timestamp in ms
    due_date_time: z.boolean().optional(),
    priority: z.number().int().min(1).max(4).optional(),
    assignee: z.number().int().optional(), // User ID
    status: z.string().optional(),
    include_markdown_description: z.boolean().optional(),
  },
  async (params) => {
    try {
      const { folderId, ...listParams } = params;
      const list = await clickupClient.createList(folderId, listParams);
      return {
        content: [{ type: "text", text: JSON.stringify(list, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error creating list: ${error}` }],
        isError: true,
      };
    }
  }
);

// Corresponds to getTasks
server.tool(
  "get-tasks",
  {
    listId: z.string(),
  },
  async (params) => {
    try {
      const tasks = await clickupClient.getTasks(params.listId);
      return {
        content: [{ type: "text", text: JSON.stringify(tasks, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting tasks: ${error}` }],
        isError: true,
      };
    }
  }
);

// Corresponds to getTask
server.tool(
  "get-task",
  {
    taskId: z.string(),
  },
  async (params) => {
    try {
      const task = await clickupClient.getTask(params.taskId);
      return {
        content: [{ type: "text", text: JSON.stringify(task, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting task: ${error}` }],
        isError: true,
      };
    }
  }
);

// Corresponds to createTask
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

// Corresponds to updateTask
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

// Corresponds to deleteTask
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

// Corresponds to searchDocs (renamed to search-documents)
server.tool(
  "search-documents",
  {
    teamId: z.string(), // Assuming workspaceId corresponds to teamId for the tool
    query: z.string().optional(),
  },
  async (params) => {
    try {
      const docs = await clickupClient.searchDocs(params.teamId, params.query);
      return {
        content: [{ type: "text", text: JSON.stringify(docs, null, 2) }],
      };
    } catch (error) {
      return {
        content: [
          { type: "text", text: `Error searching documents: ${error}` },
        ],
        isError: true,
      };
    }
  }
);

// Corresponds to createDocument
server.tool(
  "create-document",
  {
    teamId: z.string(), // Assuming workspaceId corresponds to teamId for the tool
    name: z.string(),
    content: z.string().optional(),
    assignees: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    status: z.string().optional(),
    priority: z.number().optional(),
  },
  async (params) => {
    try {
      const { teamId, ...documentParams } = params;
      const doc = await clickupClient.createDocument(teamId, documentParams);
      return {
        content: [{ type: "text", text: JSON.stringify(doc, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error creating document: ${error}` }],
        isError: true,
      };
    }
  }
);

// Corresponds to getDocument
server.tool(
  "get-document",
  {
    teamId: z.string(), // Assuming workspaceId corresponds to teamId for the tool
    documentId: z.string(),
  },
  async (params) => {
    try {
      const doc = await clickupClient.getDocument(
        params.teamId,
        params.documentId
      );
      return {
        content: [{ type: "text", text: JSON.stringify(doc, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting document: ${error}` }],
        isError: true,
      };
    }
  }
);

// Corresponds to getDocPages
server.tool(
  "get-doc-pages",
  {
    teamId: z.string(), // Assuming workspaceId corresponds to teamId for the tool
    documentId: z.string(),
  },
  async (params) => {
    try {
      const pages = await clickupClient.getDocPages(
        params.teamId,
        params.documentId
      );
      return {
        content: [{ type: "text", text: JSON.stringify(pages, null, 2) }],
      };
    } catch (error) {
      return {
        content: [
          { type: "text", text: `Error getting document pages: ${error}` },
        ],
        isError: true,
      };
    }
  }
);

// Corresponds to createPage
server.tool(
  "create-page",
  {
    teamId: z.string(), // Assuming workspaceId corresponds to teamId for the tool
    documentId: z.string(),
    title: z.string(),
    content: z.string().optional(),
    parent: z.string().optional(),
  },
  async (params) => {
    try {
      const { teamId, documentId, ...pageParams } = params;
      const page = await clickupClient.createPage(
        teamId,
        documentId,
        pageParams
      );
      return {
        content: [{ type: "text", text: JSON.stringify(page, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error creating page: ${error}` }],
        isError: true,
      };
    }
  }
);

// Corresponds to getSpace
server.tool(
  "get-space",
  {
    spaceId: z.string(),
  },
  async (params) => {
    try {
      const space = await clickupClient.getSpace(params.spaceId);
      return {
        content: [{ type: "text", text: JSON.stringify(space, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting space: ${error}` }],
        isError: true,
      };
    }
  }
);

// Corresponds to getPage
server.tool(
  "get-page",
  {
    teamId: z.string(), // Assuming workspaceId corresponds to teamId for the tool
    documentId: z.string(),
    pageId: z.string(),
  },
  async (params) => {
    try {
      const page = await clickupClient.getPage(
        params.teamId,
        params.documentId,
        params.pageId
      );
      return {
        content: [{ type: "text", text: JSON.stringify(page, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting page: ${error}` }],
        isError: true,
      };
    }
  }
);

// Corresponds to editPage
server.tool(
  "edit-page",
  {
    teamId: z.string(), // Assuming workspaceId corresponds to teamId for the tool
    documentId: z.string(),
    pageId: z.string(),
    title: z.string().optional(), // Renamed from name
    content: z.string().optional(),
  },
  async (params) => {
    try {
      const { teamId, documentId, pageId, title, content } = params;
      // Map title to name for the ClickUp API
      const updateParams: { name?: string; content?: string } = {};
      if (title !== undefined) updateParams.name = title;
      if (content !== undefined) updateParams.content = content;

      const page = await clickupClient.editPage(
        teamId,
        documentId,
        pageId,
        updateParams
      );
      return {
        content: [{ type: "text", text: JSON.stringify(page, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error editing page: ${error}` }],
        isError: true,
      };
    }
  }
);

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
