// ─── Shared Types ───────────────────────────────────────────────────────────

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: Pagination;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ─── Email Types ─────────────────────────────────────────────────────────────

export interface Attachment {
  filename: string;
  /** Base64-encoded content. */
  content: string;
  content_type?: string;
}

export interface SendEmailParams {
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  reply_to?: string;
  subject: string;
  html?: string;
  text?: string;
  template_id?: string;
  template_vars?: Record<string, string>;
  tags?: string[];
  metadata?: Record<string, string>;
  headers?: Record<string, string>;
  attachments?: Attachment[];
  priority?: "high" | "normal" | "low";
  /** ISO 8601 datetime for scheduled sending. */
  scheduled_at?: string;
}

export interface SendEmailResponse {
  id: string;
  status: string;
}

export interface EmailListParams extends PaginationParams {
  status?: string;
  search?: string;
  to?: string;
  tag?: string;
  from_date?: string;
  to_date?: string;
}

export interface EmailListItem {
  id: string;
  from: string;
  to: string[];
  subject: string;
  status: string;
  tags: string[];
  createdAt: string;
  sentAt: string | null;
  deliveredAt: string | null;
}

export interface EmailEvent {
  eventType: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface EmailDetail {
  id: string;
  from: string;
  to: string[];
  cc: string[];
  bcc: string[];
  reply_to: string | null;
  subject: string;
  html: string | null;
  text: string | null;
  status: string;
  tags: string[];
  metadata: Record<string, string>;
  headers: Record<string, string>;
  priority: number;
  message_id: string | null;
  smtp_response: string | null;
  attempts: number;
  scheduled_at: string | null;
  sent_at: string | null;
  delivered_at: string | null;
  created_at: string;
  events: EmailEvent[];
}

export interface EmailStats {
  queued: number;
  sending: number;
  delivered: number;
  bounced: number;
  failed: number;
  total: number;
  deliveryRate: number;
  opens: number;
  clicks: number;
  openRate: number;
  clickRate: number;
}

export interface TimeseriesPoint {
  date: string;
  sent: number;
  delivered: number;
  bounced: number;
  failed: number;
  opened?: number;
  clicked?: number;
}

export interface TimeseriesParams {
  from_date?: string;
  to_date?: string;
  interval?: "hour" | "day" | "week";
}

export interface RescheduleParams {
  scheduled_at: string;
}

// ─── Template Types ──────────────────────────────────────────────────────────

export interface CreateTemplateParams {
  name: string;
  slug: string;
  subject?: string;
  html_content: string;
  text_content?: string;
  variables?: string[];
  engine?: "handlebars" | "mjml";
}

export interface UpdateTemplateParams {
  name?: string;
  slug?: string;
  subject?: string;
  html_content?: string;
  text_content?: string;
  variables?: string[];
  engine?: "handlebars" | "mjml";
}

export interface TemplateResponse {
  id: string;
  name: string;
  slug: string;
  subject: string | null;
  engine: string;
  variables: string[];
  version: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateDetailResponse extends TemplateResponse {
  htmlContent: string;
  textContent: string | null;
}

export interface TemplatePreviewParams {
  variables?: Record<string, string>;
}

export interface TemplatePreviewResponse {
  html: string;
  text: string | null;
  subject: string | null;
}

export interface TemplateTestParams {
  to: string;
  variables?: Record<string, string>;
}

// ─── Domain Types ────────────────────────────────────────────────────────────

export interface CreateDomainParams {
  domain: string;
  return_path?: string;
}

export interface UpdateDomainParams {
  tracking_enabled?: boolean;
  return_path?: string;
}

export interface DnsRecord {
  type: "TXT" | "CNAME" | "MX";
  name: string;
  value: string;
  purpose: "spf" | "dkim" | "dmarc" | "ownership";
}

export interface DomainResponse {
  id: string;
  domain: string;
  status: string;
  spfVerified: boolean;
  dkimVerified: boolean;
  dmarcVerified: boolean;
  dnsRecords: DnsRecord[];
  verifiedAt: string | null;
  createdAt: string;
}

export interface DomainAnalytics {
  sent: number;
  delivered: number;
  bounced: number;
  complained: number;
  deliveryRate: number;
  bounceRate: number;
  complaintRate: number;
}

export interface DomainAnalyticsTimeseriesParams {
  from_date?: string;
  to_date?: string;
  interval?: "hour" | "day" | "week";
}

// ─── Webhook Types ───────────────────────────────────────────────────────────

export type WebhookEventType =
  | "email.queued"
  | "email.sending"
  | "email.sent"
  | "email.delivered"
  | "email.bounced"
  | "email.soft_bounced"
  | "email.delayed"
  | "email.failed"
  | "email.opened"
  | "email.clicked"
  | "email.complained"
  | "email.unsubscribed"
  | "domain.verified"
  | "domain.verification_failed";

export interface CreateWebhookParams {
  url: string;
  events: (WebhookEventType | string)[];
  metadata?: Record<string, string>;
}

export interface UpdateWebhookParams {
  url?: string;
  events?: (WebhookEventType | string)[];
  active?: boolean;
  metadata?: Record<string, string>;
}

export interface WebhookResponse {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface WebhookCreatedResponse extends WebhookResponse {
  secret: string;
}

export interface WebhookDelivery {
  id: string;
  eventType: string;
  payload?: Record<string, unknown>;
  responseStatus: number | null;
  responseBody?: string | null;
  attempt: number;
  deliveredAt: string | null;
  failedAt: string | null;
  createdAt: string;
}

export interface WebhookDetailResponse extends WebhookResponse {
  metadata: Record<string, string>;
  recentDeliveries: WebhookDelivery[];
}

export interface WebhookDeliveryListParams extends PaginationParams {
  status?: "delivered" | "failed";
  event_type?: string;
}

export interface WebhookStats {
  totalDeliveries: number;
  successCount: number;
  failedCount: number;
  successRate: number;
}

// ─── Suppression Types ───────────────────────────────────────────────────────

export type SuppressionReason =
  | "hard_bounce"
  | "complaint"
  | "unsubscribe"
  | "manual";

export interface CreateSuppressionParams {
  email: string;
  reason?: SuppressionReason;
}

export interface SuppressionResponse {
  id: string;
  email: string;
  reason: string;
  createdAt: string;
}

export interface SuppressionListParams extends PaginationParams {
  reason?: SuppressionReason;
}

// ─── Consent Types ───────────────────────────────────────────────────────────

export type ConsentType = "email_sending" | "tracking" | "marketing";

export interface CreateConsentParams {
  email: string;
  consent_type: ConsentType;
  granted: boolean;
  ip_address?: string;
  user_agent?: string;
  proof_url?: string;
}

export interface ConsentResponse {
  id: string;
  email: string;
  consentType: string;
  granted: boolean;
  grantedAt: string | null;
  revokedAt: string | null;
  createdAt: string;
}

export interface ConsentRevokedResponse {
  id: string;
  email: string;
  granted: boolean;
  revokedAt: string;
}

export interface ConsentListParams extends PaginationParams {
  email?: string;
  consent_type?: ConsentType;
}

// ─── Event Types ─────────────────────────────────────────────────────────────

export interface EventRecord {
  id: string;
  emailId: string;
  eventType: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

export interface EventListParams extends PaginationParams {
  event_type?: string;
  email_id?: string;
}

// ─── Audit Log Types ─────────────────────────────────────────────────────────

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  details: Record<string, unknown>;
  ipAddress: string | null;
  createdAt: string;
}

export interface AuditLogListParams extends PaginationParams {
  action?: string;
  resource_type?: string;
  resource_id?: string;
}

// ─── Audience Types ─────────────────────────────────────────────────────────

export interface CreateAudienceParams {
  name: string;
  description?: string;
}

export interface AudienceResponse {
  id: string;
  name: string;
  description: string | null;
  contactCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AudienceDetailResponse extends AudienceResponse {
  metadata?: Record<string, unknown>;
}

export interface AddContactParams {
  email: string;
  first_name?: string;
  last_name?: string;
  properties?: Record<string, string>;
}

export interface ImportContactsParams {
  contacts: AddContactParams[];
}

export interface ImportContactsResponse {
  imported: number;
  skipped: number;
  errors: Array<{ email: string; reason: string }>;
}

export interface ContactResponse {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  properties: Record<string, string>;
  subscribedAt: string;
  unsubscribedAt: string | null;
  createdAt: string;
}

export interface ContactListParams extends PaginationParams {
  search?: string;
}

export interface UpdateContactParams {
  first_name?: string;
  last_name?: string;
  properties?: Record<string, string>;
}

// ─── Broadcast Types ────────────────────────────────────────────────────────

export interface CreateBroadcastParams {
  name: string;
  audience_id: string;
  subject: string;
  from: string;
  html?: string;
  text?: string;
  template_id?: string;
  template_vars?: Record<string, string>;
  scheduled_at?: string;
}

export interface BroadcastResponse {
  id: string;
  name: string;
  audienceId: string;
  subject: string;
  from: string;
  status: string;
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  scheduledAt: string | null;
  sentAt: string | null;
  createdAt: string;
}

export interface BroadcastDetailResponse extends BroadcastResponse {
  html: string | null;
  text: string | null;
  templateId: string | null;
}

export interface BroadcastListParams extends PaginationParams {
  status?: string;
}

// ─── Topic Types ────────────────────────────────────────────────────────────

export interface CreateTopicParams {
  name: string;
  description?: string;
}

export interface TopicResponse {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface TopicSubscribeParams {
  email: string;
}

export interface TopicPreferences {
  email: string;
  topics: Array<{
    id: string;
    name: string;
    subscribed: boolean;
  }>;
}

// ─── A/B Test Types ─────────────────────────────────────────────────────────

export interface CreateAbTestParams {
  name: string;
  audience_id: string;
  from: string;
  variants: Array<{
    name: string;
    subject: string;
    html?: string;
    text?: string;
    template_id?: string;
    weight: number;
  }>;
  sample_size?: number;
  winning_metric?: "open_rate" | "click_rate";
  duration_hours?: number;
}

export interface AbTestVariant {
  id: string;
  name: string;
  subject: string;
  weight: number;
  sentCount: number;
  openedCount: number;
  clickedCount: number;
  openRate: number;
  clickRate: number;
}

export interface AbTestResponse {
  id: string;
  name: string;
  audienceId: string;
  status: string;
  variants: AbTestVariant[];
  winnerId: string | null;
  createdAt: string;
}

export interface AbTestListParams extends PaginationParams {
  status?: string;
}

// ─── Reputation Types ───────────────────────────────────────────────────────

export interface StartWarmupParams {
  ip_address: string;
  daily_limit_start?: number;
  daily_limit_max?: number;
  increment_percent?: number;
}

export interface WarmupSchedule {
  id: string;
  ipAddress: string;
  currentDayLimit: number;
  maxDayLimit: number;
  day: number;
  status: string;
  createdAt: string;
}

export interface BlacklistCheckParams {
  ip_address: string;
}

export interface BlacklistCheckResult {
  ip: string;
  listed: boolean;
  lists: Array<{
    name: string;
    listed: boolean;
    reason?: string;
  }>;
  checkedAt: string;
}

export interface ReputationStats {
  deliveryRate: number;
  bounceRate: number;
  complaintRate: number;
  blacklistStatus: string;
  warmupActive: boolean;
}

// ─── Inbound Types ──────────────────────────────────────────────────────────

export interface InboundEmail {
  id: string;
  from: string;
  to: string[];
  subject: string;
  html: string | null;
  text: string | null;
  headers: Record<string, string>;
  receivedAt: string;
}

export interface InboundListParams extends PaginationParams {
  from?: string;
  to?: string;
}

export interface CreateInboundRuleParams {
  match_field: "from" | "to" | "subject";
  match_value: string;
  action: "forward" | "webhook" | "drop";
  action_value?: string;
}

export interface InboundRule {
  id: string;
  matchField: string;
  matchValue: string;
  action: string;
  actionValue: string | null;
  createdAt: string;
}

// ─── Settings Types ─────────────────────────────────────────────────────────

export interface TenantSettings {
  id: string;
  name: string;
  sendingRegion: string | null;
  [key: string]: unknown;
}

export interface SendingRegion {
  id: string;
  name: string;
  location: string;
}

// ─── Dedicated IP Types ─────────────────────────────────────────────────────

export interface AssignDedicatedIpParams {
  ip_address: string;
  label?: string;
}

export interface UpdateDedicatedIpParams {
  label?: string;
}

export interface DedicatedIp {
  id: string;
  ipAddress: string;
  label: string | null;
  warmupStatus: string;
  warmupDay: number;
  assignedAt: string;
}

// ─── SDK Configuration ───────────────────────────────────────────────────────

export interface MailCatapulteConfig {
  /** API key (starts with `mc_live_` or `mc_test_`). */
  apiKey: string;
  /** Base URL of the MailCatapulte API. Defaults to `https://api.mailcatapulte.com`. */
  baseUrl?: string;
  /** Request timeout in milliseconds. Defaults to 30 000. */
  timeoutMs?: number;
}
