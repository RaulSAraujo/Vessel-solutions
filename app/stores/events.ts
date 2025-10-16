import { useEventsApi } from '~/composables/api/useEventsApi';

import type { Datum } from "~/types/events";
import type { Datum as Drink } from "~/types/drinks";
import type { EmittedFilters } from "~/types/filter";
import type { TableDrinks } from "~/types/event-drinks";
import type { VDataTableServerOptions } from "~/types/data-table";

type SelectedDrink = Drink & { drink_categories: { name: string } };

export const useEventsStore = defineStore('events', () => {
    // Tabela
    const page = ref(1);
    const totalItems = ref(0)
    const loading = ref(false)
    const items = ref<Datum[]>([])
    const itemsPerPage = ref<10 | 25 | 50>(10)

    // Filtros
    const activeFilters = ref<EmittedFilters>({});

    // Evento selecionado para edição/exclusão
    const selectedEvent = ref<Datum | null>(null);

    // Drinks vinculados ao evento
    const drinks = ref<TableDrinks[]>([]);
    const loadingDrinks = ref(false)

    const estimatedQuantity = ref(0);

    const totalPercentageDrinks = computed(() => {
        return drinks.value.reduce(
            (sum, drink) => sum + (drink.drink_percentage || 0),
            0
        );
    });

    const totalCost = computed(() => {
        return parseFloat(drinks.value.reduce((sum, item) => {
            const estimatedQuantityForThisDrink = estimatedQuantity.value * (item.drink_percentage / 100)

            return sum + estimatedQuantityForThisDrink * item.calculated_cost
        }, 0).toFixed(2))
    });

    const totalRevenue = computed(() => {
        return parseFloat(drinks.value.reduce((sum, item) => {
            const estimatedQuantityForThisDrink = estimatedQuantity.value * (item.drink_percentage / 100)

            return sum + estimatedQuantityForThisDrink * item.selling_price
        }, 0).toFixed(2))
    });

    const profitMargin = computed(() => {
        return parseFloat(((totalRevenue.value - totalCost.value) / totalRevenue.value * 100).toFixed(1));
    });

    async function fetchEvents(props?: VDataTableServerOptions) {
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

        const res = await useEventsApi().getEvents(props, activeFilters.value);

        if (res) {
            items.value = res.data;
            totalItems.value = res.page.totalRows;
        }

        loading.value = false;
    }

    function addItem(item: Datum) {
        if (items.value.length > itemsPerPage.value) {
            items.value.pop();
        }

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

    function addSelectedDrink(selectedDrink: SelectedDrink) {
        drinks.value.push({
            drink_id: selectedDrink.id,
            name: selectedDrink.name,
            category: selectedDrink.drink_categories.name,
            description: selectedDrink.description,
            image_url: selectedDrink.image_url,
            calculated_cost: selectedDrink.calculated_cost || 0,
            selling_price: selectedDrink.selling_price || 0,
            profit_margin_percentage: selectedDrink.profit_margin_percentage || 0,
            drink_percentage: 0,
        });
    }

    function removeDrink(drink: TableDrinks) {
        const index = drinks.value.indexOf(drink);
        drinks.value.splice(index, 1);
    }

    function resetForm() {
        selectedEvent.value = null;
        drinks.value = [];
        estimatedQuantity.value = 0;
    }

    return {
        page,
        items,
        drinks,
        loading,
        addItem,
        totalCost,
        resetForm,
        updateItem,
        deleteItem,
        totalItems,
        fetchEvents,
        removeDrink,
        profitMargin,
        totalRevenue,
        itemsPerPage,
        activeFilters,
        loadingDrinks,
        selectedEvent,
        addSelectedDrink,
        estimatedQuantity,
        totalPercentageDrinks
    }
})