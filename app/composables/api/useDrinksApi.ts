import type { FetchError } from 'ofetch'
import type { EmittedFilters } from "~/types/filter";
import type { VDataTableServerOptions } from '~/types/data-table';
import type { Drinks, Datum, FormDrink, DrinkIngredients } from "~/types/drinks";

export function useDrinksApi() {
    const getDrinks = async (props?: VDataTableServerOptions, filters?: EmittedFilters) => {
        try {
            const res = await $fetch<Drinks>('/api/drinks', {
                query: {
                    ...props,
                    filters
                },
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch drinks.');
        }
    };

    const getDrinkById = async (id: string) => {
        try {
            const res = await $fetch<Datum>(`/api/drinks/${id}`);

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to fetch drink with ID ${id}.`);
        }
    };

    const createDrink = async (data: FormDrink) => {
        try {
            const res = await $fetch<Datum>('/api/drinks', {
                method: 'POST',
                body: {
                    name: data.name,
                    type: data.type
                },
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.data.message || err.message || 'Failed to create drink.');
        }
    };

    const updateDrink = async (id: string, data: FormDrink) => {
        try {
            const res = await $fetch<Datum>(`/api/drinks/${id}`, {
                method: 'PUT',
                body: {
                    name: data.name,
                    type: data.type
                },
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to update drink with ID ${id}.`);
        }
    };

    const deleteDrink = async (id: string) => {
        try {
            await $fetch(`/api/drinks/${id}`, {
                method: 'DELETE',
            });

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to delete drink with ID ${id}.`);
        }
    };

    const createDrinkIngredients = async (drinkId: string, data: DrinkIngredients[]) => {
        try {
            const res = await $fetch(`/api/drinks/${drinkId}/ingredients`, {
                method: 'POST',
                body: data,
            });

            return res
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to create drink ingredients.');
        }
    };

    const updateDrinkIngredients = async (data: DrinkIngredients[]) => {
        try {
            const res = await $fetch(`/api/drink-ingredient/bulk`, {
                method: 'PUT',
                body: data,
            });

            return res
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to update drink ingredients.');
        }
    };

    const deleteDrinkIngredient = async (drinkIngredientId: string) => {
        try {
            await $fetch(`/api/drink-ingredient/${drinkIngredientId}`, {
                method: 'DELETE',
            });

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to delete drink ingredients.');
        }
    };

    return {
        getDrinks,
        getDrinkById,
        createDrink,
        updateDrink,
        deleteDrink,
        createDrinkIngredients,
        updateDrinkIngredients,
        deleteDrinkIngredient
    }
}