import dayjs from 'dayjs';
import type { FetchError } from 'ofetch'
import type { EmittedFilters } from "~/types/filter";
import type { VDataTableServerOptions } from '~/types/data-table';
import type { Quotations, Datum, FormQuotations } from "~/types/quotations";

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
            const newData = { ...data };
            if (newData.quotation_date) {
                newData.quotation_date = dayjs(newData.quotation_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
            }

            const res = await $fetch<Datum>('/api/quotations', {
                method: 'POST',
                body: newData,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to create Quotation.');
        }
    };

    const updateQuotation = async (id: string, data: FormQuotations) => {
        try {
            const newData = { ...data };
            if (newData.quotation_date) {
                newData.quotation_date = dayjs(newData.quotation_date, 'DD/MM/YYYY').format('YYYY-MM-DD');
            }

            const res = await $fetch<Datum>(`/api/quotations/${id}`, {
                method: 'PUT',
                body: newData,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.data?.message || err.message || `Failed to update Quotation with ID ${id}.`);
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
            const errorMessage = err.data?.message || err.message || '';
            if (errorMessage.includes('foreign key')) {
                $toast().error('Não é possível excluir uma cotação que esteja vinculada a um ingrediente.');

                return;
            }

            $toast().error(errorMessage || `Failed to delete Quotation with ID ${id}.`);
        }
    };

    return {
        getQuotations,
        getQuotationById,
        createQuotation,
        updateQuotation,
        deleteQuotation
    }
}