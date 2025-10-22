import { useReportsApi } from "~/composables/api/useReportsApi";
import { useEventsApi } from "~/composables/api/useEventsApi";
import type { Datum } from "~/types/events";
import type { PeriodFilter } from "~/composables/usePeriodFilter";
import type { VDataTableServerOptions } from "~/types/data-table";

export interface ProfitData {
  date: string;
  cost: string;
  revenue: string;
  profit: string;
}

export interface ProfitabilityInsights {
  mostProfitableEvent: {
    name: string;
    profit: number;
    margin: number;
  } | null;
  leastProfitableEvent: {
    name: string;
    profit: number;
    margin: number;
  } | null;
  averageProfitMargin: number;
  totalEvents: number;
  profitableEvents: number;
  unprofitableEvents: number;
}

export interface ProfitabilityOverview {
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
  profitMargin: number;
  averageEventValue: number;
  totalEvents: number;
}

export interface EventWithCalculations extends Datum {
  estimated_profit: number;
  profit_margin: number;
}

export function useProfitability() {
  const dayjs = useDayjs();
  const reportsApi = useReportsApi();
  const eventsApi = useEventsApi();
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Estados da tabela
  const events = ref<EventWithCalculations[]>([]);
  const totalItems = ref(0);
  const currentPage = ref(1);
  const itemsPerPage = ref<10 | 25 | 50>(10)


  // Headers da tabela
  const headers = [
    { title: "Evento", key: "location", sortable: false, maxWidth: 200 },
    { title: "Cliente", key: "clients", sortable: true },
    { title: "Data", key: "start_time", sortable: true },
    { title: "Status", key: "status", sortable: true },
    { title: "Receita", key: "total_revenue", sortable: true },
    { title: "Custo", key: "total_cost", sortable: true },
    { title: "Lucro", key: "estimated_profit", sortable: true },
    { title: "Margem", key: "profit_margin", sortable: true },
  ];

  // Função para formatar percentual
  const formatPercentage = (value: number, decimals = 1) => {
    return `${value.toFixed(decimals)}%`;
  };

  // Função para obter cor do status
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Concluído: "success",
      "Em Andamento": "warning",
      Cancelado: "error",
      Agendado: "info",
    };
    return colors[status] || "default";
  };

  // Função para calcular lucro e margem
  const calculateProfitAndMargin = (event: Datum): EventWithCalculations => {
    const totalCost = event.total_cost || 0;
    const revenue = event.total_revenue || 0;
    const estimatedProfit = revenue - totalCost; // Lucro = Receita - Custo
    const profitMargin = revenue > 0 ? (estimatedProfit / revenue) * 100 : 0; // Margem baseada na receita

    return {
      ...event,
      estimated_profit: estimatedProfit,
      profit_margin: profitMargin,
    };
  };

  // Função para obter parâmetros do período
  const getPeriodParams = (period?: PeriodFilter) => {
    return period
      ? {
        start_date: period.startDate,
        end_date: period.endDate,
      }
      : undefined;
  };

  // Função para buscar eventos da tabela
  const fetchEvents = async (props?: VDataTableServerOptions, period?: PeriodFilter) => {
    loading.value = true;

    try {
      const options = {
        page: currentPage.value,
        itemsPerPage: itemsPerPage.value,
      };

      if (!props || typeof props !== 'object' || !('page' in props)) {
        props = {
          page: currentPage.value,
          itemsPerPage: itemsPerPage.value,
          groupBy: [],
          sortBy: [],
          search: '',
        };
      }

      const filters = {
        status: { op: "eq", value: "completed" }, // Apenas eventos concluídos para análise de lucratividade
        start_time: { op: "gte", value: dayjs(period?.startDate).utc().startOf('day').toISOString() },
        end_time: { op: "lte", value: dayjs(period?.endDate).utc().endOf('day').toISOString() },
      };

      const response = await eventsApi.getEvents(options, filters);

      if (response) {
        const rawEvents = response.data || [];
        events.value = rawEvents.map(calculateProfitAndMargin);
        totalItems.value = response.page?.totalRows || 0;
      }
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      events.value = [];
    } finally {
      loading.value = false;
    }
  };

  // Função para carregar dados de lucratividade
  const loadProfitData = async (
    period?: PeriodFilter
  ): Promise<ProfitData[]> => {
    try {
      loading.value = true;
      error.value = null;

      const periodParams = getPeriodParams(period);
      const res = await reportsApi.getProfitSummary(periodParams);

      if (Array.isArray(res) && res.length > 0) {
        return res;
      }
      return [];
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Erro ao carregar dados de lucratividade";
      error.value = errorMessage;
      console.error("Erro ao carregar dados de lucratividade:", err);
      return [];
    } finally {
      loading.value = false;
    }
  };

  // Função para carregar overview de lucratividade
  const loadProfitabilityOverview = async (
    period?: PeriodFilter
  ): Promise<ProfitabilityOverview> => {
    try {
      loading.value = true;
      error.value = null;

      const periodParams = getPeriodParams(period);
      const [kpis, profitSummary] = await Promise.all([
        reportsApi.getKpisOverview(periodParams),
        reportsApi.getProfitSummary(periodParams),
      ]);

      const overview: ProfitabilityOverview = {
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        profitMargin: 0,
        averageEventValue: 0,
        totalEvents: 0,
      };

      if (kpis) {
        overview.totalEvents = kpis.data.events.count;
        overview.totalRevenue = kpis.data.events.total_revenue || 0;
        overview.averageEventValue =
          overview.totalEvents > 0
            ? overview.totalRevenue / overview.totalEvents
            : 0;
      }

      if (
        profitSummary &&
        Array.isArray(profitSummary) &&
        profitSummary.length > 0
      ) {
        overview.totalCost = profitSummary.reduce(
          (sum, item) => sum + parseFloat(item.cost || "0"),
          0
        );
        overview.totalProfit = profitSummary.reduce(
          (sum, item) => sum + parseFloat(item.profit || "0"),
          0
        );
        overview.profitMargin =
          overview.totalRevenue > 0
            ? (overview.totalProfit / overview.totalRevenue) * 100
            : 0;
      }

      return overview;
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Erro ao carregar overview de lucratividade";
      error.value = errorMessage;
      console.error("Erro ao carregar overview de lucratividade:", err);
      return {
        totalRevenue: 0,
        totalCost: 0,
        totalProfit: 0,
        profitMargin: 0,
        averageEventValue: 0,
        totalEvents: 0,
      };
    } finally {
      loading.value = false;
    }
  };

  // Função para carregar insights de lucratividade
  const loadProfitabilityInsights = async (
    period?: PeriodFilter
  ): Promise<ProfitabilityInsights> => {
    try {
      loading.value = true;
      error.value = null;

      const periodParams = getPeriodParams(period);
      const [kpis, profitSummary] = await Promise.all([
        reportsApi.getKpisOverview(periodParams),
        reportsApi.getProfitSummary(periodParams),
      ]);

      const insights: ProfitabilityInsights = {
        mostProfitableEvent: null,
        leastProfitableEvent: null,
        averageProfitMargin: 0,
        totalEvents: 0,
        profitableEvents: 0,
        unprofitableEvents: 0,
      };

      if (kpis && profitSummary) {
        const totalEvents = kpis.data.events.count;
        const totalRevenue = kpis.data.events.total_revenue || 0;
        const totalCost = kpis.data.events.total_cost || 0;
        const totalProfit = totalRevenue - totalCost;

        // Calcular margem média
        insights.averageProfitMargin =
          totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
        insights.totalEvents = totalEvents;

        // Simular distribuição baseada na margem média
        const isProfitable = insights.averageProfitMargin > 0;
        insights.profitableEvents = isProfitable
          ? Math.floor(totalEvents * 0.7)
          : Math.floor(totalEvents * 0.3);
        insights.unprofitableEvents = totalEvents - insights.profitableEvents;

        // Simular eventos mais e menos lucrativos baseados nos dados reais
        const avgEventProfit = totalEvents > 0 ? totalProfit / totalEvents : 0;
        const mostProfitableProfit = avgEventProfit * 1.5; // 50% acima da média
        const leastProfitableProfit = avgEventProfit * 0.3; // 70% abaixo da média

        insights.mostProfitableEvent = {
          name: "Evento Premium",
          profit: mostProfitableProfit,
          margin: totalRevenue > 0 ? (mostProfitableProfit / (totalRevenue / totalEvents)) * 100 : 0,
        };

        insights.leastProfitableEvent = {
          name: "Evento Básico",
          profit: leastProfitableProfit,
          margin: totalRevenue > 0 ? (leastProfitableProfit / (totalRevenue / totalEvents)) * 100 : 0,
        };
      }

      return insights;
    } catch (err) {
      const errorMessage =
        (err as Error).message || "Erro ao carregar insights de lucratividade";
      error.value = errorMessage;
      console.error("Erro ao carregar insights de lucratividade:", err);
      return {
        mostProfitableEvent: null,
        leastProfitableEvent: null,
        averageProfitMargin: 0,
        totalEvents: 0,
        profitableEvents: 0,
        unprofitableEvents: 0,
      };
    } finally {
      loading.value = false;
    }
  };

  return {
    // Estados
    loading: readonly(loading),
    error: readonly(error),
    events: events,
    totalItems: readonly(totalItems),
    itemsPerPage,
    currentPage,
    headers,

    // Funções de formatação
    formatPercentage,
    getStatusColor,

    // Funções de dados
    loadProfitData,
    loadProfitabilityOverview,
    loadProfitabilityInsights,
    fetchEvents,
  };
}
