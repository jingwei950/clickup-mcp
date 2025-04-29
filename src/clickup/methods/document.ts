import { ClickUpService } from "../client.js";

/**
 * Search for docs in a workspace
 * @param service ClickUp service instance
 * @param workspaceId Workspace/Team ID
 * @param query Search query
 * @returns List of docs matching the query
 */
export async function searchDocs(
  service: ClickUpService,
  workspaceId: string,
  query?: string
): Promise<any> {
  let endpoint = `/workspaces/${workspaceId}/docs`;
  if (query) {
    endpoint += `?search=${encodeURIComponent(query)}`;
  }
  const response = await service.request(endpoint, "GET", undefined, "v3");
  return response.docs;
}

/**
 * Creates a new document
 * @param service ClickUp service instance
 * @param workspaceId Workspace ID
 * @param params Document parameters
 * @returns Created document
 */
export async function createDocument(
  service: ClickUpService,
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
  return service.request(
    `/workspaces/${workspaceId}/docs`,
    "POST",
    params,
    "v3"
  );
}

/**
 * Get a document by ID
 * @param service ClickUp service instance
 * @param workspaceId Workspace ID
 * @param documentId Document ID
 * @returns Document details
 */
export async function getDocument(
  service: ClickUpService,
  workspaceId: string,
  documentId: string
): Promise<any> {
  return service.request(
    `/workspaces/${workspaceId}/docs/${documentId}`,
    "GET",
    undefined,
    "v3"
  );
}

/**
 * Get doc pages
 * @param service ClickUp service instance
 * @param workspaceId Workspace ID
 * @param documentId Document ID
 * @returns Document pages
 */
export async function getDocPages(
  service: ClickUpService,
  workspaceId: string,
  documentId: string
): Promise<any> {
  return service.request(
    `/workspaces/${workspaceId}/docs/${documentId}/pages`,
    "GET",
    undefined,
    "v3"
  );
}

/**
 * Create a new page in a document
 * @param service ClickUp service instance
 * @param workspaceId Workspace ID
 * @param documentId Document ID
 * @param params Page parameters
 * @returns Created page
 */
export async function createPage(
  service: ClickUpService,
  workspaceId: string,
  documentId: string,
  params: {
    title: string;
    content?: string;
    parent?: string;
  }
): Promise<any> {
  return service.request(
    `/workspaces/${workspaceId}/docs/${documentId}/pages`,
    "POST",
    params,
    "v3"
  );
}

/**
 * Get a specific page from a document
 * @param service ClickUp service instance
 * @param workspaceId Workspace ID
 * @param documentId Document ID
 * @param pageId Page ID
 * @returns Page details
 */
export async function getPage(
  service: ClickUpService,
  workspaceId: string,
  documentId: string,
  pageId: string
): Promise<any> {
  return service.request(
    `/workspaces/${workspaceId}/docs/${documentId}/pages/${pageId}`,
    "GET",
    undefined,
    "v3"
  );
}

/**
 * Edit an existing page in a document
 * @param service ClickUp service instance
 * @param workspaceId Workspace ID
 * @param documentId Document ID
 * @param pageId Page ID
 * @param params Page parameters to update
 * @returns Updated page
 */
export async function editPage(
  service: ClickUpService,
  workspaceId: string,
  documentId: string,
  pageId: string,
  params: {
    title?: string; // Note: Renamed 'name' to 'title' to match API expectations
    content?: string;
  }
): Promise<any> {
  return service.request(
    `/workspaces/${workspaceId}/docs/${documentId}/pages/${pageId}`,
    "PUT",
    params,
    "v3"
  );
}

/**
 * Create Workspace-level audit logs (Enterprise Plans only)
 * @param service ClickUp service instance
 * @param workspaceId Workspace ID
 * @param params Audit log parameters
 * @returns Created audit log
 */
export async function createAuditLog(
  service: ClickUpService,
  workspaceId: string,
  params: any
): Promise<any> {
  return service.request(
    `/workspaces/${workspaceId}/auditlogs`,
    "POST",
    params,
    "v3"
  );
}
