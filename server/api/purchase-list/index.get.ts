import type { FetchError } from "ofetch";
import type { Tables } from '~~/server/types/database';

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);

        const query = getQuery(event);

        const page = parseInt(query.page as string) || 1;
        const itemsPerPage = parseInt(query.itemsPerPage as string) || 10;
        const offset = (page - 1) * itemsPerPage;

        let supabaseQuery = client
            .from("purchase_list")
            .select(`
                *,
                events!inner (
                    id,
                    location,
                    start_time,
                    end_time,
                    guest_count,
                    clients!inner (name)
                ),
                ingredients!inner (
                    id,
                    name,
                    unit_weight_g,
                    unit_volume_ml,
                    wastage_percentage,
                    real_cost_per_base_unit,
                    current_quotation_id,
                    units (name, abbreviation)
                ),
                units (id, name, abbreviation)
            `, { count: "exact" });

        if (query.filters && typeof query.filters === "string") {
            try {
                const filters = JSON.parse(query.filters);
                supabaseQuery = applySupabaseFilters(supabaseQuery, filters);
            } catch (jsonError) {
                console.error("Failed to parse filters JSON:", jsonError);
                throw createError({
                    statusCode: 400,
                    statusMessage: "Bad Request",
                    message: "Invalid 'filters' parameter format. Must be a valid JSON string.",
                });
            }
        }

        const sortByParam = query.sortBy === null ? undefined : query.sortBy;
        supabaseQuery = applySort(supabaseQuery, sortByParam);

        const { data, error, count } = await supabaseQuery.range(offset, offset + itemsPerPage - 1);

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch purchase list',
                message: error.message,
            });
        }

        return {
            data: data as any[],
            page: {
                page,
                itemsPerPage,
                totalRows: count,
                totalPages: Math.ceil((count || 0) / itemsPerPage),
            }
        };
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});
