import type { FetchError } from 'ofetch';

export interface SubscriptionStatus {
  hasAccess: boolean;
  hasActiveSubscription: boolean;
  hasTemporaryAccess: boolean;
  subscription: {
    status: string;
    currentPeriodEnd: string | null;
    cancelAtPeriodEnd: boolean;
  } | null;
  temporaryAccess: {
    expiresAt: string;
    reason: string | null;
  } | null;
}

export function useSubscriptionApi() {
  const loading = ref(false);
  const errorMessage = ref<string | null>(null);

  async function checkSubscriptionStatus(): Promise<SubscriptionStatus | null> {
    try {
      loading.value = true;
      errorMessage.value = null;

      const data = await $fetch<SubscriptionStatus>('/api/stripe/subscription-status');

      return data;
    } catch (error: unknown) {
      const err = error as FetchError;
      errorMessage.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function createCheckout(priceId: string): Promise<{ sessionId: string; url: string } | null> {
    try {
      loading.value = true;
      errorMessage.value = null;

      const data = await $fetch<{ sessionId: string; url: string }>('/api/stripe/create-checkout', {
        method: 'POST',
        body: { priceId },
      });

      return data;
    } catch (error: unknown) {
      const err = error as FetchError;
      errorMessage.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  }

  async function cancelSubscription(): Promise<boolean> {
    try {
      loading.value = true;
      errorMessage.value = null;

      await $fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
      });

      return true;
    } catch (error: unknown) {
      const err = error as FetchError;
      errorMessage.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function resumeSubscription(): Promise<boolean> {
    try {
      loading.value = true;
      errorMessage.value = null;

      await $fetch('/api/stripe/resume-subscription', {
        method: 'POST',
      });

      return true;
    } catch (error: unknown) {
      const err = error as FetchError;
      errorMessage.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function requestTemporaryAccess(reason?: string, contactInfo?: string): Promise<boolean> {
    try {
      loading.value = true;
      errorMessage.value = null;

      await $fetch('/api/temporary-access/request', {
        method: 'POST',
        body: { reason, contact_info: contactInfo },
      });

      return true;
    } catch (error: unknown) {
      const err = error as FetchError;
      errorMessage.value = err.message;
      return false;
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    errorMessage,
    checkSubscriptionStatus,
    createCheckout,
    cancelSubscription,
    resumeSubscription,
    requestTemporaryAccess,
  };
}

