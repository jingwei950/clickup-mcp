/**
 * Client for interacting with the ClickUp API
 */
export class ClickUpClient {
  private readonly apiKey: string;
  private readonly baseUrl = "https://api.clickup.com/api/v2";

  /**
   * Creates a new ClickUp client
   * @param apiKey ClickUp API key
   */
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Makes a request to the ClickUp API
   * @param endpoint API endpoint
   * @param method HTTP method
   * @param body Request body (optional)
   * @returns Response data
   */
  private async request(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any
  ): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      Authorization: this.apiKey,
      "Content-Type": "application/json",
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`ClickUp API error (${response.status}): ${errorText}`);
    }

    return response.json();
  }

  /**
   * Gets all teams accessible to the authenticated user
   * @returns List of teams
   */
  async getTeams(): Promise<any> {
    const response = await this.request("/team");
    return response.teams;
  }

  /**
   * Gets all spaces in a team
   * @param teamId Team ID
   * @returns List of spaces
   */
  async getSpaces(teamId: string): Promise<any> {
    const response = await this.request(`/team/${teamId}/space`);
    return response.spaces;
  }

  /**
   * Gets all folders in a space
   * @param spaceId Space ID
   * @returns List of folders
   */
  async getFolders(spaceId: string): Promise<any> {
    const response = await this.request(`/space/${spaceId}/folder`);
    return response.folders;
  }

  /**
   * Gets all lists in a folder
   * @param folderId Folder ID
   * @returns List of lists
   */
  async getLists(folderId: string): Promise<any> {
    const response = await this.request(`/folder/${folderId}/list`);
    return response.lists;
  }

  /**
   * Gets all tasks in a list
   * @param listId List ID
   * @returns List of tasks
   */
  async getTasks(listId: string): Promise<any> {
    const response = await this.request(`/list/${listId}/task`);
    return response.tasks;
  }

  /**
   * Gets a single task by ID
   * @param taskId Task ID
   * @returns Task details
   */
  async getTask(taskId: string): Promise<any> {
    return this.request(`/task/${taskId}`);
  }

  /**
   * Creates a new task
   * @param params Task parameters
   * @returns Created task
   */
  async createTask(params: {
    listId: string;
    name: string;
    description?: string;
    priority?: number;
    dueDate?: string;
    assignees?: string[];
    tags?: string[];
  }): Promise<any> {
    const { listId, ...taskParams } = params;
    return this.request(`/list/${listId}/task`, "POST", taskParams);
  }

  /**
   * Updates an existing task
   * @param taskId Task ID
   * @param params Task parameters to update
   * @returns Updated task
   */
  async updateTask(
    taskId: string,
    params: {
      name?: string;
      description?: string;
      status?: string;
      priority?: number;
      dueDate?: string;
      assignees?: string[];
      tags?: string[];
    }
  ): Promise<any> {
    return this.request(`/task/${taskId}`, "PUT", params);
  }

  /**
   * Deletes a task
   * @param taskId Task ID
   * @returns Void
   */
  async deleteTask(taskId: string): Promise<void> {
    await this.request(`/task/${taskId}`, "DELETE");
  }
}
