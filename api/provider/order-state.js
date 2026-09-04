/**
 * Provider-independent order state rules.
 * Persist these states in the database when the real backend is connected.
 */

export const ORDER_STATES = Object.freeze({
  CREATED: 'created',
  PAYMENT_PENDING: 'payment_pending',
  PAID: 'paid',
  SUBMITTING: 'submitting',
  PROCESSING: 'processing',
  PARTIAL: 'partial',
  COMPLETED: 'completed',
  REFILL_PENDING: 'refill_pending',
  REFILLED: 'refilled',
  CANCELED: 'canceled',
  REFUNDED: 'refunded',
  FAILED: 'failed'
});

const transitions = {
  created: ['payment_pending', 'canceled'],
  payment_pending: ['paid', 'canceled'],
  paid: ['submitting', 'refunded'],
  submitting: ['processing', 'failed'],
  processing: ['partial', 'completed', 'canceled', 'failed', 'refill_pending'],
  partial: ['processing', 'completed', 'canceled', 'failed', 'refill_pending'],
  refill_pending: ['refilled', 'processing', 'failed'],
  refilled: ['completed'],
  completed: ['refill_pending'],
  canceled: ['refunded'],
  failed: ['refunded'],
  refunded: []
};

export function canTransition(from, to) {
  return Array.isArray(transitions[from]) && transitions[from].includes(to);
}

export function assertTransition(from, to) {
  if (!canTransition(from, to)) {
    throw new Error(`Invalid order transition: ${from} -> ${to}`);
  }
  return true;
}

/**
 * Never automatically retry an `add` call when the provider response is
 * unknown. An unknown submission can create duplicate provider orders.
 * Reconciliation/status lookup must happen before another add attempt.
 */
export function shouldRetryProviderAdd(response) {
  return Boolean(response && response.confirmed === false && response.retrySafe === true);
}
