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

    return {
        getKpisOverview
    }
}