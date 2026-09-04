/**
 * Pricing policy used by the future server-side order service.
 * Followers: provider cost x 1.5. Everything else: provider cost x 2.
 * Production values should be read from Supabase/admin settings rather than
 * trusting any price supplied by the browser.
 */

export function getMarkup(serviceType, settings = {}) {
  const followers = Number(settings.followersMultiplier ?? 1.5);
  const defaultMultiplier = Number(settings.defaultMultiplier ?? 2);
  const isFollowers = String(serviceType).trim().toLowerCase() === 'followers';
  const multiplier = isFollowers ? followers : defaultMultiplier;
  if (!Number.isFinite(multiplier) || multiplier <= 0) {
    throw new Error('Invalid markup configuration');
  }
  return multiplier;
}

export function customerPrice(providerCost, serviceType, settings = {}) {
  const cost = Number(providerCost);
  if (!Number.isFinite(cost) || cost < 0) throw new Error('Invalid provider cost');
  return Number((cost * getMarkup(serviceType, settings)).toFixed(6));
}
