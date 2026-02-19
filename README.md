# mailcatapulte

Official TypeScript SDK for [MailCatapulte](https://github.com/nicolashedoire/mailcatapulte) — the self-hosted transactional email platform.

- Zero dependencies (uses native `fetch`)
- Works in Node.js 18+, Bun, Deno, Cloudflare Workers
- Full TypeScript types
- ESM and CommonJS support
- **19 resources** covering 100% of the API

## Installation

```bash
npm install mailcatapulte
```

## Quick Start

```typescript
import { MailCatapulte } from "mailcatapulte";

const client = new MailCatapulte({
  apiKey: "mo_live_...",
  baseUrl: "https://api.yourdomain.com",
});

// Send an email
const { id } = await client.emails.send({
  from: "contact@yourdomain.com",
  to: ["user@example.com"],
  subject: "Welcome!",
  html: "<h1>Welcome aboard!</h1><p>Thanks for signing up.</p>",
});

console.log("Email queued:", id);
```

## Configuration

```typescript
const client = new MailCatapulte({
  apiKey: "mo_live_...",          // Required — from the dashboard > API Keys
  baseUrl: "https://api.x.com",  // Default: https://api.mailcatapulte.fr
  timeoutMs: 10_000,             // Default: 30000
});
```

## API Reference

### Auth

```typescript
// Register
const { token, user } = await client.auth.register({
  email: "admin@example.com",
  password: "securePassword",
  name: "Admin",
});

// Login
const { token } = await client.auth.login({
  email: "admin@example.com",
  password: "securePassword",
  totp_code: "123456", // if 2FA is enabled
});

// Get current user
const profile = await client.auth.me();

// 2FA setup
const { secret, qrCode } = await client.auth.setupTwoFactor();
await client.auth.verifyTwoFactor({ code: "123456" });
await client.auth.disableTwoFactor({ code: "123456" });

// Password reset
await client.auth.forgotPassword({ email: "user@example.com" });
await client.auth.resetPassword({ token: "...", password: "newPass" });
```

### Emails

```typescript
// Send a single email
const { id } = await client.emails.send({
  from: "hello@yourdomain.com",
  to: ["user@example.com"],
  cc: ["manager@example.com"],
  subject: "Invoice #1234",
  html: "<h1>Your invoice</h1>",
  text: "Your invoice",
  tags: ["invoice", "billing"],
  metadata: { orderId: "1234" },
  reply_to: "support@yourdomain.com",
  scheduled_at: "2026-03-01T09:00:00Z",
  attachments: [{
    filename: "invoice.pdf",
    content: "base64encodedcontent...",
    content_type: "application/pdf",
  }],
});

// Send batch (up to 100)
const results = await client.emails.sendBatch([
  { from: "hello@x.com", to: ["a@b.com"], subject: "Hi A", html: "..." },
  { from: "hello@x.com", to: ["c@d.com"], subject: "Hi C", html: "..." },
]);

// List emails
const { data, pagination } = await client.emails.list({
  page: 1, limit: 20, status: "delivered",
});

// Get email details
const email = await client.emails.get("email_id");

// Retry a failed email
await client.emails.retry("email_id");

// Cancel a scheduled email
await client.emails.cancel("email_id");

// Reschedule
await client.emails.reschedule("email_id", {
  scheduled_at: "2026-04-01T09:00:00Z",
});

// Get stats
const stats = await client.emails.stats();

// Time-series stats
const timeseries = await client.emails.timeseries({
  from_date: "2026-01-01", to_date: "2026-02-01", interval: "day",
});

// List scheduled emails
const scheduled = await client.emails.scheduled({ page: 1, limit: 20 });
```

### Send with a template

```typescript
await client.emails.send({
  from: "hello@yourdomain.com",
  to: ["user@example.com"],
  subject: "Welcome {{name}}!",
  template_id: "tmpl_welcome",
  template_vars: { name: "John", company: "Acme" },
});
```

### Templates

```typescript
// Create
const template = await client.templates.create({
  name: "Welcome Email",
  slug: "welcome",
  subject: "Welcome {{name}}!",
  html_content: "<h1>Hello {{name}}</h1>",
  variables: ["name"],
  engine: "handlebars",
});

// List all
const templates = await client.templates.list();

// Get by ID
const detail = await client.templates.get("template_id");

// Update
await client.templates.update("template_id", {
  html_content: "<h1>Updated: Hello {{name}}</h1>",
});

// Delete
await client.templates.delete("template_id");

// Preview rendered template
const preview = await client.templates.preview("template_id", {
  variables: { name: "John" },
});

// Send test email
await client.templates.test("template_id", {
  to: "test@example.com",
  variables: { name: "John" },
});
```

### Domains

```typescript
// Add a domain
const domain = await client.domains.create({ domain: "yourdomain.com" });
// domain.dnsRecords contains the TXT records to add to your DNS

// List domains
const domains = await client.domains.list();

// Verify DNS records
const verified = await client.domains.verify("domain_id");

// Update settings
await client.domains.update("domain_id", { tracking_enabled: true });

// Get analytics
const analytics = await client.domains.analytics("domain_id");

// Time-series analytics
const ts = await client.domains.analyticsTimeseries("domain_id", {
  from_date: "2026-01-01", interval: "day",
});

// Delete
await client.domains.delete("domain_id");
```

### API Keys

```typescript
// Create (the full key is only returned once!)
const { key, id } = await client.apiKeys.create({
  name: "Production Key",
  permissions: ["send", "templates"],
  expires_at: "2027-01-01T00:00:00Z",
});

// List
const keys = await client.apiKeys.list();

// Revoke
await client.apiKeys.revoke("key_id");
```

### Webhooks

```typescript
// Create
const { secret } = await client.webhooks.create({
  url: "https://yourdomain.com/webhooks/mailcatapulte",
  events: ["email.delivered", "email.bounced", "email.opened"],
});

// List
const webhooks = await client.webhooks.list();

// Get with recent deliveries
const webhook = await client.webhooks.get("webhook_id");

// Update
await client.webhooks.update("webhook_id", { active: false });

// Delete
await client.webhooks.delete("webhook_id");

// Global delivery stats
const stats = await client.webhooks.stats();

// List deliveries
const deliveries = await client.webhooks.deliveries("webhook_id", {
  status: "failed", page: 1,
});

// Retry a failed delivery
await client.webhooks.retryDelivery("webhook_id", "delivery_id");
```

### Audiences & Contacts

```typescript
// Create audience
const audience = await client.audiences.create({
  name: "Newsletter subscribers",
  description: "All newsletter subscribers",
});

// List audiences
const audiences = await client.audiences.list();

// Add contact
const contact = await client.audiences.addContact("audience_id", {
  email: "user@example.com",
  first_name: "John",
  last_name: "Doe",
  properties: { company: "Acme" },
});

// Bulk import (up to 1000)
const result = await client.audiences.importContacts("audience_id", {
  contacts: [
    { email: "a@b.com", first_name: "Alice" },
    { email: "c@d.com", first_name: "Bob" },
  ],
});

// List contacts
const { data } = await client.audiences.listContacts("audience_id", {
  page: 1, limit: 50,
});

// Search contacts
const results = await client.audiences.searchContacts("audience_id", {
  search: "john",
});

// Update contact
await client.audiences.updateContact("audience_id", "contact_id", {
  first_name: "Jane",
});

// Export as CSV
const csv = await client.audiences.exportContacts("audience_id");

// Delete contact
await client.audiences.deleteContact("audience_id", "contact_id");

// Delete audience
await client.audiences.delete("audience_id");
```

### Broadcasts

```typescript
// Create broadcast
const broadcast = await client.broadcasts.create({
  name: "February Newsletter",
  audience_id: "audience_id",
  from: "news@yourdomain.com",
  subject: "Our February Newsletter",
  html: "<h1>Newsletter</h1><p>Latest updates...</p>",
});

// List broadcasts
const { data } = await client.broadcasts.list({ page: 1 });

// Get details
const detail = await client.broadcasts.get("broadcast_id");

// Send now
await client.broadcasts.send("broadcast_id");

// Delete
await client.broadcasts.delete("broadcast_id");
```

### Topics (Unsubscribe Preferences)

```typescript
// Create topic
const topic = await client.topics.create({
  name: "Marketing",
  description: "Marketing and promotional emails",
});

// List topics
const topics = await client.topics.list();

// Subscribe email to topic
await client.topics.subscribe("topic_id", { email: "user@example.com" });

// Unsubscribe
await client.topics.unsubscribe("topic_id", { email: "user@example.com" });

// Get preferences for an email
const prefs = await client.topics.preferences("user@example.com");

// Delete topic
await client.topics.delete("topic_id");
```

### A/B Tests

```typescript
// Create A/B test
const test = await client.abTests.create({
  name: "Subject line test",
  audience_id: "audience_id",
  from: "hello@yourdomain.com",
  variants: [
    { name: "Variant A", subject: "Hello!", weight: 50, html: "<h1>A</h1>" },
    { name: "Variant B", subject: "Hey there!", weight: 50, html: "<h1>B</h1>" },
  ],
  winning_metric: "open_rate",
  duration_hours: 4,
});

// List
const { data } = await client.abTests.list();

// Get with variant stats
const detail = await client.abTests.get("test_id");

// Delete (draft only)
await client.abTests.delete("test_id");
```

### Suppressions

```typescript
// Add to suppression list
await client.suppressions.create({
  email: "bounced@example.com",
  reason: "hard_bounce",
});

// List
const { data } = await client.suppressions.list({ reason: "complaint" });

// Remove
await client.suppressions.delete("suppression_id");
```

### Consents (GDPR)

```typescript
// Record consent
await client.consents.create({
  email: "user@example.com",
  consent_type: "email_sending",
  granted: true,
  ip_address: "1.2.3.4",
});

// List
const consents = await client.consents.list({ email: "user@example.com" });

// Revoke
await client.consents.revoke("consent_id");
```

### Events

```typescript
const { data } = await client.events.list({
  event_type: "email.delivered",
  email_id: "email_id",
  page: 1,
});
```

### Audit Log

```typescript
const { data } = await client.auditLog.list({
  action: "domain.verified",
  page: 1,
});
```

### Reputation

```typescript
// Start IP warmup
const warmup = await client.reputation.startWarmup({
  ip_address: "1.2.3.4",
  daily_limit_start: 100,
  daily_limit_max: 10000,
});

// List warmup schedules
const warmups = await client.reputation.listWarmups();

// Check blacklist
const check = await client.reputation.checkBlacklist({
  ip_address: "1.2.3.4",
});

// Reputation stats
const stats = await client.reputation.stats();
```

### Inbound Emails

```typescript
// List inbound emails
const { data } = await client.inbound.list({ page: 1 });

// Get inbound email detail
const email = await client.inbound.get("inbound_id");

// Create routing rule
await client.inbound.createRule({
  match_field: "to",
  match_value: "support@yourdomain.com",
  action: "webhook",
  action_value: "https://yourdomain.com/hooks/support",
});

// List rules
const rules = await client.inbound.listRules();

// Delete rule
await client.inbound.deleteRule("rule_id");
```

### Team

```typescript
// List members and invitations
const { members, invitations } = await client.team.list();

// Invite member
await client.team.invite({
  email: "colleague@example.com",
  role: "member",
});

// Update role
await client.team.updateRole("member_id", { role: "admin" });

// Remove member
await client.team.remove("member_id");

// Cancel invitation
await client.team.cancelInvitation("invitation_id");
```

### Settings

```typescript
// Get tenant settings
const settings = await client.settings.get();

// Update
await client.settings.update({
  name: "My Company",
  sending_region: "eu-west-1",
});

// List available regions
const regions = await client.settings.regions();
```

### Dedicated IPs

```typescript
// Assign IP
const ip = await client.dedicatedIps.create({
  ip_address: "1.2.3.4",
  label: "Production",
});

// List
const ips = await client.dedicatedIps.list();

// Start warmup
await client.dedicatedIps.startWarmup("ip_id");

// Pause warmup
await client.dedicatedIps.pauseWarmup("ip_id");

// Delete
await client.dedicatedIps.delete("ip_id");
```

## Error Handling

```typescript
import { MailCatapulte, MailCatapulteError } from "mailcatapulte";

try {
  await client.emails.send({ ... });
} catch (err) {
  if (err instanceof MailCatapulteError) {
    console.error("Status:", err.statusCode);  // 400, 401, 404, etc.
    console.error("Type:", err.type);           // "validation_error", etc.
    console.error("Message:", err.message);
  }
}
```

## License

MIT
