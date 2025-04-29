import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ClickUpService } from "../clickup/client.js";

import { registerTeam } from "./team.js";
import { registerSpace } from "./space.js";
import { registerFolder } from "./folder.js";
import { registerList } from "./list.js";
import { registerTask } from "./task.js";
import { registerDocument } from "./document.js";

export function registerAll(server: McpServer, clickupService: ClickUpService) {
  registerTeam(server, clickupService);
  registerSpace(server, clickupService);
  registerFolder(server, clickupService);
  registerList(server, clickupService);
  registerTask(server, clickupService);
  registerDocument(server, clickupService);
}
