# AshMediaBoost Referral & Rewards

## Rules

- Every account gets a unique referral code and shareable referral link.
- A referral is attached only after the referred account completes verification/registration rules configured by the backend.
- Rewards are issued only for qualifying actions or paid orders that the backend marks eligible.
- The browser never decides whether a reward is earned or how much it is worth.
- Reward amounts, qualifying order minimums, cooldowns and limits are admin-configurable in Supabase.

## Anti-abuse controls

1. A user cannot refer themselves.
2. A referral cannot be reassigned after a qualifying event.
3. One account can have only one referring account.
4. Reward issuance must use an idempotency key so the same qualifying event cannot pay twice.
5. Cancelled, refunded or fraudulent orders do not qualify unless an admin rule explicitly allows them.
6. Apply per-user, per-day and global reward limits.
7. Flag suspicious clusters for admin review instead of automatically paying rewards.
8. Never trust referral reward amounts sent by the client.

## Suggested Supabase tables

### `referrals`

- `id` — UUID primary key
- `referrer_user_id` — UUID
- `referred_user_id` — UUID, unique
- `referral_code` — text
- `status` — text (`pending`, `qualified`, `rejected`)
- `qualified_at` — timestamptz nullable
- `created_at` — timestamptz

### `referral_rewards`

- `id` — UUID primary key
- `referral_id` — UUID
- `referrer_user_id` — UUID
- `referred_user_id` — UUID
- `source_order_id` — UUID nullable
- `amount` — numeric
- `currency` — text
- `status` — text (`pending`, `approved`, `reversed`)
- `idempotency_key` — text unique
- `created_at` — timestamptz

### `referral_settings`

- `id` — UUID primary key
- `enabled` — boolean
- `reward_type` — text (`fixed`, `percentage`)
- `reward_value` — numeric
- `minimum_order_amount` — numeric
- `daily_user_limit` — integer
- `global_daily_limit` — integer
- `updated_at` — timestamptz

## Wallet integration

Referral rewards must enter the same authoritative financial ledger as other wallet movements. Never directly edit a displayed balance from frontend JavaScript. A server-side transaction should create the reward record and corresponding ledger entry atomically.
