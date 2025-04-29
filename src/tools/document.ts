import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ClickUpService } from "../clickup/client.js";
import * as clickupMethods from "../clickup/methods/index.js";

export function registerDocument(
  server: McpServer,
  clickupService: ClickUpService
) {
  // Corresponds to searchDocs (renamed to search-documents)
  server.tool(
    "search-documents",
    {
      teamId: z.string(), // Assuming workspaceId corresponds to teamId for the tool
      query: z.string().optional(),
    },
    async (params) => {
      try {
        const docs = await clickupMethods.searchDocs(
          clickupService,
          params.teamId,
          params.query
        );
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
        const doc = await clickupMethods.createDocument(
          clickupService,
          teamId,
          documentParams
        ); // Use namespace
        return {
          content: [{ type: "text", text: JSON.stringify(doc, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            { type: "text", text: `Error creating document: ${error}` },
          ],
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
        const doc = await clickupMethods.getDocument(
          clickupService,
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
        const pages = await clickupMethods.getDocPages(
          clickupService,
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
        const page = await clickupMethods.createPage(
          clickupService,
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
        const page = await clickupMethods.getPage(
          clickupService,
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

        const page = await clickupMethods.editPage(
          clickupService,
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
}
