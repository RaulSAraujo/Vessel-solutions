import type { FetchError } from 'ofetch'
import type { EmittedFilters } from "~/types/filter";
import type { VDataTableServerOptions } from '~/types/data-table';
import type { Quotations, Datum as Quotation } from '~/types/quotations'
import type { Ingredients, Datum, FormIngredients } from "~/types/ingredients";
import type { Options } from '~/types/use-fetch'

export function useIngredientsApi() {
    const getIngredients = async (props?: VDataTableServerOptions, filters?: EmittedFilters) => {
        try {
            const res = await $fetch<Ingredients>('/api/ingredients', {
                query: {
                    ...props,
                    filters
                },
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch ingredients.');
        }
    };

    const getIngredientById = async (id: string) => {
        try {
            const res = await $fetch<Datum>(`/api/ingredients/${id}`);

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to fetch ingredient with ID ${id}.`);
        }
    };

    const createIngredient = async (data: FormIngredients) => {
        try {
            const res = await $fetch<Datum>('/api/ingredients', {
                method: 'POST',
                body: data,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.data.message || 'Failed to create ingredient.');
        }
    };

    const updateIngredient = async (id: string, data: FormIngredients, currentQuotationId?: string | null) => {
        try {
            const res = await $fetch<Datum>(`/api/ingredients/${id}`, {
                method: 'PUT',
                body: {
                    ...data,
                    current_quotation_id: currentQuotationId
                },
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to update ingredient with ID ${id}.`);
        }
    };

    const deleteIngredient = async (id: string) => {
        try {
            await $fetch(`/api/ingredients/${id}`, {
                method: 'DELETE',
            });

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to delete ingredient with ID ${id}.`);
        }
    };

    const getQuotationByIngredientId = async (props?: VDataTableServerOptions, ingredientId?: string) => {
        try {
            const res = await $fetch<Quotations>(`/api/quotations`, {
                query: {
                    page: props?.page,
                    itemsPerPage: props?.itemsPerPage,
                    filters: {
                        'ingredient_id': {
                            op: 'eq',
                            value: ingredientId
                        }
                    }
                }
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to fetch quotation with ID ${ingredientId}.`);
        }
    };

    const setQuotationForIngredient = async (ingredient: Datum, quotation: Quotation,) => {
        try {
            const res = await $fetch<Datum>(`/api/ingredients/${ingredient.id}/set-quotation`, {
                method: 'PUT',
                body: {
                    quotation,
                    ingredient
                },
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to update ingredient with ID ${ingredient.id}.`);
        }
    };

    const removeQuotationForIngredient = async (id: string) => {
        try {
            const res = await $fetch<Datum>(`/api/ingredients/${id}/remove-quotation`, {
                method: 'PUT',
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to update ingredient with ID ${id}.`);
        }
    };

    return {
        getIngredients,
        getIngredientById,
        createIngredient,
        updateIngredient,
        deleteIngredient,
        getQuotationByIngredientId,
        setQuotationForIngredient,
        removeQuotationForIngredient
    }
}

export function useFetchIngredients(options: Options) {
    const { server = true, immediate = true, lazy = false } = options

    const { data, status, error, refresh, execute } = useFetch('/api/ingredients', {
        lazy,
        server,
        immediate,
        key: 'ingredients',
        transform: (data) => data.data,
        params: { page: 1, itemsPerPage: 1000 },
        getCachedData: (key, nuxtApp) => (nuxtApp.payload.data[key] || nuxtApp.static.data[key])
    });

    return {
        refresh,
        execute,
        error: readonly(error),
        status: readonly(status),
        data: data as unknown as Ref<Datum[]>,
    }
}