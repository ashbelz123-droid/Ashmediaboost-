/**
 * AshMediaBoost provider adapter contract.
 *
 * This file deliberately contains NO provider URL or API key. When the final
 * single provider is selected, its implementation plugs into this contract.
 * Provider credentials must live in server-side environment/Supabase config,
 * never in browser code or Git.
 */

export function createProviderAdapter(config = {}) {
  const required = ['baseUrl'];
  for (const key of required) {
    if (!config[key]) throw new Error(`Provider configuration missing: ${key}`);
  }

  async function call(action, payload = {}) {
    throw new Error(`Provider adapter is not configured for action: ${action}`);
  }

  return {
    services: () => call('services'),
    balance: () => call('balance'),
    add: (order) => call('add', order),
    status: (providerOrderId) => call('status', { order: providerOrderId }),
    refill: (providerOrderId) => call('refill', { order: providerOrderId }),
    refillStatus: (refillId) => call('refill_status', { refill: refillId }),
    cancel: (providerOrderId) => call('cancel', { order: providerOrderId })
  };
}

export function calculateCustomerPrice(providerCost, serviceType, followersMultiplier = 1.5, defaultMultiplier = 2) {
  const cost = Number(providerCost);
  if (!Number.isFinite(cost) || cost < 0) throw new Error('Invalid provider cost');
  const multiplier = String(serviceType).toLowerCase() === 'followers'
    ? Number(followersMultiplier)
    : Number(defaultMultiplier);
  if (!Number.isFinite(multiplier) || multiplier <= 0) throw new Error('Invalid pricing multiplier');
  return Number((cost * multiplier).toFixed(6));
}

export function validateOrderForProvider(order) {
  if (!order || typeof order !== 'object') throw new Error('Order is required');
  if (!order.localOrderId) throw new Error('localOrderId is required');
  if (!order.providerServiceId) throw new Error('providerServiceId is required');
  if (!order.target) throw new Error('target is required');
  if (!Number.isFinite(Number(order.quantity)) || Number(order.quantity) <= 0) {
    throw new Error('quantity must be positive');
  }
  return true;
}
