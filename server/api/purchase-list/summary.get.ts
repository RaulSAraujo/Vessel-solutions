import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);

        const query = getQuery(event);
        const eventId = query.event_id as string;

        let supabaseQuery = client
            .from("purchase_list")
            .select(`
                id,
                status,
                quantity_needed,
                unit_id,
                estimated_cost,
                ingredients!inner (
                    id,
                    name,
                    unit_id,
                    current_quotation_id,
                    unit_weight_g,
                    unit_volume_ml,
                    real_cost_per_base_unit
                ),
                units!inner (
                    id,
                    name,
                    abbreviation
                )
            `);

        if (eventId) {
            supabaseQuery = supabaseQuery.eq('event_id', eventId);
        }

        const { data, error } = await supabaseQuery;

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch purchase list summary',
                message: error.message,
            });
        }

        const summary = {
            total_items: data?.length || 0,
            pending_items: data?.filter(item => item.status === 'pending').length || 0,
            purchased_items: data?.filter(item => item.status === 'purchased').length || 0,
            cancelled_items: data?.filter(item => item.status === 'cancelled').length || 0,
            total_estimated_cost: 0,
        };

        // Calcular custo total estimado usando o campo estimated_cost
        if (data) {
            summary.total_estimated_cost = data.reduce((total, item) => {
                return total + (item.estimated_cost || 0);
            }, 0);
        }

        return summary;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});
