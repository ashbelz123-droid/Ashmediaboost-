# AshMediaBoost Admin & Monitoring

## Admin model

Use role-based access control. The browser UI and Telegram bot must call the same server-side authorization layer.

Roles should be configurable, for example:

- `owner` — full control, including admin management and sensitive financial actions
- `admin` — operational management without owner-only security changes
- `support` — customer/order support with no wallet/provider credential access
- `finance` — deposits, withdrawals and reconciliation only
- `viewer` — read-only monitoring

Telegram authorization must use the Telegram numeric user ID, never a username.

## Web admin areas

- Overview and live system health
- Users and account status
- Orders and provider statuses
- Services/catalog and provider mappings
- Wallets, deposits and withdrawals
- Payments and reconciliation
- Referral rewards
- Free-trial quotas
- Provider configuration and API health
- Support/chat moderation
- Site branding/settings
- Audit logs

Sensitive actions should require recent authentication and, where appropriate, a second confirmation.

## Monitoring events

Record structured events for:

- Provider API failures, latency and unexpected responses
- Orders stuck or failing to synchronize
- Payment verification failures and webhook anomalies
- Wallet/ledger errors
- Database connectivity/errors
- Authentication anomalies and repeated failed logins
- Suspicious order/referral activity
- AI gateway failures or fallback usage
- Application errors and elevated HTTP 5xx rates
- Deployment/build failures when deployment telemetry is available

Never place provider API keys, card data, passwords, access tokens or other secrets in logs.

## Suggested tables

### `admin_users`

- `id` — UUID primary key
- `user_id` — UUID unique
- `role` — text
- `status` — text (`active`, `revoked`)
- `created_by` — UUID nullable
- `created_at` — timestamptz
- `revoked_at` — timestamptz nullable

### `audit_logs`

- `id` — UUID primary key
- `actor_user_id` — UUID nullable
- `actor_type` — text (`admin`, `system`, `telegram`)
- `action` — text
- `resource_type` — text
- `resource_id` — text nullable
- `result` — text (`success`, `failure`, `denied`)
- `metadata` — jsonb, sanitized
- `request_id` — text nullable
- `created_at` — timestamptz

### `system_events`

- `id` — UUID primary key
- `severity` — text (`info`, `warning`, `error`, `critical`)
- `category` — text
- `event_code` — text
- `message` — text
- `metadata` — jsonb, sanitized
- `resolved` — boolean
- `created_at` — timestamptz
- `resolved_at` — timestamptz nullable

### `system_settings`

- `key` — text primary key
- `value` — jsonb
- `updated_by` — UUID nullable
- `updated_at` — timestamptz

## Telegram bot architecture

The bot is a monitoring/control client, not a database superuser. Commands should pass through the same permission checks as the web admin.

Initial commands:

- `/status` — overall health
- `/orders` — recent/problem orders
- `/payments` — pending/problem payments
- `/errors` — recent application errors
- `/provider` — provider health and balance status without exposing credentials
- `/db` — database health
- `/uptime` — application health metrics
- `/stats` — operational summary

Critical alerts should be sent proactively to authorized administrators. Avoid alert storms by grouping repeated events and using cooldowns.

## Security requirements

- Keep provider/payment/AI secrets server-side only.
- Enforce RLS on exposed Supabase tables.
- Do not allow the client to choose an admin role.
- Do not allow direct client wallet balance mutations.
- Use idempotency for financial and reward operations.
- Sanitize audit metadata and Telegram messages.
- Rate-limit admin endpoints and bot commands.
- Keep an immutable audit trail for financial and permission changes.
