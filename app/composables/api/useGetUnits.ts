type Options = {
    lazy?: boolean
    server?: boolean
    immediate?: boolean
}

export const useGetUnits = (options: Options) => {
    const { server = true, immediate = true, lazy = false } = options

    const { data, status, error, refresh, execute } = useFetch<Units[]>('/api/units', {
        lazy,
        server,
        immediate,
        key: 'units',
        getCachedData: (key, nuxtApp) => (nuxtApp.payload.data[key] || nuxtApp.static.data[key])
    });

    return {
        refresh,
        execute,
        error: readonly(error),
        status: readonly(status),
        data: data as unknown as Ref<Units[]>,
    }
}