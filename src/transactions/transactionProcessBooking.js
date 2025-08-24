/**
 * Transaction process graph for bookings:
 *   - default-booking
 */

/**
 * Transitions
 */
export const transitions = {
  INQUIRE: 'transition/inquire',
  REQUEST_PAYMENT: 'transition/request-payment',
  REQUEST_PAYMENT_AFTER_INQUIRY: 'transition/request-payment-after-inquiry',
  CONFIRM_PAYMENT: 'transition/confirm-payment',
  EXPIRE_PAYMENT: 'transition/expire-payment',
  ACCEPT: 'transition/accept',
  DECLINE: 'transition/decline',
  OPERATOR_ACCEPT: 'transition/operator-accept',
  OPERATOR_DECLINE: 'transition/operator-decline',
  EXPIRE: 'transition/expire',
  CANCEL: 'transition/cancel',
  COMPLETE: 'transition/complete',
  OPERATOR_COMPLETE: 'transition/operator-complete',
  REVIEW_1_BY_PROVIDER: 'transition/review-1-by-provider',
  REVIEW_2_BY_PROVIDER: 'transition/review-2-by-provider',
  REVIEW_1_BY_CUSTOMER: 'transition/review-1-by-customer',
  REVIEW_2_BY_CUSTOMER: 'transition/review-2-by-customer',
  EXPIRE_CUSTOMER_REVIEW_PERIOD: 'transition/expire-customer-review-period',
  EXPIRE_PROVIDER_REVIEW_PERIOD: 'transition/expire-provider-review-period',
  EXPIRE_REVIEW_PERIOD: 'transition/expire-review-period',
  PAY_REMAINING: 'transition/pay-remaining',
  CONFIRM_REMAINING_PAYMENT: 'transition/confirm-remaining-payment',
};

/**
 * States
 */
export const states = {
  INITIAL: 'initial',
  INQUIRY: 'inquiry',
  PENDING_PAYMENT: 'pending-payment',
  PAYMENT_EXPIRED: 'payment-expired',
  PREAUTHORIZED: 'preauthorized',
  PENDING_REMAINING_AMOUNT: 'pending-remaining-amount',
  PENDING_REMAINING_PAYMENT: 'pending-remaining-payment',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
  DELIVERED: 'delivered',
  REVIEWED: 'reviewed',
  REVIEWED_BY_CUSTOMER: 'reviewed-by-customer',
  REVIEWED_BY_PROVIDER: 'reviewed-by-provider',
};

/**
 * Transaction process graph (FSM)
 */
export const graph = {
  id: 'default-booking/release-1',
  initial: states.INITIAL,
  states: {
    [states.INITIAL]: {
      on: {
        [transitions.INQUIRE]: states.INQUIRY,
        [transitions.REQUEST_PAYMENT]: states.PENDING_PAYMENT,
      },
    },
    [states.INQUIRY]: {
      on: {
        [transitions.REQUEST_PAYMENT_AFTER_INQUIRY]: states.PENDING_PAYMENT,
      },
    },
    [states.PENDING_PAYMENT]: {
      on: {
        [transitions.EXPIRE_PAYMENT]: states.PAYMENT_EXPIRED,
        [transitions.CONFIRM_PAYMENT]: states.PREAUTHORIZED,
      },
    },
    [states.PAYMENT_EXPIRED]: {},
    [states.PREAUTHORIZED]: {
      on: {
        [transitions.ACCEPT]: states.PENDING_REMAINING_AMOUNT,
        [transitions.OPERATOR_ACCEPT]: states.ACCEPTED,
        [transitions.DECLINE]: states.DECLINED,
        [transitions.OPERATOR_DECLINE]: states.DECLINED,
        [transitions.EXPIRE]: states.EXPIRED,
      },
    },
    [states.PENDING_REMAINING_AMOUNT]: {
      on: {
        [transitions.PAY_REMAINING]: states.PENDING_REMAINING_PAYMENT,
        [transitions.DECLINE]: states.DECLINED,
      },
    },
    [states.PENDING_REMAINING_PAYMENT]: {
      on: {
        [transitions.CONFIRM_REMAINING_PAYMENT]: states.DELIVERED,
      },
    },
    [states.ACCEPTED]: {
      on: {
        [transitions.CANCEL]: states.CANCELLED,
        [transitions.COMPLETE]: states.DELIVERED,
        [transitions.OPERATOR_COMPLETE]: states.DELIVERED,
      },
    },
    [states.DECLINED]: {},
    [states.EXPIRED]: {},
    [states.CANCELLED]: {},
    [states.DELIVERED]: {
      on: {
        [transitions.REVIEW_1_BY_CUSTOMER]: states.REVIEWED_BY_CUSTOMER,
        [transitions.REVIEW_1_BY_PROVIDER]: states.REVIEWED_BY_PROVIDER,
        [transitions.EXPIRE_REVIEW_PERIOD]: states.REVIEWED,
      },
    },
    [states.REVIEWED_BY_CUSTOMER]: {
      on: {
        [transitions.REVIEW_2_BY_PROVIDER]: states.REVIEWED,
        [transitions.EXPIRE_PROVIDER_REVIEW_PERIOD]: states.REVIEWED,
      },
    },
    [states.REVIEWED_BY_PROVIDER]: {
      on: {
        [transitions.REVIEW_2_BY_CUSTOMER]: states.REVIEWED,
        [transitions.EXPIRE_CUSTOMER_REVIEW_PERIOD]: states.REVIEWED,
      },
    },
    [states.REVIEWED]: { type: 'final' },
  },
};

/**
 * Privileged transitions (backend secure)
 */
export const isPrivileged = transition => {
  return [
    transitions.REQUEST_PAYMENT,
    transitions.REQUEST_PAYMENT_AFTER_INQUIRY,
    transitions.PAY_REMAINING,
  ].includes(transition);
};

/**
 * Completed / refunded checks
 */
export const isCompleted = transition => {
  const completed = [
    transitions.COMPLETE,
    transitions.OPERATOR_COMPLETE,
    transitions.REVIEW_1_BY_CUSTOMER,
    transitions.REVIEW_1_BY_PROVIDER,
    transitions.REVIEW_2_BY_CUSTOMER,
    transitions.REVIEW_2_BY_PROVIDER,
    transitions.EXPIRE_REVIEW_PERIOD,
    transitions.EXPIRE_CUSTOMER_REVIEW_PERIOD,
    transitions.EXPIRE_PROVIDER_REVIEW_PERIOD,
  ];
  return completed.includes(transition);
};

export const isRefunded = transition => {
  const refunded = [
    transitions.EXPIRE_PAYMENT,
    transitions.EXPIRE,
    transitions.CANCEL,
    transitions.DECLINE,
  ];
  return refunded.includes(transition);
};

export const statesNeedingProviderAttention = [states.PREAUTHORIZED];

/**
 * Check if a transition is the kind that should be rendered
 * when showing transition history (e.g. ActivityFeed)
 * The first transition and most of the expiration transitions made by system are not relevant
 */
export const isRelevantPastTransition = transition => {
  return [
    transitions.CONFIRM_PAYMENT,
    transitions.ACCEPT,
    transitions.OPERATOR_ACCEPT,
    transitions.DECLINE,
    transitions.OPERATOR_DECLINE,
    transitions.EXPIRE,
    transitions.CANCEL,
    transitions.COMPLETE,
    transitions.OPERATOR_COMPLETE,
    transitions.PAY_REMAINING,
    transitions.CONFIRM_REMAINING_PAYMENT,
    transitions.REVIEW_1_BY_CUSTOMER,
    transitions.REVIEW_1_BY_PROVIDER,
    transitions.REVIEW_2_BY_CUSTOMER,
    transitions.REVIEW_2_BY_PROVIDER,
    transitions.EXPIRE_REVIEW_PERIOD,
    transitions.EXPIRE_CUSTOMER_REVIEW_PERIOD,
    transitions.EXPIRE_PROVIDER_REVIEW_PERIOD,
  ].includes(transition);
};

/**
 * Check if a transition is a customer review
 */
export const isCustomerReview = transition => {
  return [
    transitions.REVIEW_1_BY_CUSTOMER,
    transitions.REVIEW_2_BY_CUSTOMER,
  ].includes(transition);
};

/**
 * Check if a transition is a provider review
 */
export const isProviderReview = transition => {
  return [
    transitions.REVIEW_1_BY_PROVIDER,
    transitions.REVIEW_2_BY_PROVIDER,
  ].includes(transition);
};
