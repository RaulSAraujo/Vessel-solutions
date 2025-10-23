import type { FetchError } from 'ofetch'
import type { EmittedFilters } from "~/types/filter";
import type { VDataTableServerOptions } from '~/types/data-table';
import type { PurchaseList, Datum, FormPurchaseListItem, PurchaseListSummary } from '~/types/purchase-list';

export const usePurchaseListApi = () => {
    const getPurchaseList = async (props?: VDataTableServerOptions, filters?: EmittedFilters) => {
        try {
            const res = await $fetch<PurchaseList>('/api/purchase-list', {
                query: {
                    ...props,
                    filters
                },
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch purchase list.');
        }
    };

    const updatePurchaseListItem = async (id: string, data: Partial<FormPurchaseListItem>) => {
        try {
            const res = await $fetch<Datum>(`/api/purchase-list/${id}`, {
                method: 'PUT',
                body: data,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.data.message || `Failed to update Quotation with ID ${id}.`);
        }
    };

    const getPurchaseListSummary = async (eventId?: string) => {
        try {
            const res = await $fetch<PurchaseListSummary>(`/api/purchase-list/summary`, {
                params: {
                    event_id: eventId
                }
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;

            $toast().error(err.data.message || `Failed to fetch purchase list summary for ID ${eventId}.`);
        }
    };

    return {
        getPurchaseList,
        updatePurchaseListItem,
        getPurchaseListSummary
    };
};
