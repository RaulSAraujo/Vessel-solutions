import type { FetchError } from "ofetch";
import type { TablesInsert } from "~~/server/types/database";

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);
        const body = await readBody<TablesInsert<"purchase_list">>(event);

        // Adicionar user_id ao body
        const purchaseListItem = {
            ...body,
            user_id: user.id,
        };

        const { data, error } = await client
            .from('purchase_list')
            .insert(purchaseListItem)
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
            `);

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to create purchase list item',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to create purchase list item',
                message: 'No data returned after insertion.',
            });
        }

        return data[0];
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});
