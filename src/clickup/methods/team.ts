import { ClickUpService } from "../client.js";

/**
 * Gets all teams accessible to the authenticated user
 * @param service ClickUp service instance
 * @returns List of teams
 */
export async function getTeams(service: ClickUpService): Promise<any> {
  const response = await service.request("/team", "GET", undefined, "v2");
  return response.teams;
}
