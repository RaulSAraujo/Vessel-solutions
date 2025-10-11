import type { FetchError } from 'ofetch'
import type { Options } from "~/types/use-fetch";
import type { EmittedFilters } from "~/types/filter";
import type { VDataTableServerOptions } from '~/types/data-table';
import type { Supplier, Datum, FormSupplier } from "~/types/suppliers";

export function useSuppliersApi() {
    const getSuppliers = async (props?: VDataTableServerOptions, filters?: EmittedFilters) => {
        try {
            const res = await $fetch<Supplier>('/api/suppliers', {
                query: {
                    ...props,
                    filters
                },
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch suppliers.');
        }
    };

    const getSupplierById = async (id: string) => {
        try {
            const res = await $fetch<Datum>(`/api/suppliers/${id}`);

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to fetch supplier with ID ${id}.`);
        }
    };

    const createSupplier = async (data: FormSupplier) => {
        try {
            const res = await $fetch<Datum>('/api/suppliers', {
                method: 'POST',
                body: data,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to create supplier.');
        }
    };

    const updateSupplier = async (id: string, data: FormSupplier) => {
        try {
            const res = await $fetch<Datum>(`/api/suppliers/${id}`, {
                method: 'PUT',
                body: data,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to update supplier with ID ${id}.`);
        }
    };

    const deleteSupplier = async (id: string) => {
        try {
            await $fetch(`/api/suppliers/${id}`, {
                method: 'DELETE',
            });

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to delete supplier with ID ${id}.`);
        }
    };

    return {
        getSuppliers,
        getSupplierById,
        createSupplier,
        updateSupplier,
        deleteSupplier
    }
}

export const useFetchSuppliers = (options: Options) => {
    const { server = true, immediate = true, lazy = false } = options

    const { data, status, error, refresh, execute } = useFetch('/api/suppliers', {
        lazy,
        server,
        immediate,
        key: 'suppliers',
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