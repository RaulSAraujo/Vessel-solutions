import type { FetchError } from "ofetch";
import type { TablesUpdate } from "~~/server/types/database";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const purchaseListItemId = event.context.params?.id;

        const body = await readBody<TablesUpdate<"purchase_list">>(event);

        if (!purchaseListItemId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Purchase list item ID is required.',
            });
        }

        const { data, error } = await client
            .from('purchase_list')
            .update(body)
            .eq('id', purchaseListItemId)
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
                statusMessage: 'Failed to update purchase list item',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: `Purchase list item with ID ${purchaseListItemId} not found or not accessible for update.`,
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
