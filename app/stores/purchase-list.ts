import { defineStore } from 'pinia';
import { usePurchaseListApi } from '~/composables/api/usePurchaseListApi';
import type { VDataTableServerOptions } from "~/types/data-table";
import type { Datum, PurchaseListSummary } from '~/types/purchase-list';

export const usePurchaseListStore = defineStore('purchase-list', () => {
    const loading = ref(false);
    const summary = ref<PurchaseListSummary | null>(null);

    // Paginação
    const page = ref(1);
    const totalItems = ref(0);
    const items = ref<Datum[]>([])
    const selectedItems = ref<Datum[]>([]);
    const itemsPerPage = ref<10 | 25 | 50>(10);

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

        const res = await usePurchaseListApi().getPurchaseList(props);

        if (res) {
            items.value = res.data;
            totalItems.value = res.page.totalRows;
        }

        loading.value = false;

    };

    const fetchSummary = async (eventId?: string) => {
        loading.value = true;


        const data = await usePurchaseListApi().getPurchaseListSummary(eventId);

        if (data) {
            summary.value = data;
        };


        loading.value = false;
    };

    // const cleanupPurchaseList = async (eventId?: string) => {
    //     loading.value = true;
    //     error.value = null;

    //     try {
    //         const result = await $fetch('/api/purchase-list/cleanup', {
    //             method: 'POST',
    //             body: { event_id: eventId },
    //         });

    //         // Recarregar a lista após limpeza
    //         await fetchPurchaseList();
    //         return result;
    //     } catch (err: any) {
    //         error.value = err.message || 'Erro ao limpar lista de compras';
    //         throw err;
    //     } finally {
    //         loading.value = false;
    //     }
    // };

    const clearPurchaseList = () => {
        summary.value = null;
    };

    return {
        // State
        loading,
        summary,
        page,
        items,
        itemsPerPage,
        totalItems,
        selectedItems,

        // Actions
        fetchPurchaseList,
        fetchSummary,
        clearPurchaseList,
    };
});
