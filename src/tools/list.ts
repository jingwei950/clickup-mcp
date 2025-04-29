import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ClickUpService } from "../clickup/client.js";
import * as clickupMethods from "../clickup/methods/index.js";

export function registerList(
  server: McpServer,
  clickupService: ClickUpService
) {
  // Corresponds to getLists
  server.tool(
    "get-lists",
    {
      folderId: z.string(),
    },
    async (params) => {
      try {
        const lists = await clickupMethods.getLists(
          clickupService,
          params.folderId
        ); // Use namespace
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
        const list = await clickupMethods.createList(
          clickupService,
          folderId,
          listParams
        ); // Use namespace
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
}
