import { ref, computed } from 'vue';
import dayjs from 'dayjs';

export interface PeriodFilter {
    startDate: string;
    endDate: string;
    label: string;
}

export function usePeriodFilter() {
    const currentPeriod = ref<PeriodFilter>({
        startDate: dayjs().subtract(30, 'day').format('YYYY-MM-DD'),
        endDate: dayjs().format('YYYY-MM-DD'),
        label: 'Últimos 30 dias',
    });

    const updatePeriod = (period: PeriodFilter) => {
        currentPeriod.value = period;
    };

    // Computed para facilitar o uso nas APIs
    const periodQuery = computed(() => ({
        start_date: currentPeriod.value.startDate,
        end_date: currentPeriod.value.endDate,
    }));

    // Helper para verificar se uma data está no período
    const isDateInPeriod = (date: string | Date) => {
        const targetDate = dayjs(date);
        const start = dayjs(currentPeriod.value.startDate);
        const end = dayjs(currentPeriod.value.endDate);

        return targetDate.isAfter(start.subtract(1, 'day')) && targetDate.isBefore(end.add(1, 'day'));
    };

    // Helper para filtrar dados por período
    const filterDataByPeriod = <T extends { created_at?: string; start_time?: string; date?: string }>(
        data: T[],
        dateField: keyof T = 'created_at'
    ) => {
        return data.filter(item => {
            const dateValue = item[dateField];
            if (!dateValue || typeof dateValue !== 'string') return false;
            return isDateInPeriod(dateValue);
        });
    };

    // Helper para aplicar filtro de período em queries do Supabase
    const applyPeriodFilter = (query: any, dateField: string = 'created_at') => {
        return query
            .gte(dateField, currentPeriod.value.startDate)
            .lte(dateField, currentPeriod.value.endDate);
    };

    return {
        currentPeriod: readonly(currentPeriod),
        updatePeriod,
        periodQuery,
        isDateInPeriod,
        filterDataByPeriod,
        applyPeriodFilter,
    };
}
