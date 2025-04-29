import { ClickUpService } from "../client.js";

/**
 * Creates a new space in a team
 * @param service ClickUp service instance
 * @param teamId Team ID
 * @param params Space parameters (e.g., name)
 * @returns Created space
 */
export async function createSpace(
  service: ClickUpService,
  teamId: string,
  params: { name: string }
): Promise<any> {
  return service.request(`/team/${teamId}/space`, "POST", params, "v2");
}

/**
 * Gets all spaces in a team
 * @param service ClickUp service instance
 * @param teamId Team ID
 * @returns List of spaces
 */
export async function getSpaces(
  service: ClickUpService,
  teamId: string
): Promise<any> {
  const response = await service.request(
    `/team/${teamId}/space`,
    "GET",
    undefined,
    "v2"
  );
  return response.spaces;
}

/**
 * Gets a single space by ID
 * @param service ClickUp service instance
 * @param spaceId Space ID
 * @returns Space details
 */
export async function getSpace(
  service: ClickUpService,
  spaceId: string
): Promise<any> {
  const response = await service.request(
    `/space/${spaceId}`,
    "GET",
    undefined,
    "v2"
  );
  return response;
}

/**
 * Updates an existing space
 * @param service ClickUp service instance
 * @param spaceId Space ID
 * @param params Space parameters to update (e.g., name, color)
 * @returns Updated space
 */
export async function updateSpace(
  service: ClickUpService,
  spaceId: string,
  params: { name?: string; color?: string; [key: string]: any }
): Promise<any> {
  return service.request(`/space/${spaceId}`, "PUT", params, "v2");
}

/**
 * Deletes a space
 * @param service ClickUp service instance
 * @param spaceId Space ID
 * @returns Void
 */
export async function deleteSpace(
  service: ClickUpService,
  spaceId: string
): Promise<void> {
  await service.request(`/space/${spaceId}`, "DELETE", undefined, "v2");
}
