import type { FetchError } from "ofetch";

interface PeriodParams {
  start_date?: string;
  end_date?: string;
}

export function useReportsApi() {
  const getKpisOverview = async (period?: PeriodParams) => {
    try {
      const params = period ? { ...period } : {};
      const res = await $fetch("/api/reports/kpis-overview", { query: params });
      return res;
    } catch (error: unknown) {
      const err = error as FetchError;
      $toast().error(err.message || "Failed to fetch KPI.");
    }
  };

  const getMonthlyEvents = async (period?: PeriodParams) => {
    try {
      const params = period ? { ...period } : {};
      const res = await $fetch("/api/reports/monthly-events", {
        query: params,
      });
      return res;
    } catch (error: unknown) {
      const err = error as FetchError;
      $toast().error(err.message || "Failed to fetch monthly events.");
    }
  };

  const getProfitSummary = async (period?: PeriodParams) => {
    try {
      const params = period ? { ...period } : {};
      const res = await $fetch("/api/reports/profit-summary", {
        query: params,
      });
      return res;
    } catch (error: unknown) {
      const err = error as FetchError;
      $toast().error(err.message || "Failed to fetch profit summary.");
    }
  };

  const getEventTrend = async (period?: PeriodParams) => {
    try {
      const params = period ? { ...period } : {};
      const res = await $fetch("/api/reports/event-trend", { query: params });
      return res;
    } catch (error: unknown) {
      const err = error as FetchError;
      $toast().error(err.message || "Failed to fetch event trend.");
    }
  };


  const getRecentActivity = async (period?: PeriodParams) => {
    try {
      const params = period ? { ...period } : {};
      const res = await $fetch("/api/reports/recent-activity", {
        query: params,
      });
      return res;
    } catch (error: unknown) {
      const err = error as FetchError;
      $toast().error(err.message || "Failed to fetch recent activity.");
    }
  };

  const getTopClients = async (period?: PeriodParams) => {
    try {
      const params = period ? { ...period } : {};
      const res = await $fetch("/api/reports/top-clients", { query: params });
      return res;
    } catch (error: unknown) {
      const err = error as FetchError;
      $toast().error(err.message || "Failed to fetch top clients.");
    }
  };

  // Novos métodos para relatórios específicos
  const getIngredientConsumption = async (period?: PeriodParams) => {
    try {
      const params = period ? { ...period } : {};
      const res = await $fetch("/api/reports/ingredient-consumption", {
        query: params,
      });
      return res;
    } catch (error: unknown) {
      const err = error as FetchError;
      $toast().error(err.message || "Failed to fetch ingredient consumption.");
    }
  };

  const getQuotationHistory = async (period?: PeriodParams) => {
    try {
      const params = period ? { ...period } : {};
      const res = await $fetch("/api/reports/quotation-history", {
        query: params,
      });
      return res;
    } catch (error: unknown) {
      const err = error as FetchError;
      $toast().error(err.message || "Failed to fetch quotation history.");
    }
  };

  return {
    getKpisOverview,
    getMonthlyEvents,
    getProfitSummary,
    getEventTrend,
    getRecentActivity,
    getTopClients,
    getIngredientConsumption,
    getQuotationHistory,
  };
}
