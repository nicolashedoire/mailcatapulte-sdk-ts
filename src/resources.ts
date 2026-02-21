import type { HttpClient } from "./http.js";
import type {
  PaginatedResult,
  PaginationParams,
  // Emails
  SendEmailParams,
  SendEmailResponse,
  EmailListParams,
  EmailListItem,
  EmailDetail,
  EmailStats,
  TimeseriesPoint,
  TimeseriesParams,
  RescheduleParams,
  // Templates
  CreateTemplateParams,
  UpdateTemplateParams,
  TemplateResponse,
  TemplateDetailResponse,
  TemplatePreviewParams,
  TemplatePreviewResponse,
  TemplateTestParams,
  // Domains
  CreateDomainParams,
  UpdateDomainParams,
  DomainResponse,
  DomainAnalytics,
  DomainAnalyticsTimeseriesParams,
  // Webhooks
  CreateWebhookParams,
  UpdateWebhookParams,
  WebhookResponse,
  WebhookCreatedResponse,
  WebhookDetailResponse,
  WebhookDelivery,
  WebhookDeliveryListParams,
  WebhookStats,
  // Suppressions
  CreateSuppressionParams,
  SuppressionResponse,
  SuppressionListParams,
  // Consents
  CreateConsentParams,
  ConsentResponse,
  ConsentRevokedResponse,
  ConsentListParams,
  // Events
  EventRecord,
  EventListParams,
  // Audit Log
  AuditLogEntry,
  AuditLogListParams,
  // Audiences
  CreateAudienceParams,
  AudienceResponse,
  AudienceDetailResponse,
  AddContactParams,
  ImportContactsParams,
  ImportContactsResponse,
  ContactResponse,
  ContactListParams,
  UpdateContactParams,
  // Broadcasts
  CreateBroadcastParams,
  BroadcastResponse,
  BroadcastDetailResponse,
  BroadcastListParams,
  // Topics
  CreateTopicParams,
  TopicResponse,
  TopicSubscribeParams,
  TopicPreferences,
  // A/B Tests
  CreateAbTestParams,
  AbTestResponse,
  AbTestListParams,
  // Reputation
  StartWarmupParams,
  WarmupSchedule,
  BlacklistCheckParams,
  BlacklistCheckResult,
  ReputationStats,
  // Inbound
  InboundEmail,
  InboundListParams,
  CreateInboundRuleParams,
  InboundRule,
  // Settings
  TenantSettings,
  SendingRegion,
  // Dedicated IPs
  AssignDedicatedIpParams,
  UpdateDedicatedIpParams,
  DedicatedIp,
} from "./types.js";

// ─── Emails ──────────────────────────────────────────────────────────────────

export class EmailsResource {
  constructor(private http: HttpClient) {}

  /** Send a single email. */
  send(params: SendEmailParams): Promise<SendEmailResponse> {
    return this.http.request<SendEmailResponse>({
      method: "POST",
      path: "/v1/emails",
      body: params,
    });
  }

  /** Send a batch of up to 100 emails at once. */
  sendBatch(emails: SendEmailParams[]): Promise<SendEmailResponse[]> {
    return this.http.request<SendEmailResponse[]>({
      method: "POST",
      path: "/v1/emails/batch",
      body: emails,
    });
  }

  /** List emails with optional filters and pagination. */
  list(params?: EmailListParams): Promise<PaginatedResult<EmailListItem>> {
    return this.http.request<PaginatedResult<EmailListItem>>({
      method: "GET",
      path: "/v1/emails",
      query: params as Record<string, string | number | undefined>,
    });
  }

  /** Get full details of a single email including its event timeline. */
  get(id: string): Promise<EmailDetail> {
    return this.http.request<EmailDetail>({
      method: "GET",
      path: `/v1/emails/${encodeURIComponent(id)}`,
    });
  }

  /** Retry a failed or bounced email. */
  retry(id: string): Promise<SendEmailResponse> {
    return this.http.request<SendEmailResponse>({
      method: "POST",
      path: `/v1/emails/${encodeURIComponent(id)}/retry`,
    });
  }

  /** Cancel a scheduled email. */
  cancel(id: string): Promise<{ id: string; status: string }> {
    return this.http.request<{ id: string; status: string }>({
      method: "POST",
      path: `/v1/emails/${encodeURIComponent(id)}/cancel`,
    });
  }

  /** Reschedule a queued email. */
  reschedule(id: string, params: RescheduleParams): Promise<{ id: string; scheduled_at: string }> {
    return this.http.request<{ id: string; scheduled_at: string }>({
      method: "PATCH",
      path: `/v1/emails/${encodeURIComponent(id)}/schedule`,
      body: params,
    });
  }

  /** Get aggregate email statistics. */
  stats(): Promise<EmailStats> {
    return this.http.request<EmailStats>({
      method: "GET",
      path: "/v1/emails/stats",
    });
  }

  /** Get time-series email statistics. */
  timeseries(params?: TimeseriesParams): Promise<TimeseriesPoint[]> {
    return this.http.request<TimeseriesPoint[]>({
      method: "GET",
      path: "/v1/emails/stats/timeseries",
      query: params as Record<string, string | number | undefined>,
    });
  }

  /** List scheduled emails. */
  scheduled(params?: PaginationParams): Promise<PaginatedResult<EmailListItem>> {
    return this.http.request<PaginatedResult<EmailListItem>>({
      method: "GET",
      path: "/v1/emails/scheduled",
      query: params as Record<string, string | number | undefined>,
    });
  }
}

// ─── Templates ───────────────────────────────────────────────────────────────

export class TemplatesResource {
  constructor(private http: HttpClient) {}

  create(params: CreateTemplateParams): Promise<TemplateResponse> {
    return this.http.request<TemplateResponse>({
      method: "POST",
      path: "/v1/templates",
      body: params,
    });
  }

  list(): Promise<TemplateResponse[]> {
    return this.http.request<TemplateResponse[]>({
      method: "GET",
      path: "/v1/templates",
    });
  }

  get(id: string): Promise<TemplateDetailResponse> {
    return this.http.request<TemplateDetailResponse>({
      method: "GET",
      path: `/v1/templates/${encodeURIComponent(id)}`,
    });
  }

  update(id: string, params: UpdateTemplateParams): Promise<TemplateResponse> {
    return this.http.request<TemplateResponse>({
      method: "PUT",
      path: `/v1/templates/${encodeURIComponent(id)}`,
      body: params,
    });
  }

  delete(id: string): Promise<{ id: string; deleted: boolean }> {
    return this.http.request<{ id: string; deleted: boolean }>({
      method: "DELETE",
      path: `/v1/templates/${encodeURIComponent(id)}`,
    });
  }

  /** Preview a rendered template with variables. */
  preview(id: string, params?: TemplatePreviewParams): Promise<TemplatePreviewResponse> {
    return this.http.request<TemplatePreviewResponse>({
      method: "POST",
      path: `/v1/templates/${encodeURIComponent(id)}/preview`,
      body: params,
    });
  }

  /** Send a test email using this template. */
  test(id: string, params: TemplateTestParams): Promise<SendEmailResponse> {
    return this.http.request<SendEmailResponse>({
      method: "POST",
      path: `/v1/templates/${encodeURIComponent(id)}/test`,
      body: params,
    });
  }
}

// ─── Domains ─────────────────────────────────────────────────────────────────

export class DomainsResource {
  constructor(private http: HttpClient) {}

  /** Add a new sending domain. Returns DNS records to configure. */
  create(params: CreateDomainParams): Promise<DomainResponse> {
    return this.http.request<DomainResponse>({
      method: "POST",
      path: "/v1/domains",
      body: params,
    });
  }

  list(): Promise<DomainResponse[]> {
    return this.http.request<DomainResponse[]>({
      method: "GET",
      path: "/v1/domains",
    });
  }

  get(id: string): Promise<DomainResponse> {
    return this.http.request<DomainResponse>({
      method: "GET",
      path: `/v1/domains/${encodeURIComponent(id)}`,
    });
  }

  /** Trigger DNS verification (checks SPF, DKIM, DMARC). */
  verify(id: string): Promise<DomainResponse> {
    return this.http.request<DomainResponse>({
      method: "POST",
      path: `/v1/domains/${encodeURIComponent(id)}/verify`,
    });
  }

  /** Update domain settings (tracking, return path). */
  update(id: string, params: UpdateDomainParams): Promise<DomainResponse> {
    return this.http.request<DomainResponse>({
      method: "PATCH",
      path: `/v1/domains/${encodeURIComponent(id)}`,
      body: params,
    });
  }

  delete(id: string): Promise<{ id: string; deleted: boolean }> {
    return this.http.request<{ id: string; deleted: boolean }>({
      method: "DELETE",
      path: `/v1/domains/${encodeURIComponent(id)}`,
    });
  }

  /** Get deliverability analytics for a domain. */
  analytics(id: string): Promise<DomainAnalytics> {
    return this.http.request<DomainAnalytics>({
      method: "GET",
      path: `/v1/domains/${encodeURIComponent(id)}/analytics`,
    });
  }

  /** Get time-series analytics for a domain. */
  analyticsTimeseries(id: string, params?: DomainAnalyticsTimeseriesParams): Promise<TimeseriesPoint[]> {
    return this.http.request<TimeseriesPoint[]>({
      method: "GET",
      path: `/v1/domains/${encodeURIComponent(id)}/analytics/timeseries`,
      query: params as Record<string, string | number | undefined>,
    });
  }
}

// ─── Webhooks ────────────────────────────────────────────────────────────────

export class WebhooksResource {
  constructor(private http: HttpClient) {}

  create(params: CreateWebhookParams): Promise<WebhookCreatedResponse> {
    return this.http.request<WebhookCreatedResponse>({
      method: "POST",
      path: "/v1/webhooks",
      body: params,
    });
  }

  list(): Promise<WebhookResponse[]> {
    return this.http.request<WebhookResponse[]>({
      method: "GET",
      path: "/v1/webhooks",
    });
  }

  get(id: string): Promise<WebhookDetailResponse> {
    return this.http.request<WebhookDetailResponse>({
      method: "GET",
      path: `/v1/webhooks/${encodeURIComponent(id)}`,
    });
  }

  update(id: string, params: UpdateWebhookParams): Promise<WebhookResponse> {
    return this.http.request<WebhookResponse>({
      method: "PUT",
      path: `/v1/webhooks/${encodeURIComponent(id)}`,
      body: params,
    });
  }

  delete(id: string): Promise<{ id: string; deleted: boolean }> {
    return this.http.request<{ id: string; deleted: boolean }>({
      method: "DELETE",
      path: `/v1/webhooks/${encodeURIComponent(id)}`,
    });
  }

  /** Get aggregate webhook delivery statistics. */
  stats(): Promise<WebhookStats> {
    return this.http.request<WebhookStats>({
      method: "GET",
      path: "/v1/webhooks/stats",
    });
  }

  /** List deliveries for a specific webhook. */
  deliveries(
    id: string,
    params?: WebhookDeliveryListParams,
  ): Promise<PaginatedResult<WebhookDelivery>> {
    return this.http.request<PaginatedResult<WebhookDelivery>>({
      method: "GET",
      path: `/v1/webhooks/${encodeURIComponent(id)}/deliveries`,
      query: params as Record<string, string | number | undefined>,
    });
  }

  /** Retry a failed webhook delivery. */
  retryDelivery(webhookId: string, deliveryId: string): Promise<{ id: string; retried: boolean }> {
    return this.http.request<{ id: string; retried: boolean }>({
      method: "POST",
      path: `/v1/webhooks/${encodeURIComponent(webhookId)}/deliveries/${encodeURIComponent(deliveryId)}/retry`,
    });
  }
}

// ─── Suppressions ────────────────────────────────────────────────────────────

export class SuppressionsResource {
  constructor(private http: HttpClient) {}

  create(
    params: CreateSuppressionParams,
  ): Promise<SuppressionResponse> {
    return this.http.request<SuppressionResponse>({
      method: "POST",
      path: "/v1/suppressions",
      body: params,
    });
  }

  list(
    params?: SuppressionListParams,
  ): Promise<PaginatedResult<SuppressionResponse>> {
    return this.http.request<PaginatedResult<SuppressionResponse>>({
      method: "GET",
      path: "/v1/suppressions",
      query: params as Record<string, string | number | undefined>,
    });
  }
}

// ─── Consents ────────────────────────────────────────────────────────────────

export class ConsentsResource {
  constructor(private http: HttpClient) {}

  create(params: CreateConsentParams): Promise<ConsentResponse> {
    return this.http.request<ConsentResponse>({
      method: "POST",
      path: "/v1/consents",
      body: params,
    });
  }

  list(
    params?: ConsentListParams,
  ): Promise<PaginatedResult<ConsentResponse>> {
    return this.http.request<PaginatedResult<ConsentResponse>>({
      method: "GET",
      path: "/v1/consents",
      query: params as Record<string, string | number | undefined>,
    });
  }

  revoke(id: string): Promise<ConsentRevokedResponse> {
    return this.http.request<ConsentRevokedResponse>({
      method: "DELETE",
      path: `/v1/consents/${encodeURIComponent(id)}`,
    });
  }
}

// ─── Events ──────────────────────────────────────────────────────────────────

export class EventsResource {
  constructor(private http: HttpClient) {}

  list(params?: EventListParams): Promise<PaginatedResult<EventRecord>> {
    return this.http.request<PaginatedResult<EventRecord>>({
      method: "GET",
      path: "/v1/events",
      query: params as Record<string, string | number | undefined>,
    });
  }
}

// ─── Audit Log ───────────────────────────────────────────────────────────────

export class AuditLogResource {
  constructor(private http: HttpClient) {}

  list(
    params?: AuditLogListParams,
  ): Promise<PaginatedResult<AuditLogEntry>> {
    return this.http.request<PaginatedResult<AuditLogEntry>>({
      method: "GET",
      path: "/v1/audit-log",
      query: params as Record<string, string | number | undefined>,
    });
  }
}

// ─── Audiences ──────────────────────────────────────────────────────────────

export class AudiencesResource {
  constructor(private http: HttpClient) {}

  /** Create a new audience (contact list). */
  create(params: CreateAudienceParams): Promise<AudienceResponse> {
    return this.http.request<AudienceResponse>({
      method: "POST",
      path: "/v1/audiences",
      body: params,
    });
  }

  /** List all audiences. */
  list(): Promise<AudienceResponse[]> {
    return this.http.request<AudienceResponse[]>({
      method: "GET",
      path: "/v1/audiences",
    });
  }

  /** Get audience details. */
  get(id: string): Promise<AudienceDetailResponse> {
    return this.http.request<AudienceDetailResponse>({
      method: "GET",
      path: `/v1/audiences/${encodeURIComponent(id)}`,
    });
  }

  /** Delete an audience and all its contacts. */
  delete(id: string): Promise<{ id: string; deleted: boolean }> {
    return this.http.request<{ id: string; deleted: boolean }>({
      method: "DELETE",
      path: `/v1/audiences/${encodeURIComponent(id)}`,
    });
  }

  /** Add a single contact to an audience. */
  addContact(audienceId: string, params: AddContactParams): Promise<ContactResponse> {
    return this.http.request<ContactResponse>({
      method: "POST",
      path: `/v1/audiences/${encodeURIComponent(audienceId)}/contacts`,
      body: params,
    });
  }

  /** Bulk import contacts (up to 1000). */
  importContacts(audienceId: string, params: ImportContactsParams): Promise<ImportContactsResponse> {
    return this.http.request<ImportContactsResponse>({
      method: "POST",
      path: `/v1/audiences/${encodeURIComponent(audienceId)}/contacts/import`,
      body: params,
    });
  }

  /** List contacts in an audience. */
  listContacts(audienceId: string, params?: ContactListParams): Promise<PaginatedResult<ContactResponse>> {
    return this.http.request<PaginatedResult<ContactResponse>>({
      method: "GET",
      path: `/v1/audiences/${encodeURIComponent(audienceId)}/contacts`,
      query: params as Record<string, string | number | undefined>,
    });
  }

  /** Export contacts as CSV. Returns CSV string. */
  exportContacts(audienceId: string): Promise<string> {
    return this.http.request<string>({
      method: "GET",
      path: `/v1/audiences/${encodeURIComponent(audienceId)}/contacts/export`,
    });
  }

  /** Search/filter contacts in an audience. */
  searchContacts(audienceId: string, params?: ContactListParams): Promise<PaginatedResult<ContactResponse>> {
    return this.http.request<PaginatedResult<ContactResponse>>({
      method: "GET",
      path: `/v1/audiences/${encodeURIComponent(audienceId)}/contacts/search`,
      query: params as Record<string, string | number | undefined>,
    });
  }

  /** Update a contact's properties. */
  updateContact(audienceId: string, contactId: string, params: UpdateContactParams): Promise<ContactResponse> {
    return this.http.request<ContactResponse>({
      method: "PATCH",
      path: `/v1/audiences/${encodeURIComponent(audienceId)}/contacts/${encodeURIComponent(contactId)}`,
      body: params,
    });
  }

  /** Remove a contact from an audience. */
  deleteContact(audienceId: string, contactId: string): Promise<{ id: string; deleted: boolean }> {
    return this.http.request<{ id: string; deleted: boolean }>({
      method: "DELETE",
      path: `/v1/audiences/${encodeURIComponent(audienceId)}/contacts/${encodeURIComponent(contactId)}`,
    });
  }
}

// ─── Broadcasts ─────────────────────────────────────────────────────────────

export class BroadcastsResource {
  constructor(private http: HttpClient) {}

  /** Create a new broadcast. */
  create(params: CreateBroadcastParams): Promise<BroadcastResponse> {
    return this.http.request<BroadcastResponse>({
      method: "POST",
      path: "/v1/broadcasts",
      body: params,
    });
  }

  /** List broadcasts with pagination. */
  list(params?: BroadcastListParams): Promise<PaginatedResult<BroadcastResponse>> {
    return this.http.request<PaginatedResult<BroadcastResponse>>({
      method: "GET",
      path: "/v1/broadcasts",
      query: params as Record<string, string | number | undefined>,
    });
  }

  /** Get broadcast details with stats. */
  get(id: string): Promise<BroadcastDetailResponse> {
    return this.http.request<BroadcastDetailResponse>({
      method: "GET",
      path: `/v1/broadcasts/${encodeURIComponent(id)}`,
    });
  }

  /** Send a broadcast now. */
  send(id: string): Promise<BroadcastResponse> {
    return this.http.request<BroadcastResponse>({
      method: "POST",
      path: `/v1/broadcasts/${encodeURIComponent(id)}/send`,
    });
  }

  /** Cancel or delete a broadcast. */
  delete(id: string): Promise<{ id: string; deleted: boolean }> {
    return this.http.request<{ id: string; deleted: boolean }>({
      method: "DELETE",
      path: `/v1/broadcasts/${encodeURIComponent(id)}`,
    });
  }
}

// ─── Topics ─────────────────────────────────────────────────────────────────

export class TopicsResource {
  constructor(private http: HttpClient) {}

  /** Create an unsubscribe topic. */
  create(params: CreateTopicParams): Promise<TopicResponse> {
    return this.http.request<TopicResponse>({
      method: "POST",
      path: "/v1/topics",
      body: params,
    });
  }

  /** List all topics. */
  list(): Promise<TopicResponse[]> {
    return this.http.request<TopicResponse[]>({
      method: "GET",
      path: "/v1/topics",
    });
  }

  /** Delete a topic. */
  delete(id: string): Promise<{ id: string; deleted: boolean }> {
    return this.http.request<{ id: string; deleted: boolean }>({
      method: "DELETE",
      path: `/v1/topics/${encodeURIComponent(id)}`,
    });
  }

  /** Subscribe an email to a topic. */
  subscribe(id: string, params: TopicSubscribeParams): Promise<{ message: string }> {
    return this.http.request<{ message: string }>({
      method: "POST",
      path: `/v1/topics/${encodeURIComponent(id)}/subscribe`,
      body: params,
    });
  }

  /** Unsubscribe an email from a topic. */
  unsubscribe(id: string, params: TopicSubscribeParams): Promise<{ message: string }> {
    return this.http.request<{ message: string }>({
      method: "POST",
      path: `/v1/topics/${encodeURIComponent(id)}/unsubscribe`,
      body: params,
    });
  }

  /** Get topic preferences for an email address. */
  preferences(email: string): Promise<TopicPreferences> {
    return this.http.request<TopicPreferences>({
      method: "GET",
      path: `/v1/topics/preferences/${encodeURIComponent(email)}`,
    });
  }
}

// ─── A/B Tests ──────────────────────────────────────────────────────────────

export class AbTestsResource {
  constructor(private http: HttpClient) {}

  /** Create an A/B test. */
  create(params: CreateAbTestParams): Promise<AbTestResponse> {
    return this.http.request<AbTestResponse>({
      method: "POST",
      path: "/v1/ab-tests",
      body: params,
    });
  }

  /** List A/B tests. */
  list(params?: AbTestListParams): Promise<PaginatedResult<AbTestResponse>> {
    return this.http.request<PaginatedResult<AbTestResponse>>({
      method: "GET",
      path: "/v1/ab-tests",
      query: params as Record<string, string | number | undefined>,
    });
  }

  /** Get A/B test with variant statistics. */
  get(id: string): Promise<AbTestResponse> {
    return this.http.request<AbTestResponse>({
      method: "GET",
      path: `/v1/ab-tests/${encodeURIComponent(id)}`,
    });
  }

  /** Delete an A/B test (draft only). */
  delete(id: string): Promise<{ id: string; deleted: boolean }> {
    return this.http.request<{ id: string; deleted: boolean }>({
      method: "DELETE",
      path: `/v1/ab-tests/${encodeURIComponent(id)}`,
    });
  }
}

// ─── Reputation ─────────────────────────────────────────────────────────────

export class ReputationResource {
  constructor(private http: HttpClient) {}

  /** Start an IP warmup schedule. */
  startWarmup(params: StartWarmupParams): Promise<WarmupSchedule> {
    return this.http.request<WarmupSchedule>({
      method: "POST",
      path: "/v1/reputation/warmup",
      body: params,
    });
  }

  /** List warmup schedules. */
  listWarmups(): Promise<WarmupSchedule[]> {
    return this.http.request<WarmupSchedule[]>({
      method: "GET",
      path: "/v1/reputation/warmup",
    });
  }

  /** Get warmup schedule details. */
  getWarmup(id: string): Promise<WarmupSchedule> {
    return this.http.request<WarmupSchedule>({
      method: "GET",
      path: `/v1/reputation/warmup/${encodeURIComponent(id)}`,
    });
  }

  /** Cancel or pause a warmup schedule. */
  cancelWarmup(id: string): Promise<{ id: string; cancelled: boolean }> {
    return this.http.request<{ id: string; cancelled: boolean }>({
      method: "DELETE",
      path: `/v1/reputation/warmup/${encodeURIComponent(id)}`,
    });
  }

  /** Run an on-demand blacklist check. */
  checkBlacklist(params: BlacklistCheckParams): Promise<BlacklistCheckResult> {
    return this.http.request<BlacklistCheckResult>({
      method: "POST",
      path: "/v1/reputation/blacklist/check",
      body: params,
    });
  }

  /** Get history of blacklist checks. */
  blacklistHistory(): Promise<BlacklistCheckResult[]> {
    return this.http.request<BlacklistCheckResult[]>({
      method: "GET",
      path: "/v1/reputation/blacklist",
    });
  }

  /** Submit an ARF complaint report. */
  submitComplaint(body: Record<string, unknown>): Promise<{ message: string }> {
    return this.http.request<{ message: string }>({
      method: "POST",
      path: "/v1/reputation/fbl",
      body,
    });
  }

  /** Get reputation health overview. */
  stats(): Promise<ReputationStats> {
    return this.http.request<ReputationStats>({
      method: "GET",
      path: "/v1/reputation/stats",
    });
  }
}

// ─── Inbound ────────────────────────────────────────────────────────────────

export class InboundResource {
  constructor(private http: HttpClient) {}

  /** List received inbound emails. */
  list(params?: InboundListParams): Promise<PaginatedResult<InboundEmail>> {
    return this.http.request<PaginatedResult<InboundEmail>>({
      method: "GET",
      path: "/v1/inbound",
      query: params as Record<string, string | number | undefined>,
    });
  }

  /** Get inbound email detail. */
  get(id: string): Promise<InboundEmail> {
    return this.http.request<InboundEmail>({
      method: "GET",
      path: `/v1/inbound/${encodeURIComponent(id)}`,
    });
  }

  /** Create an inbound routing rule. */
  createRule(params: CreateInboundRuleParams): Promise<InboundRule> {
    return this.http.request<InboundRule>({
      method: "POST",
      path: "/v1/inbound/rules",
      body: params,
    });
  }

  /** List inbound routing rules. */
  listRules(): Promise<InboundRule[]> {
    return this.http.request<InboundRule[]>({
      method: "GET",
      path: "/v1/inbound/rules",
    });
  }

  /** Delete an inbound routing rule. */
  deleteRule(id: string): Promise<{ id: string; deleted: boolean }> {
    return this.http.request<{ id: string; deleted: boolean }>({
      method: "DELETE",
      path: `/v1/inbound/rules/${encodeURIComponent(id)}`,
    });
  }
}

// ─── Settings (read-only) ───────────────────────────────────────────────────

export class SettingsResource {
  constructor(private http: HttpClient) {}

  /** Get tenant settings. */
  get(): Promise<TenantSettings> {
    return this.http.request<TenantSettings>({
      method: "GET",
      path: "/v1/settings",
    });
  }

  /** List available sending regions. */
  regions(): Promise<SendingRegion[]> {
    return this.http.request<SendingRegion[]>({
      method: "GET",
      path: "/v1/settings/regions",
    });
  }
}

// ─── Dedicated IPs ──────────────────────────────────────────────────────────

export class DedicatedIpsResource {
  constructor(private http: HttpClient) {}

  /** Assign a dedicated IP. */
  create(params: AssignDedicatedIpParams): Promise<DedicatedIp> {
    return this.http.request<DedicatedIp>({
      method: "POST",
      path: "/v1/dedicated-ips",
      body: params,
    });
  }

  /** List all dedicated IPs. */
  list(): Promise<DedicatedIp[]> {
    return this.http.request<DedicatedIp[]>({
      method: "GET",
      path: "/v1/dedicated-ips",
    });
  }

  /** Get dedicated IP details. */
  get(id: string): Promise<DedicatedIp> {
    return this.http.request<DedicatedIp>({
      method: "GET",
      path: `/v1/dedicated-ips/${encodeURIComponent(id)}`,
    });
  }

  /** Update dedicated IP settings. */
  update(id: string, params: UpdateDedicatedIpParams): Promise<DedicatedIp> {
    return this.http.request<DedicatedIp>({
      method: "PATCH",
      path: `/v1/dedicated-ips/${encodeURIComponent(id)}`,
      body: params,
    });
  }

  /** Start IP warmup. */
  startWarmup(id: string): Promise<DedicatedIp> {
    return this.http.request<DedicatedIp>({
      method: "POST",
      path: `/v1/dedicated-ips/${encodeURIComponent(id)}/warmup/start`,
    });
  }

  /** Pause IP warmup. */
  pauseWarmup(id: string): Promise<DedicatedIp> {
    return this.http.request<DedicatedIp>({
      method: "POST",
      path: `/v1/dedicated-ips/${encodeURIComponent(id)}/warmup/pause`,
    });
  }

  /** Remove a dedicated IP. */
  delete(id: string): Promise<{ id: string; deleted: boolean }> {
    return this.http.request<{ id: string; deleted: boolean }>({
      method: "DELETE",
      path: `/v1/dedicated-ips/${encodeURIComponent(id)}`,
    });
  }
}
