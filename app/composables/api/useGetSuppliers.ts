import type { Datum } from '~/types/suppliers';

type Options = {
    lazy?: boolean
    server?: boolean
    immediate?: boolean
}

export const useGetSuppliers = (options: Options) => {
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