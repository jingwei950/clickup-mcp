import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ClickUpService } from "../clickup/client.js";
import * as clickupMethods from "../clickup/methods/index.js";

export function registerSpace(
  server: McpServer,
  clickupService: ClickUpService
) {
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
        const space = await clickupMethods.createSpace(
          clickupService,
          teamId,
          spaceParams
        ); // Use namespace
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
        const spaces = await clickupMethods.getSpaces(
          clickupService,
          params.teamId
        ); // Use namespace
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
        const space = await clickupMethods.updateSpace(
          clickupService,
          spaceId,
          updateParams
        ); // Use namespace
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
        await clickupMethods.deleteSpace(clickupService, params.spaceId); // Use namespace
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

  // Corresponds to getSpace
  server.tool(
    "get-space",
    {
      spaceId: z.string(),
    },
    async (params) => {
      try {
        const space = await clickupMethods.getSpace(
          clickupService,
          params.spaceId
        );
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
}
