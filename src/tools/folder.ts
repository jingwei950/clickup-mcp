import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ClickUpService } from "../clickup/client.js";
import * as clickupMethods from "../clickup/methods/index.js";

export function registerFolder(
  server: McpServer,
  clickupService: ClickUpService
) {
  // Corresponds to getFolders
  server.tool(
    "get-folders",
    {
      spaceId: z.string(),
      archived: z.boolean().optional(),
    },
    async (params) => {
      try {
        const folders = await clickupMethods.getFolders(
          clickupService,
          params.spaceId,
          params.archived
        ); // Use namespace
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
        const folder = await clickupMethods.createFolder(
          clickupService,
          params.spaceId,
          {
            name: params.name,
          }
        ); // Use namespace
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
        const folder = await clickupMethods.getFolder(
          clickupService,
          params.folderId
        ); // Use namespace
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
        const folder = await clickupMethods.updateFolder(
          clickupService,
          params.folderId,
          {
            name: params.name,
          }
        ); // Use namespace
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
        await clickupMethods.deleteFolder(clickupService, params.folderId); // Use namespace
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
        const folder = await clickupMethods.createFolderFromTemplate(
          clickupService,
          params.spaceId,
          params.templateId,
          params.options
        ); // Use namespace
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
}
