import { MailOpsError } from "./error.js";

const MAX_RESPONSE_SIZE = 10 * 1024 * 1024; // 10 MB

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions {
  method: HttpMethod;
  path: string;
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
}

export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly timeoutMs: number;
  private readonly sdkVersion: string;

  constructor(
    baseUrl: string,
    apiKey: string,
    timeoutMs: number,
    sdkVersion: string,
  ) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
    this.apiKey = apiKey;
    this.timeoutMs = timeoutMs;
    this.sdkVersion = sdkVersion;
  }

  async request<T>(options: RequestOptions): Promise<T> {
    const url = new URL(`${this.baseUrl}${options.path}`);

    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
      Accept: "application/json",
      "User-Agent": `mailops-sdk-typescript/${this.sdkVersion}`,
    };

    if (options.body !== undefined && options.method !== "GET") {
      headers["Content-Type"] = "application/json";
    }

    const fetchInit: RequestInit = {
      method: options.method,
      headers,
      body:
        options.body !== undefined && options.method !== "GET"
          ? JSON.stringify(options.body)
          : undefined,
      signal: AbortSignal.timeout(this.timeoutMs),
    };

    let response: Response;
    try {
      response = await fetch(url.toString(), fetchInit);
    } catch (err) {
      if (err instanceof DOMException && err.name === "TimeoutError") {
        throw new MailOpsError(
          0,
          "timeout_error",
          `Request timed out after ${this.timeoutMs}ms`,
        );
      }
      throw new MailOpsError(
        0,
        "network_error",
        `Network request failed: ${err instanceof Error ? err.message : String(err)}`,
      );
    }

    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength, 10) > MAX_RESPONSE_SIZE) {
      throw new MailOpsError(502, "client_error", "Response too large");
    }

    let json: unknown;
    try {
      json = await response.json();
    } catch {
      throw new MailOpsError(
        response.status,
        "parse_error",
        `Failed to parse response body (HTTP ${response.status})`,
      );
    }

    const envelope = json as {
      data?: unknown;
      error?: {
        message: string;
        type: string;
        code?: string;
        statusCode: number;
      } | null;
    };

    if (!response.ok || envelope.error) {
      const apiErr = envelope.error ?? {
        message: `Unexpected error (HTTP ${response.status})`,
        type: "unknown_error",
        statusCode: response.status,
        code: undefined as string | undefined,
      };
      throw new MailOpsError(
        apiErr.statusCode ?? response.status,
        apiErr.type,
        apiErr.message,
        apiErr.code,
      );
    }

    return envelope.data as T;
  }
}
