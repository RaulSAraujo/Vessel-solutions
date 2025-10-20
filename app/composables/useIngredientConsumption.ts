import { useReportsApi } from "~/composables/api/useReportsApi";
import type { PeriodFilter } from "~/composables/usePeriodFilter";

export interface IngredientConsumption {
    name: string;
    unit: string;
    totalQuantity: number;
    totalCost: number;
    eventsUsed: number;
    averageCostPerUnit: number;
}

export interface IngredientConsumptionSummary {
    totalCost: number;
    totalIngredients: number;
    totalEvents: number;
    averageCostPerEvent: number;
}

export interface IngredientConsumptionResponse {
    data: IngredientConsumption[];
    summary: IngredientConsumptionSummary;
}

export interface IngredientConsumptionInsights {
    mostUsedIngredient: IngredientConsumption | null;
    mostExpensiveIngredient: IngredientConsumption | null;
    averageCostPerEvent: number;
    totalIngredients: number;
    totalEvents: number;
    costDistribution: {
        high: number;
        medium: number;
        low: number;
    };
}

export function useIngredientConsumption() {
    const reportsApi = useReportsApi();
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Função para obter parâmetros do período
    const getPeriodParams = (period?: PeriodFilter) => {
        return period
            ? {
                start_date: period.startDate,
                end_date: period.endDate,
            }
            : undefined;
    };

    // Função para formatar quantidade
    const formatQuantity = (value: number, unit: string) => {
        return `${value.toFixed(2)} ${unit}`;
    };

    // Função para carregar dados de consumo de ingredientes
    const loadConsumptionData = async (
        period?: PeriodFilter
    ): Promise<IngredientConsumptionResponse | null> => {
        try {
            loading.value = true;
            error.value = null;

            const periodParams = getPeriodParams(period);
            const response = await reportsApi.getIngredientConsumption(periodParams);

            if (response?.data && response?.summary) {
                return response;
            }
            return null;
        } catch (err) {
            const errorMessage =
                (err as Error).message || "Erro ao carregar dados de consumo";
            error.value = errorMessage;
            console.error("Erro ao carregar dados de consumo:", err);
            return null;
        } finally {
            loading.value = false;
        }
    };

    // Função para carregar overview de consumo
    const loadConsumptionOverview = async (
        period?: PeriodFilter
    ): Promise<IngredientConsumptionSummary> => {
        try {
            loading.value = true;
            error.value = null;

            const response = await loadConsumptionData(period);

            if (response?.summary) {
                return response.summary;
            }

            return {
                totalCost: 0,
                totalIngredients: 0,
                totalEvents: 0,
                averageCostPerEvent: 0,
            };
        } catch (err) {
            const errorMessage =
                (err as Error).message || "Erro ao carregar overview de consumo";
            error.value = errorMessage;
            console.error("Erro ao carregar overview de consumo:", err);
            return {
                totalCost: 0,
                totalIngredients: 0,
                totalEvents: 0,
                averageCostPerEvent: 0,
            };
        } finally {
            loading.value = false;
        }
    };

    // Função para carregar insights de consumo
    const loadConsumptionInsights = async (
        period?: PeriodFilter
    ): Promise<IngredientConsumptionInsights> => {
        try {
            loading.value = true;
            error.value = null;

            const response = await loadConsumptionData(period);

            if (!response?.data || !response?.summary) {
                return {
                    mostUsedIngredient: null,
                    mostExpensiveIngredient: null,
                    averageCostPerEvent: 0,
                    totalIngredients: 0,
                    totalEvents: 0,
                    costDistribution: {
                        high: 0,
                        medium: 0,
                        low: 0,
                    },
                };
            }

            const data = response.data;
            const summary = response.summary;

            // Encontrar ingrediente mais usado
            const mostUsed = data.length > 0
                ? data.reduce(
                    (max, item) => (item.totalQuantity > max.totalQuantity ? item : max),
                    data[0]
                )
                : null;

            // Encontrar ingrediente mais caro
            const mostExpensive = data.length > 0
                ? data.reduce(
                    (max, item) => (item.totalCost > max.totalCost ? item : max),
                    data[0]
                )
                : null;

            // Calcular distribuição de custos
            const totalCost = summary.totalCost;
            const highCostThreshold = totalCost * 0.7; // 70% do custo total
            const mediumCostThreshold = totalCost * 0.2; // 20% do custo total

            let highCost = 0,
                mediumCost = 0,
                lowCost = 0;

            data.forEach((item) => {
                if (item.totalCost >= highCostThreshold) {
                    highCost++;
                } else if (item.totalCost >= mediumCostThreshold) {
                    mediumCost++;
                } else {
                    lowCost++;
                }
            });

            return {
                mostUsedIngredient: mostUsed,
                mostExpensiveIngredient: mostExpensive,
                averageCostPerEvent: summary.averageCostPerEvent,
                totalIngredients: summary.totalIngredients,
                totalEvents: summary.totalEvents,
                costDistribution: {
                    high: highCost,
                    medium: mediumCost,
                    low: lowCost,
                },
            };
        } catch (err) {
            const errorMessage =
                (err as Error).message || "Erro ao carregar insights de consumo";
            error.value = errorMessage;
            console.error("Erro ao carregar insights de consumo:", err);
            return {
                mostUsedIngredient: null,
                mostExpensiveIngredient: null,
                averageCostPerEvent: 0,
                totalIngredients: 0,
                totalEvents: 0,
                costDistribution: {
                    high: 0,
                    medium: 0,
                    low: 0,
                },
            };
        } finally {
            loading.value = false;
        }
    };

    // Função para exportar dados para CSV
    const exportToCSV = (data: IngredientConsumption[], filename?: string) => {
        const csvContent = [
            // Cabeçalho
            [
                "Ingrediente",
                "Unidade",
                "Quantidade Total",
                "Custo Total",
                "Custo/Unidade",
                "Eventos",
                "Custo/Evento",
            ].join(","),
            // Dados
            ...data.map((item) =>
                [
                    `"${item.name}"`,
                    `"${item.unit}"`,
                    item.totalQuantity,
                    item.totalCost,
                    item.averageCostPerUnit,
                    item.eventsUsed,
                    item.eventsUsed > 0 ? item.totalCost / item.eventsUsed : 0,
                ].join(",")
            ),
        ].join("\n");

        // Criar e baixar arquivo
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
            "download",
            filename || `consumo-ingredientes-${new Date().toISOString().split("T")[0]}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return {
        // Estados
        loading: readonly(loading),
        error: readonly(error),

        // Funções de formatação
        formatQuantity,

        // Funções de dados
        loadConsumptionData,
        loadConsumptionOverview,
        loadConsumptionInsights,
        exportToCSV,
    };
}
