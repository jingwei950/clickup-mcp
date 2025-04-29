import { ClickUpService } from "../client.js";
import {
  Task,
  CreateTaskData,
  UpdateTaskData,
  UpdateTaskQueryParams,
} from "../types.js";

/**
 * Gets all tasks in a list
 * @param service ClickUp service instance
 * @param listId List ID
 * @returns List of tasks
 */
export async function getTasks(
  service: ClickUpService,
  listId: string
): Promise<any> {
  const response = await service.request(
    `/list/${listId}/task`,
    "GET",
    undefined,
    "v2"
  );
  return response.tasks;
}

/**
 * Gets a single task by ID
 * @param service ClickUp service instance
 * @param taskId Task ID
 * @returns Task details
 */
export async function getTask(
  service: ClickUpService,
  taskId: string
): Promise<any> {
  return service.request(`/task/${taskId}`, "GET", undefined, "v2");
}

/**
 * Creates a new task
 * @param service ClickUp service instance
 * @param params Task parameters
 * @returns Created task
 */
export async function createTask(
  service: ClickUpService,
  params: {
    listId: string;
    name: string;
    description?: string;
    priority?: number;
    dueDate?: string;
    assignees?: string[];
    tags?: string[];
  }
): Promise<any> {
  const { listId, ...taskParams } = params;
  return service.request(`/list/${listId}/task`, "POST", taskParams, "v2");
}

/**
 * Updates an existing task
 * @param service ClickUp service instance
 * @param taskId Task ID
 * @param params Task parameters to update
 * @returns Updated task
 */
export async function updateTask(
  service: ClickUpService,
  taskId: string,
  params: Partial<Omit<UpdateTaskData, "taskId">>,
  queryParams?: UpdateTaskQueryParams
): Promise<any> {
  let url = `/task/${taskId}`;
  if (queryParams?.custom_task_ids && queryParams.team_id !== undefined) {
    url += `?custom_task_ids=true&team_id=${queryParams.team_id}`;
  } else if (queryParams?.custom_task_ids) {
    // It's generally required to provide team_id when custom_task_ids is true,
    // but we'll allow the API call and let ClickUp handle the potential error.
    url += `?custom_task_ids=true`;
  }

  return service.request(url, "PUT", params, "v2");
}

/**
 * Deletes a task
 * @param service ClickUp service instance
 * @param taskId Task ID
 * @returns Void
 */
export async function deleteTask(
  service: ClickUpService,
  taskId: string
): Promise<void> {
  await service.request(`/task/${taskId}`, "DELETE", undefined, "v2");
}

/**
 * Creates multiple tasks in ClickUp.
 *
 * @param service - The ClickUpService instance.
 * @param listId - The ID of the list to create tasks in.
 * @param tasksData - An array of task data objects.
 * @returns A promise that resolves with an array of the created tasks or results.
 */
export async function bulkCreateTasks(
  service: ClickUpService,
  listId: string,
  tasksData: CreateTaskData[]
): Promise<(Task | { error: any; taskData: CreateTaskData })[]> {
  const results: (Task | { error: any; taskData: CreateTaskData })[] = [];

  for (const taskData of tasksData) {
    try {
      const createdTask = await createTask(service, { listId, ...taskData });
      results.push(createdTask);
    } catch (error) {
      console.error(`Failed to create task "${taskData.name}":`, error);
      results.push({ error: error, taskData: taskData });
    }
  }

  return results;
}

/**
 * Deletes multiple tasks in ClickUp by iterating through IDs.
 *
 * @param service - The ClickUpService instance.
 * @param taskIds - An array of task IDs to delete.
 * @returns A promise that resolves with a summary of the operation.
 */
export async function bulkDeleteTasks(
  service: ClickUpService,
  taskIds: string[]
): Promise<{ succeeded: string[]; failed: { taskId: string; error: any }[] }> {
  const succeeded: string[] = [];
  const failed: { taskId: string; error: any }[] = [];

  for (const taskId of taskIds) {
    try {
      await deleteTask(service, taskId);
      succeeded.push(taskId);
    } catch (error) {
      console.error(`Failed to delete task "${taskId}":`, error);
      failed.push({ taskId: taskId, error: error });
    }
  }

  return { succeeded, failed };
}

/**
 * Updates multiple tasks in ClickUp by iterating through task update objects.
 *
 * @param service - The ClickUpService instance.
 * @param tasksUpdateData - An array of objects, each containing a taskId and the update payload.
 * @returns A promise that resolves with a summary of the update operation.
 */
export async function bulkUpdateTasks(
  service: ClickUpService,
  tasksUpdateData: UpdateTaskData[]
): Promise<{
  succeeded: Task[];
  failed: { taskData: UpdateTaskData; error: any }[];
}> {
  const succeeded: Task[] = [];
  const failed: { taskData: UpdateTaskData; error: any }[] = [];

  for (const taskData of tasksUpdateData) {
    const { taskId, ...updatePayload } = taskData;
    if (!taskId) {
      console.error("Task update data missing taskId:", taskData);
      failed.push({ taskData: taskData, error: new Error("Missing taskId") });
      continue;
    }
    try {
      const updatedTask = await updateTask(service, taskId, updatePayload);
      succeeded.push(updatedTask);
    } catch (error) {
      console.error(`Failed to update task "${taskId}":`, error);
      failed.push({ taskData: taskData, error: error });
    }
  }

  return { succeeded, failed };
}
