import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ClickUpService } from "../clickup/client.js";
import * as clickupMethods from "../clickup/methods/index.js";

export function registerTeam(
  server: McpServer,
  clickupService: ClickUpService
) {
  // Corresponds to getTeams
  server.tool("get-teams", {}, async () => {
    try {
      const teams = await clickupMethods.getTeams(clickupService); // Use namespace
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
}
