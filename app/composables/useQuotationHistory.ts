import { ref, computed } from "vue";
import { useReportsApi } from "~/composables/api/useReportsApi";
import type { PeriodFilter } from "~/composables/usePeriodFilter";
import type {
    QuotationItem,
    SupplierAnalysis,
    PriceHistoryItem,
    IngredientPriceTrend,
    QuotationHistoryData,
    QuotationHistorySummary,
    QuotationHistoryResponse,
    QuotationInsights,
    QuotationOverview,
    QuotationWithCalculations,
} from "~/types/quotation-history";

export function useQuotationHistory() {
    const reportsApi = useReportsApi();
    const loading = ref<boolean>(false);
    const errorMessage = ref<string | null>(null);

    // Dados reativos
    const quotationData = ref<QuotationHistoryData | null>(null);
    const quotations = ref<QuotationItem[]>([]);
    const overview = ref<QuotationOverview>({
        totalQuotations: 0,
        totalValue: 0,
        averageQuotationValue: 0,
        totalSuppliers: 0,
        totalIngredients: 0,
    });
    const insights = ref<QuotationInsights>({
        topSupplier: null,
        averageQuotationValue: 0,
        totalQuotations: 0,
        totalSuppliers: 0,
        priceVariation: {
            high: 0,
            medium: 0,
            low: 0,
        },
    });

    // Headers da tabela
    const headers = [
        { title: "Fornecedor", key: "supplier_name", sortable: true },
        { title: "Data", key: "created_at", sortable: true },
        { title: "Ingrediente", key: "ingredient_name", sortable: true },
        { title: "Preço Unit.", key: "purchase_price", sortable: true },
        { title: "Quantidade", key: "purchase_quantity", sortable: true },
        { title: "Valor Total", key: "total_value", sortable: true },
        { title: "Ações", key: "actions", sortable: false },
    ] as const;

    // Função principal para carregar dados
    async function loadQuotationData(period?: PeriodFilter): Promise<void> {
        loading.value = true;
        errorMessage.value = null;

        try {
            const periodParams = period
                ? {
                    start_date: period.startDate,
                    end_date: period.endDate,
                }
                : undefined;

            const response = await reportsApi.getQuotationHistory(periodParams) as QuotationHistoryResponse;

            if (response?.data) {
                quotationData.value = response.data;
                quotations.value = response.data.quotations || [];

                // Atualizar overview
                if (response.summary) {
                    overview.value = {
                        totalQuotations: response.summary.totalQuotations,
                        totalValue: response.summary.totalValue,
                        averageQuotationValue: response.summary.averageQuotationValue,
                        totalSuppliers: response.summary.totalSuppliers,
                        totalIngredients: response.summary.totalIngredients,
                    };
                }

                // Calcular insights
                calculateInsights(response.data, response.summary);
            } else {
                quotationData.value = null;
                quotations.value = [];
            }
        } catch (error) {
            console.error("Erro ao carregar dados de cotações:", error);
            errorMessage.value = (error as Error).message;
            quotationData.value = null;
            quotations.value = [];
        } finally {
            loading.value = false;
        }
    }

    // Calcular insights dos dados
    function calculateInsights(data: QuotationHistoryData, summary: QuotationHistorySummary): void {
        // Encontrar fornecedor com maior valor total
        const topSupplier = data.suppliers?.reduce(
            (max: SupplierAnalysis, supplier: SupplierAnalysis) =>
                supplier.totalValue > max.totalValue ? supplier : max,
            data.suppliers?.[0] || {} as SupplierAnalysis
        );

        // Calcular variação de preços
        const priceVariations =
            data.ingredientPriceTrend?.map((item: IngredientPriceTrend) => item.priceVariation) || [];
        const highVariation = priceVariations.filter((v: number) => v > 20).length;
        const mediumVariation = priceVariations.filter(
            (v: number) => v >= 10 && v <= 20
        ).length;
        const lowVariation = priceVariations.filter((v: number) => v < 10).length;

        insights.value = {
            topSupplier: topSupplier || null,
            averageQuotationValue: summary?.averageQuotationValue || 0,
            totalQuotations: summary?.totalQuotations || 0,
            totalSuppliers: summary?.totalSuppliers || 0,
            priceVariation: {
                high: highVariation,
                medium: mediumVariation,
                low: lowVariation,
            },
        };
    }

    // Computed para adicionar cálculos
    const quotationsWithCalculations = computed((): QuotationWithCalculations[] => {
        return quotations.value.map((quotation: QuotationItem): QuotationWithCalculations => ({
            ...quotation,
            supplier_name: quotation.suppliers?.name || "N/A",
            ingredient_name: quotation.ingredients?.name || "N/A",
            // O valor total já vem calculado com conversão de unidades do servidor
            total_value: quotation.total_value || (quotation.purchase_price * quotation.purchase_quantity),
        }));
    });

    // Dados do gráfico
    const chartData = computed(() => {
        if (!quotationData.value?.suppliers?.length)
            return [];

        // Pegar top 5 fornecedores por valor total
        const topSuppliers = quotationData.value.suppliers.slice(0, 5);

        return topSuppliers.map((supplier: SupplierAnalysis, index: number) => ({
            name: supplier.name,
            value: supplier.totalValue,
            color: [
                "rgba(33, 150, 243, 0.8)",
                "rgba(76, 175, 80, 0.8)",
                "rgba(255, 193, 7, 0.8)",
                "rgba(156, 39, 176, 0.8)",
                "rgba(244, 67, 54, 0.8)",
            ][index % 5],
        }));
    });


    function getSupplierColor(index: number): string {
        const colors = ["primary", "success", "warning", "error", "info"];
        return colors[index % colors.length];
    }

    // Função de formatação de data
    function formatDate(date: string): string {
        return new Date(date).toLocaleDateString("pt-BR");
    }

    // Função de exportação
    function handleExport(): void {
        const csvContent = [
            // Cabeçalho
            [
                "Fornecedor",
                "Data",
                "Ingrediente",
                "Preço Unitário",
                "Quantidade",
                "Valor Total",
            ].join(","),
            // Dados
            ...quotationsWithCalculations.value.map((quotation: QuotationWithCalculations) =>
                [
                    `"${quotation.supplier_name}"`,
                    `"${formatDate(quotation.created_at)}"`,
                    `"${quotation.ingredient_name}"`,
                    quotation.purchase_price,
                    quotation.purchase_quantity,
                    quotation.total_value,
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
            `historico-cotacoes-${new Date().toISOString().split("T")[0]}.csv`
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return {
        // Estado
        loading,
        errorMessage,
        quotationData,
        quotations,
        overview,
        insights,
        headers,
        quotationsWithCalculations,
        chartData,

        // Métodos
        loadQuotationData,
        formatDate,
        getSupplierColor,
        handleExport,
    };
}
