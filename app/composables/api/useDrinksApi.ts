import type { FetchError } from 'ofetch'
import type { Options } from '~/types/use-fetch'
import type { EmittedFilters } from "~/types/filter";
import type { Drinks, Datum, FormDrink } from "~/types/drinks";
import type { VDataTableServerOptions } from '~/types/data-table';
import type { Datum as Ingredient } from '~/types/ingredients';
import type { FormDrinkIngredients, Datum as DrinkIngredient } from '~/types/drink-ingredient';

type DrinkIngredientsWithRelations = DrinkIngredient & { ingredients: Ingredient & { units: { name: string, abbreviation: string } } }

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
                    image_url: data.image_url,
                    description: data.description,
                    selling_price: data.selling_price,
                    calculated_cost: data.calculated_cost,
                    profit_margin_percentage: data.profit_margin_percentage?.toFixed(1)
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
                    image_url: data.image_url,
                    description: data.description,
                    selling_price: data.selling_price,
                    calculated_cost: data.calculated_cost,
                    profit_margin_percentage: data.profit_margin_percentage?.toFixed(1)
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

    const getDrinkIngredients = async (drinkId: string) => {
        try {
            const res = await $fetch<DrinkIngredientsWithRelations[]>(`/api/drinks/${drinkId}/ingredients`);

            return res
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch drink ingredients.');
        }
    };

    const upsertDrinkIngredients = async (drinkId: string, data: FormDrinkIngredients[]) => {
        try {
            const res = await $fetch(`/api/drinks/${drinkId}/ingredients/upsert-multiple`, {
                method: 'POST',
                body: data,
            });

            return res
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to create drink ingredients.');
        }
    };

    const deleteDrinkIngredient = async (drinkId: string, ingredientId: string) => {
        try {

            await $fetch(`/api/drinks/${drinkId}/ingredients/${ingredientId}`, {
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
        getDrinkIngredients,
        upsertDrinkIngredients,
        deleteDrinkIngredient
    }
}
