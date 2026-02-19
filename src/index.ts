import { MailOpsError } from "./error.js";
import { HttpClient } from "./http.js";
import {
  AuthResource,
  EmailsResource,
  TemplatesResource,
  DomainsResource,
  ApiKeysResource,
  WebhooksResource,
  SuppressionsResource,
  ConsentsResource,
  EventsResource,
  AuditLogResource,
  AudiencesResource,
  BroadcastsResource,
  TopicsResource,
  AbTestsResource,
  ReputationResource,
  InboundResource,
  TeamResource,
  SettingsResource,
  DedicatedIpsResource,
} from "./resources.js";
import type { MailOpsConfig } from "./types.js";

const SDK_VERSION = "0.1.0";
const DEFAULT_TIMEOUT_MS = 30_000;

/**
 * MailOps SDK client.
 *
 * @example
 * ```ts
 * import { MailOps } from "mailops";
 *
 * const client = new MailOps({
 *   apiKey: "mo_live_...",
 *   baseUrl: "https://api.qonteo.fr",
 * });
 *
 * // Send an email
 * const { id } = await client.emails.send({
 *   from: "contact@qonteo.fr",
 *   to: ["user@example.com"],
 *   subject: "Hello!",
 *   html: "<h1>Hello World</h1>",
 * });
 *
 * // List templates
 * const templates = await client.templates.list();
 * ```
 */
export class MailOps {
  public readonly auth: AuthResource;
  public readonly emails: EmailsResource;
  public readonly templates: TemplatesResource;
  public readonly domains: DomainsResource;
  public readonly apiKeys: ApiKeysResource;
  public readonly webhooks: WebhooksResource;
  public readonly suppressions: SuppressionsResource;
  public readonly consents: ConsentsResource;
  public readonly events: EventsResource;
  public readonly auditLog: AuditLogResource;
  public readonly audiences: AudiencesResource;
  public readonly broadcasts: BroadcastsResource;
  public readonly topics: TopicsResource;
  public readonly abTests: AbTestsResource;
  public readonly reputation: ReputationResource;
  public readonly inbound: InboundResource;
  public readonly team: TeamResource;
  public readonly settings: SettingsResource;
  public readonly dedicatedIps: DedicatedIpsResource;

  constructor(config: MailOpsConfig) {
    if (!config.apiKey) {
      throw new MailOpsError(0, "configuration_error", "apiKey is required");
    }

    const http = new HttpClient(
      config.baseUrl ?? "https://api.mailops.fr",
      config.apiKey,
      config.timeoutMs ?? DEFAULT_TIMEOUT_MS,
      SDK_VERSION,
    );

    this.auth = new AuthResource(http);
    this.emails = new EmailsResource(http);
    this.templates = new TemplatesResource(http);
    this.domains = new DomainsResource(http);
    this.apiKeys = new ApiKeysResource(http);
    this.webhooks = new WebhooksResource(http);
    this.suppressions = new SuppressionsResource(http);
    this.consents = new ConsentsResource(http);
    this.events = new EventsResource(http);
    this.auditLog = new AuditLogResource(http);
    this.audiences = new AudiencesResource(http);
    this.broadcasts = new BroadcastsResource(http);
    this.topics = new TopicsResource(http);
    this.abTests = new AbTestsResource(http);
    this.reputation = new ReputationResource(http);
    this.inbound = new InboundResource(http);
    this.team = new TeamResource(http);
    this.settings = new SettingsResource(http);
    this.dedicatedIps = new DedicatedIpsResource(http);
  }
}

// Re-export everything
export { MailOpsError } from "./error.js";
export * from "./types.js";
export default MailOps;
