import type { FetchError } from 'ofetch'

export function useReportsApi() {
    const getKpisOverview = async () => {
        try {
            const res = await $fetch('/api/reports/kpis-overview');
            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch KPI.');
        }
    };

    const getMonthlyEvents = async () => {
        try {
            const res = await $fetch('/api/reports/monthly-events');
            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch monthly events.');
        }
    };

    const getProfitSummary = async () => {
        try {
            const res = await $fetch('/api/reports/profit-summary');
            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch profit summary.');
        }
    };

    const getDrinkCostDistribution = async () => {
        try {
            const res = await $fetch('/api/reports/drink-cost-distribution');
            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch drink cost distribution.');
        }
    };

    const getRecentActivity = async () => {
        try {
            const res = await $fetch('/api/reports/recent-activity');
            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch recent activity.');
        }
    };

    const getTopClients = async () => {
        try {
            const res = await $fetch('/api/reports/top-clients');
            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch top clients.');
        }
    };

    return {
        getKpisOverview,
        getMonthlyEvents,
        getProfitSummary,
        getDrinkCostDistribution,
        getRecentActivity,
        getTopClients
    }
}