import { ClickUpService } from "../client.js";

/**
 * Gets all lists in a folder
 * @param service ClickUp service instance
 * @param folderId Folder ID
 * @returns List of lists
 */
export async function getLists(
  service: ClickUpService,
  folderId: string
): Promise<any> {
  const response = await service.request(
    `/folder/${folderId}/list`,
    "GET",
    undefined,
    "v2"
  );
  return response.lists;
}

/**
 * Creates a new list in a folder
 * @param service ClickUp service instance
 * @param folderId Folder ID
 * @param params List parameters (e.g., name)
 * @returns Created list
 */
export async function createList(
  service: ClickUpService,
  folderId: string,
  params: { name: string; [key: string]: any }
): Promise<any> {
  return service.request(`/folder/${folderId}/list`, "POST", params, "v2");
}
