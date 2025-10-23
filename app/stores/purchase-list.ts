import { defineStore } from 'pinia';
import { usePurchaseListApi } from '~/composables/api/usePurchaseListApi';
import type { EmittedFilters } from "~/types/filter";
import type { VDataTableServerOptions } from "~/types/data-table";
import type { Datum, PurchaseListSummary } from '~/types/purchase-list';

export const usePurchaseListStore = defineStore('purchase-list', () => {
    const summary = ref<PurchaseListSummary | null>(null);

    // Paginação
    const page = ref(1);
    const totalItems = ref(0);
    const loading = ref(false);
    const items = ref<Datum[]>([])
    const selectedItems = ref<Datum[]>([]);
    const itemsPerPage = ref<10 | 25 | 50>(10);

    // Filtros
    const activeFilters = ref<EmittedFilters>({});

    // Actions
    const fetchPurchaseList = async (props?: VDataTableServerOptions) => {
        loading.value = true;

        if (!props || typeof props !== 'object' || !('page' in props)) {
            props = {
                page: page.value,
                itemsPerPage: itemsPerPage.value,
                groupBy: [],
                sortBy: [],
                search: '',
            };
        }

        const res = await usePurchaseListApi().getPurchaseList(props, activeFilters.value);

        if (res) {
            items.value = res.data;
            totalItems.value = res.page.totalRows;
        }

        loading.value = false;

    };

    const fetchSummary = async (eventId?: string) => {
        const data = await usePurchaseListApi().getPurchaseListSummary(eventId);

        if (data) {
            summary.value = data;
        };
    };

    function updateItem(item: Datum) {
        const index = items.value.findIndex((i) => i.id === item.id);
        items.value[index] = item;
    }

    return {
        // State
        summary,
        page,
        loading,
        items,
        itemsPerPage,
        totalItems,
        selectedItems,
        activeFilters,

        // Actions
        fetchPurchaseList,
        fetchSummary,
        updateItem
    };
});
