import { CreateFolderFromTemplateOptions } from "./types.js";

/**
 * Client for interacting with the ClickUp API
 */
export class ClickUpClient {
  private readonly apiKey: string;
  private readonly baseUrlV2 = "https://api.clickup.com/api/v2";
  private readonly baseUrlV3 = "https://api.clickup.com/api/v3";

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
   * @param apiVersion API version to use (v2 or v3)
   * @returns Response data
   */
  private async request(
    endpoint: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: any,
    apiVersion: "v2" | "v3" = "v2"
  ): Promise<any> {
    const baseUrl = apiVersion === "v2" ? this.baseUrlV2 : this.baseUrlV3;
    const url = `${baseUrl}${endpoint}`;
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

    // Handle empty responses gracefully
    const text = await response.text();
    if (!text) {
      // For successful operations that return empty responses
      if (method === "PUT" || method === "DELETE") {
        return { success: true };
      }
      return {};
    }

    // Parse JSON
    try {
      return JSON.parse(text);
    } catch (error) {
      throw new Error(`Invalid JSON response: ${text}`);
    }
  }

  /**
   * Gets all teams accessible to the authenticated user
   * @returns List of teams
   */
  async getTeams(): Promise<any> {
    const response = await this.request("/team", "GET", undefined, "v2");
    return response.teams;
  }

  /**
   * Creates a new space in a team
   * @param teamId Team ID
   * @param params Space parameters (e.g., name)
   * @returns Created space
   */
  async createSpace(teamId: string, params: { name: string }): Promise<any> {
    return this.request(`/team/${teamId}/space`, "POST", params, "v2");
  }

  /**
   * Gets all spaces in a team
   * @param teamId Team ID
   * @returns List of spaces
   */
  async getSpaces(teamId: string): Promise<any> {
    const response = await this.request(
      `/team/${teamId}/space`,
      "GET",
      undefined,
      "v2"
    );
    return response.spaces;
  }

  /**
   * Gets a single space by ID
   * @param spaceId Space ID
   * @returns Space details
   */
  async getSpace(spaceId: string): Promise<any> {
    const response = await this.request(
      `/space/${spaceId}`,
      "GET",
      undefined,
      "v2"
    );
    return response;
  }

  /**
   * Updates an existing space
   * @param spaceId Space ID
   * @param params Space parameters to update (e.g., name, color)
   * @returns Updated space
   */
  async updateSpace(
    spaceId: string,
    params: { name?: string; color?: string; [key: string]: any }
  ): Promise<any> {
    return this.request(`/space/${spaceId}`, "PUT", params, "v2");
  }

  /**
   * Deletes a space
   * @param spaceId Space ID
   * @returns Void
   */
  async deleteSpace(spaceId: string): Promise<void> {
    await this.request(`/space/${spaceId}`, "DELETE", undefined, "v2");
  }

  /**
   * Gets all folders in a space
   * @param spaceId Space ID
   * @param archived Optional boolean parameter to filter archived folders
   * @returns List of folders
   */
  async getFolders(spaceId: string, archived?: boolean): Promise<any> {
    let endpoint = `/space/${spaceId}/folder`;
    if (archived !== undefined) {
      endpoint += `?archived=${archived}`;
    }
    const response = await this.request(endpoint, "GET", undefined, "v2");
    return response.folders;
  }

  /**
   * Creates a new folder in a space
   * @param spaceId Space ID
   * @param params Folder parameters (e.g., name)
   * @returns Created folder
   */
  async createFolder(spaceId: string, params: { name: string }): Promise<any> {
    return this.request(`/space/${spaceId}/folder`, "POST", params, "v2");
  }

  /**
   * Gets a single folder by ID
   * @param folderId Folder ID
   * @returns Folder details
   */
  async getFolder(folderId: string): Promise<any> {
    return this.request(`/folder/${folderId}`, "GET", undefined, "v2");
  }

  /**
   * Updates an existing folder
   * @param folderId Folder ID
   * @param params Folder parameters to update (e.g., name)
   * @returns Updated folder
   */
  async updateFolder(folderId: string, params: { name: string }): Promise<any> {
    return this.request(`/folder/${folderId}`, "PUT", params, "v2");
  }

  /**
   * Deletes a folder
   * @param folderId Folder ID
   * @returns Void
   */
  async deleteFolder(folderId: string): Promise<void> {
    await this.request(`/folder/${folderId}`, "DELETE", undefined, "v2");
  }

  /**
   * Creates a new folder from a template
   * @param spaceId Space ID where the folder will be created
   * @param templateId Template ID to use
   * @param options Folder parameters (e.g., name)
   * @returns Created folder
   */
  async createFolderFromTemplate(
    spaceId: string,
    templateId: string,
    options: CreateFolderFromTemplateOptions
  ): Promise<any> {
    return this.request(
      `/space/${spaceId}/folder/template/${templateId}`,
      "POST",
      options,
      "v2"
    );
  }

  /**
   * Gets all lists in a folder
   * @param folderId Folder ID
   * @returns List of lists
   */
  async getLists(folderId: string): Promise<any> {
    const response = await this.request(
      `/folder/${folderId}/list`,
      "GET",
      undefined,
      "v2"
    );
    return response.lists;
  }

  /**
   * Creates a new list in a folder
   * @param folderId Folder ID
   * @param params List parameters (e.g., name)
   * @returns Created list
   */
  async createList(
    folderId: string,
    params: { name: string; [key: string]: any }
  ): Promise<any> {
    return this.request(`/folder/${folderId}/list`, "POST", params, "v2");
  }

  /**
   * Gets all tasks in a list
   * @param listId List ID
   * @returns List of tasks
   */
  async getTasks(listId: string): Promise<any> {
    const response = await this.request(
      `/list/${listId}/task`,
      "GET",
      undefined,
      "v2"
    );
    return response.tasks;
  }

  /**
   * Gets a single task by ID
   * @param taskId Task ID
   * @returns Task details
   */
  async getTask(taskId: string): Promise<any> {
    return this.request(`/task/${taskId}`, "GET", undefined, "v2");
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
    return this.request(`/list/${listId}/task`, "POST", taskParams, "v2");
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
    return this.request(`/task/${taskId}`, "PUT", params, "v2");
  }

  /**
   * Deletes a task
   * @param taskId Task ID
   * @returns Void
   */
  async deleteTask(taskId: string): Promise<void> {
    await this.request(`/task/${taskId}`, "DELETE", undefined, "v2");
  }

  /**
   * Search for docs in a workspace
   * @param workspaceId Workspace/Team ID
   * @param query Search query
   * @returns List of docs matching the query
   */
  async searchDocs(workspaceId: string, query?: string): Promise<any> {
    let endpoint = `/workspaces/${workspaceId}/docs`;
    if (query) {
      endpoint += `?search=${encodeURIComponent(query)}`;
    }
    const response = await this.request(endpoint, "GET", undefined, "v3");
    return response.docs;
  }

  /**
   * Creates a new document
   * @param workspaceId Workspace ID
   * @param params Document parameters
   * @returns Created document
   */
  async createDocument(
    workspaceId: string,
    params: {
      name: string;
      content?: string;
      assignees?: string[];
      tags?: string[];
      status?: string;
      priority?: number;
    }
  ): Promise<any> {
    return this.request(
      `/workspaces/${workspaceId}/docs`,
      "POST",
      params,
      "v3"
    );
  }

  /**
   * Get a document by ID
   * @param workspaceId Workspace ID
   * @param documentId Document ID
   * @returns Document details
   */
  async getDocument(workspaceId: string, documentId: string): Promise<any> {
    return this.request(
      `/workspaces/${workspaceId}/docs/${documentId}`,
      "GET",
      undefined,
      "v3"
    );
  }

  /**
   * Get doc pages
   * @param workspaceId Workspace ID
   * @param documentId Document ID
   * @returns Document pages
   */
  async getDocPages(workspaceId: string, documentId: string): Promise<any> {
    return this.request(
      `/workspaces/${workspaceId}/docs/${documentId}/pages`,
      "GET",
      undefined,
      "v3"
    );
  }

  /**
   * Create a new page in a document
   * @param workspaceId Workspace ID
   * @param documentId Document ID
   * @param params Page parameters
   * @returns Created page
   */
  async createPage(
    workspaceId: string,
    documentId: string,
    params: {
      title: string;
      content?: string;
      parent?: string;
    }
  ): Promise<any> {
    return this.request(
      `/workspaces/${workspaceId}/docs/${documentId}/pages`,
      "POST",
      params,
      "v3"
    );
  }

  /**
   * Get a specific page from a document
   * @param workspaceId Workspace ID
   * @param documentId Document ID
   * @param pageId Page ID
   * @returns Page details
   */
  async getPage(
    workspaceId: string,
    documentId: string,
    pageId: string
  ): Promise<any> {
    return this.request(
      `/workspaces/${workspaceId}/docs/${documentId}/pages/${pageId}`,
      "GET",
      undefined,
      "v3"
    );
  }

  /**
   * Edit an existing page in a document
   * @param workspaceId Workspace ID
   * @param documentId Document ID
   * @param pageId Page ID
   * @param params Page parameters to update
   * @returns Updated page
   */
  async editPage(
    workspaceId: string,
    documentId: string,
    pageId: string,
    params: {
      name?: string;
      content?: string;
    }
  ): Promise<any> {
    return this.request(
      `/workspaces/${workspaceId}/docs/${documentId}/pages/${pageId}`,
      "PUT",
      params,
      "v3"
    );
  }

  /**
   * Create Workspace-level audit logs (Enterprise Plans only)
   * @param workspaceId Workspace ID
   * @param params Audit log parameters
   * @returns Created audit log
   */
  async createAuditLog(workspaceId: string, params: any): Promise<any> {
    return this.request(
      `/workspaces/${workspaceId}/auditlogs`,
      "POST",
      params,
      "v3"
    );
  }
}
