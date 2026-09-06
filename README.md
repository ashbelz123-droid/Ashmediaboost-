# AshMediaBoost

A mobile-first social media services marketplace built for real orders, account users, guest ordering, secure pricing, and provider-independent fulfillment.

## Current architecture

- **Frontend:** lightweight HTML, CSS and JavaScript.
- **Hosting:** Vercel.
- **Database/auth/storage:** Supabase.
- **Provider:** one upstream SMM provider will be connected through the provider adapter after the provider is selected.
- **Customer currency:** UGX. The current pricing configuration uses 1 USD = 3,700 UGX.
- **Pricing:** followers/subscribers use a 1.5× provider-cost multiplier; other services use a 2× multiplier. Final pricing is calculated server-side.

## Security rules

- Provider credentials must never be placed in frontend JavaScript, HTML, Git history, or public environment variables.
- Browser requests must never be trusted for provider cost, final price, wallet balance, payment status, or order status.
- Provider calls must run server-side through the provider adapter.
- Send the provider only the fulfillment information it needs; customer wallet, payment, referral, and internal account data stays inside AshMediaBoost.
- Orders need durable local IDs, provider IDs, price snapshots, idempotency protection, status reconciliation, and safe handling of uncertain provider responses.
- Never store full payment-card numbers, CVV, PINs, or similar sensitive payment credentials.
- Financial actions must be authenticated, validated server-side, and auditable.

## Development

The project is designed to run as a lightweight Vercel application. Static customer pages live at the repository root, shared assets are under `assets/`, and server-side integration code is under `api/`.

Do not commit secrets. Use Vercel environment variables or the server-side configuration mechanism implemented by the application for credentials that must not be public.

## Provider status

No upstream provider is hardcoded into the customer interface. Until one provider is selected and its API is verified, the marketplace must not invent provider services, costs, delivery limits, or order results.

## Payments

Customer deposit/payment flows are intentionally kept separate from the provider integration. Payment UI and payment processing should only be implemented after the required payment flow is finalized.

## Production checklist

Before launch, verify authentication, Supabase RLS, server-side authorization, pricing integrity, wallet/ledger atomicity, payment verification, provider order reconciliation, rate limits, admin RBAC, audit logging, error monitoring, backups, and Vercel deployment configuration.

See `docs/production-checklist.md`, `docs/admin-monitoring.md`, and `docs/referral-rewards.md` for the project requirements and launch checks.
