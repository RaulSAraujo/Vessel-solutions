import { defineStore } from 'pinia';
import { useClientsApi } from '~/composables/api/useClientsApi';

import type { Datum } from "~/types/client";
import type { EmittedFilters } from "~/types/filter";
import type { VDataTableServerOptions } from "~/types/data-table";

export const useClientsStore = defineStore('clients', () => {
    // Tabela
    const page = ref(1);
    const totalItems = ref(0)
    const loading = ref(false)
    const items = ref<Datum[]>([])
    const itemsPerPage = ref<10 | 25 | 50>(10)

    // Filtros
    const activeFilters = ref<EmittedFilters>({});

    // Update
    const selectedClient = ref<Datum | null>(null);

    async function fetchClients(props?: VDataTableServerOptions) {
        loading.value = true;

        // Se props nao for passado, cria um objeto com as propriedades padrão
        if (!props || typeof props !== 'object' || !('page' in props)) {
            props = {
                page: page.value,
                itemsPerPage: itemsPerPage.value,
                groupBy: [],
                sortBy: [],
                search: '',
            };
        }

        const res = await useClientsApi().getClients(props, activeFilters.value);

        if (res) {
            items.value = res.data;
            totalItems.value = res.page.totalRows;
        }

        loading.value = false;
    }

    function addItem(item: Datum) {
        items.value.pop();
        items.value.splice(0, 0, item);
        totalItems.value += 1;
    }

    function updateItem(item: Datum) {
        const index = items.value.findIndex((i) => i.id === item.id);
        items.value[index] = item;
    }

    function deleteItem(item: Datum) {
        const index = items.value.findIndex((i) => i.id === item.id);
        items.value.splice(index, 1);
        totalItems.value -= 1;
    }

    return {
        page,
        items,
        loading,
        addItem,
        updateItem,
        deleteItem,
        totalItems,
        fetchClients,
        itemsPerPage,
        activeFilters,
        selectedClient,
    }
})