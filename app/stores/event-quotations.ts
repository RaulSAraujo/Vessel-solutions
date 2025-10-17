import { useEventQuotationsApi } from '~/composables/api/useEventQuotationsApi';

import type { EventQuotation } from "~/types/event-quotations";
import type { EmittedFilters } from "~/types/filter";
import type { VDataTableServerOptions } from "~/types/data-table";
import type { TableDrinks } from "~/types/event-drinks";
import type { Datum as Drink } from "~/types/drinks";

type SelectedDrink = Drink & { drink_categories: { name: string } };

export const useEventQuotationsStore = defineStore('eventQuotations', () => {
    // Tabela
    const page = ref(1);
    const totalItems = ref(0)
    const loading = ref(false)
    const items = ref<EventQuotation[]>([])
    const itemsPerPage = ref<10 | 25 | 50>(10)

    // Filtros
    const activeFilters = ref<EmittedFilters>({});

    // Evento selecionado para edição/exclusão
    const selectedEventQuotation = ref<EventQuotation | null>(null);

    // Drinks vinculados ao evento
    const drinks = ref<TableDrinks[]>([]);
    const loadingDrinks = ref<boolean>(false)

    // Quantidade estimada de drinks
    const estimatedQuantity = ref<number>(0);

    // Duração do evento
    const eventDurationHours = ref<number>(0);

    // Custos de staff e helper
    const staffCost = ref<number>(0);

    // Custo de combustível
    const fuelCost = ref<number>(0);

    const totalPercentageDrinks = computed(() => {
        return drinks.value.reduce(
            (sum, drink) => sum + (drink.drink_percentage || 0),
            0
        );
    });

    const totalCost = computed(() => {
        return parseFloat(drinks.value.reduce((sum, item) => {
            const estimatedQuantityForThisDrink = estimatedQuantity.value * (item.drink_percentage / 100)

            return sum + estimatedQuantityForThisDrink * (item.drink_calculated_cost || 0)
        }, 0).toFixed(2))
    });

    const totalRevenue = computed(() => {
        return parseFloat(drinks.value.reduce((sum, item) => {
            const estimatedQuantityForThisDrink = estimatedQuantity.value * (item.drink_percentage / 100)

            return sum + estimatedQuantityForThisDrink * (item.drink_selling_price || 0)
        }, 0).toFixed(2))
    });

    const totalCostWithStaffAndFuel = computed(() => {
        return parseFloat((totalCost.value + staffCost.value + fuelCost.value).toFixed(2));
    });

    const profitMargin = computed(() => {
        const totalCostFinal = totalCostWithStaffAndFuel.value;
        return totalRevenue.value > 0 ? parseFloat(((totalRevenue.value - totalCostFinal) / totalRevenue.value * 100).toFixed(1)) : 0;
    });

    async function fetchEventQuotations(props?: VDataTableServerOptions) {
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

        const res = await useEventQuotationsApi().getEventQuotations(props, activeFilters.value);

        if (res) {
            items.value = res.data;
            totalItems.value = res.page.totalRows;
        }

        loading.value = false;
    }

    function addItem(item: EventQuotation) {
        if (items.value.length > itemsPerPage.value) {
            items.value.pop();
        }

        items.value.splice(0, 0, item);
        totalItems.value += 1;
    }

    function updateItem(item: EventQuotation) {
        const index = items.value.findIndex((i) => i.id === item.id);
        if (index !== -1) {
            items.value[index] = item;
        }
    }

    function deleteItem(item: EventQuotation) {
        const index = items.value.findIndex((i) => i.id === item.id);
        if (index !== -1) {
            items.value.splice(index, 1);
            totalItems.value -= 1;
        }
    }

    function setSelectedEventQuotation(quotation: EventQuotation | null) {
        selectedEventQuotation.value = quotation;
    }

    function addSelectedDrink(selectedDrink: SelectedDrink) {
        drinks.value.push({
            id: crypto.randomUUID(), // Gerar ID temporário para novos drinks
            drink_name: selectedDrink.name,
            drink_category_name: selectedDrink.drink_categories.name,
            drink_description: selectedDrink.description,
            drink_image_url: selectedDrink.image_url,
            drink_calculated_cost: selectedDrink.calculated_cost || 0,
            drink_selling_price: selectedDrink.selling_price || 0,
            drink_profit_margin_percentage: selectedDrink.profit_margin_percentage || 0,
            drink_percentage: 0,
        });
    }

    function removeDrink(drink: TableDrinks) {
        const index = drinks.value.indexOf(drink);
        drinks.value.splice(index, 1);
    }

    function calculateEventDuration(startTime: string, endTime: string) {
        if (!startTime || !endTime) {
            eventDurationHours.value = 0;
            return;
        }

        const start = new Date(formatDateTimeToDB(startTime));
        const end = new Date(formatDateTimeToDB(endTime));
        eventDurationHours.value = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }

    function resetForm() {
        selectedEventQuotation.value = null;
        drinks.value = [];
        estimatedQuantity.value = 0;
        eventDurationHours.value = 0;
    }

    return {
        page,
        items,
        drinks,
        loading,
        addItem,
        fuelCost,
        staffCost,
        totalCost,
        resetForm,
        updateItem,
        deleteItem,
        totalItems,
        fetchEventQuotations,
        removeDrink,
        profitMargin,
        totalRevenue,
        itemsPerPage,
        activeFilters,
        loadingDrinks,
        selectedEventQuotation,
        addSelectedDrink,
        estimatedQuantity,
        eventDurationHours,
        totalPercentageDrinks,
        calculateEventDuration,
        totalCostWithStaffAndFuel
    }
})
