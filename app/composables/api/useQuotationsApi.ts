import type { FetchError } from 'ofetch'
import type { EmittedFilters } from "~/types/filter";
import type { VDataTableServerOptions } from '~/types/data-table';
import type { Quotations, Datum, FormQuotations, Supplier, Ingredient } from "~/types/quotations";

export function useQuotationsApi() {
    const getQuotations = async (props?: VDataTableServerOptions, filters?: EmittedFilters) => {
        try {
            const res = await $fetch<Quotations>('/api/quotations', {
                query: {
                    ...props,
                    filters
                },
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch quotations.');
        }
    };

    const getQuotationById = async (id: string) => {
        try {
            const res = await $fetch<Datum>(`/api/quotations/${id}`);

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to fetch Quotation with ID ${id}.`);
        }
    };

    const createQuotation = async (data: FormQuotations) => {
        try {
            const res = await $fetch<Datum>('/api/quotations', {
                method: 'POST',
                body: data,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to create Quotation.');
        }
    };

    const updateQuotation = async (id: string, data: FormQuotations) => {
        try {
            const res = await $fetch<Datum>(`/api/quotations/${id}`, {
                method: 'PUT',
                body: data,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to update Quotation with ID ${id}.`);
        }
    };

    const deleteQuotation = async (id: string) => {
        try {
            await $fetch(`/api/quotations/${id}`, {
                method: 'DELETE',
            });

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to delete Quotation with ID ${id}.`);
        }
    };

    const getSuppliers = async () => {
        try {
            const res = await $fetch<Supplier[]>('/api/quotations/suppliers');

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch suppliers.');
        }
    };

    const getIngredients = async () => {
        try {
            const res = await $fetch<Ingredient[]>('/api/quotations/ingredients');

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch ingredients.');
        }
    };

    return {
        getQuotations,
        getQuotationById,
        createQuotation,
        updateQuotation,
        deleteQuotation,
        getSuppliers,
        getIngredients
    }
}