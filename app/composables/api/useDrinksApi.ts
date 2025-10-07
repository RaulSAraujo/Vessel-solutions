import type { FetchError } from 'ofetch'
import type { EmittedFilters } from "~/types/filter";
import type { VDataTableServerOptions } from '~/types/data-table';
import type { Drinks, Datum, FormDrink } from "~/types/drinks";

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
                body: data,
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
                body: data,
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

    return {
        getDrinks,
        getDrinkById,
        createDrink,
        updateDrink,
        deleteDrink
    }
}