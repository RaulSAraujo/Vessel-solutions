import type { Datum } from '~/types/ingredients';

type Options = {
    lazy?: boolean
    server?: boolean
    immediate?: boolean
}

export const useGetIngredients = (options: Options) => {
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