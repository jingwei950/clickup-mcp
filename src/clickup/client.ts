/**
 * Service for interacting with the ClickUp API request logic
 */
export class ClickUpService {
  private readonly apiKey: string;
  private readonly baseUrlV2 = "https://api.clickup.com/api/v2";
  private readonly baseUrlV3 = "https://api.clickup.com/api/v3";

  /**
   * Creates a new ClickUp service instance
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
  public async request(
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
}
