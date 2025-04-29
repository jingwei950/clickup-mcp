import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ClickUpService } from "../clickup/client.js";
import * as clickupMethods from "../clickup/methods/index.js";

// Define the Zod schema for a single task within the bulk request
const createTaskDataSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  assignees: z.array(z.string()).optional(), // Assuming assignees are IDs as strings
  tags: z.array(z.string()).optional(),
  priority: z.number().optional(),
  dueDate: z.string().optional(), // Ensure this matches the type definition
  // Add other fields from CreateTaskData if they were added
});

// Define the Zod schema for a single task update within the bulk request
const updateTaskDataSchema = z.object({
  taskId: z.string(),
  custom_item_id: z.number().nullable().optional(),
  name: z.string().optional(),
  description: z.string().optional(), // Note: Use " " to clear description
  markdown_content: z.string().optional(), // Overrides description if provided
  status: z.string().optional(),
  priority: z.number().optional(), // Integer expected by ClickUp API
  due_date: z.number().optional(), // Timestamp
  due_date_time: z.boolean().optional(),
  parent: z.string().optional(), // Task ID
  time_estimate: z.number().optional(), // Integer
  start_date: z.number().optional(), // Timestamp
  start_date_time: z.boolean().optional(),
  points: z.number().optional(),
  assignees: z
    .object({
      add: z.array(z.number()).optional(),
      rem: z.array(z.number()).optional(),
    })
    .optional(),
  group_assignees: z
    .object({
      add: z.array(z.number()).optional(),
      rem: z.array(z.number()).optional(),
    })
    .optional(),
  watchers: z
    .object({
      add: z.array(z.number()).optional(),
      rem: z.array(z.number()).optional(),
    })
    .optional(),
  archived: z.boolean().optional(),
});

export function registerTask(
  server: McpServer,
  clickupService: ClickUpService
) {
  // Corresponds to getTasks
  server.tool(
    "get-tasks",
    {
      listId: z.string(),
    },
    async (params) => {
      try {
        const tasks = await clickupMethods.getTasks(
          clickupService,
          params.listId
        ); // Use namespace
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
        const task = await clickupMethods.getTask(
          clickupService,
          params.taskId
        ); // Use namespace
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
        const task = await clickupMethods.createTask(clickupService, params); // Use namespace
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
      // Body Params (mirroring Partial<Omit<UpdateTaskData, 'taskId'>>)
      custom_item_id: z.number().nullable().optional(),
      name: z.string().optional(),
      description: z.string().optional(),
      markdown_content: z.string().optional(),
      status: z.string().optional(),
      priority: z.number().optional(),
      due_date: z.number().optional(), // Timestamp
      due_date_time: z.boolean().optional(),
      parent: z.string().optional(), // Task ID
      time_estimate: z.number().optional(),
      start_date: z.number().optional(), // Timestamp
      start_date_time: z.boolean().optional(),
      points: z.number().optional(),
      assignees: z
        .object({
          add: z.array(z.number()).optional(),
          rem: z.array(z.number()).optional(),
        })
        .optional(),
      group_assignees: z
        .object({
          add: z.array(z.number()).optional(),
          rem: z.array(z.number()).optional(),
        })
        .optional(),
      watchers: z
        .object({
          add: z.array(z.number()).optional(),
          rem: z.array(z.number()).optional(),
        })
        .optional(),
      archived: z.boolean().optional(),
      // Query Params (mirroring UpdateTaskQueryParams)
      custom_task_ids: z.boolean().optional(),
      team_id: z.number().optional(),
    },
    async (params) => {
      try {
        const { taskId, custom_task_ids, team_id, ...bodyParams } = params;

        // Automatically set due_date_time and start_date_time to true if date is provided
        if (
          bodyParams.due_date !== undefined &&
          bodyParams.due_date_time === undefined
        ) {
          bodyParams.due_date_time = true;
        }

        if (
          bodyParams.start_date !== undefined &&
          bodyParams.start_date_time === undefined
        ) {
          bodyParams.start_date_time = true;
        }

        const queryParams = {
          custom_task_ids,
          team_id,
        };
        // Filter out undefined query params before passing
        const definedQueryParams = Object.fromEntries(
          Object.entries(queryParams).filter(([_, v]) => v !== undefined)
        );

        const task = await clickupMethods.updateTask(
          clickupService,
          taskId,
          bodyParams, // Pass the remaining params as the body
          Object.keys(definedQueryParams).length > 0
            ? definedQueryParams
            : undefined // Pass query params only if they exist
        );
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
        await clickupMethods.deleteTask(clickupService, params.taskId); // Use namespace
        return {
          content: [
            {
              type: "text",
              text: `Task ${params.taskId} deleted successfully`,
            },
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

  // Add the tool definition for bulk-create-tasks
  server.tool(
    "bulk-create-tasks", // Tool name
    {
      listId: z.string(),
      tasksData: z.array(createTaskDataSchema), // Array of task data objects
    },
    async (params) => {
      try {
        // Note: The 'service' is passed to the imported function
        const results = await clickupMethods.bulkCreateTasks(
          clickupService,
          params.listId,
          params.tasksData // Zod ensures this matches CreateTaskData[]
        );
        return {
          // Decide how to format the output - maybe a summary or the full array?
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        // Catch errors from the bulk function itself (though it handles per-task errors)
        return {
          content: [
            {
              type: "text",
              text: `Error in bulk-create-tasks operation: ${
                // TODO: fix string interpolation
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Corresponds to bulkDeleteTasks (New)
  server.tool(
    "bulk-delete-tasks",
    {
      taskIds: z.array(z.string()), // Array of task IDs to delete
    },
    async (params) => {
      try {
        // Assuming a bulkDeleteTasks method exists or will be created in clickupMethods
        // This method would likely need to iterate and call deleteTask for each ID,
        // or use a potential ClickUp bulk delete endpoint if available.
        // For now, let's assume it handles the logic and returns a summary or status.
        // TODO: Implement clickupMethods.bulkDeleteTasks
        const results = await clickupMethods.bulkDeleteTasks(
          // Placeholder
          clickupService,
          params.taskIds
        );
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }], // Or a success message
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error in bulk-delete-tasks operation: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );

  // Corresponds to bulkUpdateTasks (New)
  server.tool(
    "bulk-update-tasks",
    {
      tasksData: z.array(updateTaskDataSchema), // Array of task update objects
    },
    async (params) => {
      try {
        const results = await clickupMethods.bulkUpdateTasks(
          clickupService,
          params.tasksData // Zod ensures this matches UpdateTaskData[]
        );
        return {
          content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error in bulk-update-tasks operation: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
