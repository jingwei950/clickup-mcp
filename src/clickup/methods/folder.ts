import { ClickUpService } from "../client.js";
import { CreateFolderFromTemplateOptions } from "../types.js";

/**
 * Gets all folders in a space
 * @param service ClickUp service instance
 * @param spaceId Space ID
 * @param archived Optional boolean parameter to filter archived folders
 * @returns List of folders
 */
export async function getFolders(
  service: ClickUpService,
  spaceId: string,
  archived?: boolean
): Promise<any> {
  let endpoint = `/space/${spaceId}/folder`;
  if (archived !== undefined) {
    endpoint += `?archived=${archived}`;
  }
  const response = await service.request(endpoint, "GET", undefined, "v2");
  return response.folders;
}

/**
 * Creates a new folder in a space
 * @param service ClickUp service instance
 * @param spaceId Space ID
 * @param params Folder parameters (e.g., name)
 * @returns Created folder
 */
export async function createFolder(
  service: ClickUpService,
  spaceId: string,
  params: { name: string }
): Promise<any> {
  return service.request(`/space/${spaceId}/folder`, "POST", params, "v2");
}

/**
 * Gets a single folder by ID
 * @param service ClickUp service instance
 * @param folderId Folder ID
 * @returns Folder details
 */
export async function getFolder(
  service: ClickUpService,
  folderId: string
): Promise<any> {
  return service.request(`/folder/${folderId}`, "GET", undefined, "v2");
}

/**
 * Updates an existing folder
 * @param service ClickUp service instance
 * @param folderId Folder ID
 * @param params Folder parameters to update (e.g., name)
 * @returns Updated folder
 */
export async function updateFolder(
  service: ClickUpService,
  folderId: string,
  params: { name: string }
): Promise<any> {
  return service.request(`/folder/${folderId}`, "PUT", params, "v2");
}

/**
 * Deletes a folder
 * @param service ClickUp service instance
 * @param folderId Folder ID
 * @returns Void
 */
export async function deleteFolder(
  service: ClickUpService,
  folderId: string
): Promise<void> {
  await service.request(`/folder/${folderId}`, "DELETE", undefined, "v2");
}

/**
 * Creates a new folder from a template
 * @param service ClickUp service instance
 * @param spaceId Space ID where the folder will be created
 * @param templateId Template ID to use
 * @param options Folder parameters (e.g., name)
 * @returns Created folder
 */
export async function createFolderFromTemplate(
  service: ClickUpService,
  spaceId: string,
  templateId: string,
  options: CreateFolderFromTemplateOptions
): Promise<any> {
  return service.request(
    `/space/${spaceId}/folder/template/${templateId}`,
    "POST",
    options,
    "v2"
  );
}
