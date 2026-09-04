# AshMediaBoost Production Checklist

## Security

- [ ] Supabase RLS enabled for every exposed user/business table.
- [ ] Provider, payment and AI credentials remain server-side only.
- [ ] No secrets committed to GitHub, browser bundles or logs.
- [ ] Validate and authorize every API request on the server.
- [ ] Never accept client-supplied wallet balances, provider costs or final prices.
- [ ] Use idempotency for payment, wallet, referral and provider order operations.
- [ ] Hash guest tracking tokens before storage.
- [ ] Rate-limit authentication, checkout, free trials, chat and admin endpoints.
- [ ] Verify payment webhooks using the gateway's signature mechanism.
- [ ] Never store full card numbers, CVV or payment PINs.
- [ ] Use secure, HttpOnly, SameSite cookies where cookies are required.
- [ ] Sanitize user-generated text before rendering or logging.
- [ ] Enforce least-privilege admin roles.

## Financial integrity

- Customer price is calculated server-side from the current service configuration.
- Provider cost and customer price are snapshotted on each order.
- Wallet movements use an append-only ledger model.
- Balance changes are atomic with their ledger entries.
- Refunds/reversals create compensating ledger entries instead of editing history.
- Payment status is authoritative only after verified gateway confirmation.

## Provider safety

- Only one active provider is used at a time.
- Provider credentials are stored outside source control.
- Provider service IDs are mapped to internal service IDs.
- Provider `add` requests use local idempotency/order protection.
- Unknown provider outcomes are reconciled by status lookup instead of blindly retrying.
- Polling uses bounded intervals and backoff.
- Provider failures are surfaced to admins without exposing credentials.

## Performance

- Keep the public frontend lightweight and mobile-first.
- Defer non-critical JavaScript.
- Compress and appropriately size images.
- Avoid unnecessary third-party scripts.
- Cache safe public service/catalog responses.
- Paginate orders, transactions, chat and admin tables.
- Add database indexes for authentication lookups, order IDs, status and timestamps.
- Avoid N+1 queries in dashboards/admin pages.

## Reliability

- Add structured request IDs to server operations.
- Return safe user-facing errors without leaking internal details.
- Log server errors with sanitized metadata.
- Monitor payment webhooks, provider synchronization and database failures.
- Reconcile stuck orders instead of assuming every API call succeeded.
- Provide maintenance/degraded-service states instead of fake availability.

## SEO and accessibility

- Unique page titles and descriptions.
- Canonical URLs once the custom domain is live.
- `robots.txt` and `sitemap.xml` for public pages.
- Semantic headings and landmarks.
- Keyboard/focus support where applicable.
- Sufficient contrast and visible focus states.
- Descriptive labels for form controls and meaningful alt text.

## Deployment

- Connect the GitHub repository to the correct Vercel project/account.
- Configure the custom domain after deployment ownership is confirmed.
- Configure production Supabase URL/key values using Vercel environment variables where applicable.
- Keep server-only secrets out of `NEXT_PUBLIC_*` or browser-exposed variables.
- Verify every production API route independently after deployment.
- Confirm error pages do not expose stack traces.
- Test login, guest checkout, payments, wallet, free trials, referrals, provider synchronization and admin authorization before launch.

## Launch gate

The site is **not production-ready** until real payment verification, Supabase authorization, provider integration, ledger transactions, monitoring and end-to-end tests are connected. UI placeholders must never be presented as completed payment/provider functionality.
