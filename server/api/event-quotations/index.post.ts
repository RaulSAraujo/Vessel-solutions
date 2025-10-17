import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);
        const body = await readBody(event);

        // Criar o evento principal
        const { data: eventQuotationData, error: eventQuotationError } = await client
            .from('event_quotations')
            .insert({
                user_id: user.id,
                location: body.location,
                start_time: body.start_time,
                end_time: body.end_time,
                guest_count: body.guest_count,
                distance: body.distance,
                audience_profile: body.audience_profile,
                status: body.status,
                notes: body.notes,
                client_name: body.client_name,
                client_email: body.client_email,
                client_phone: body.client_phone,
                estimated_total_drinks: body.estimated_total_drinks,
                total_cost: body.total_cost,
                total_revenue: body.total_revenue,
                profit_margin: body.profit_margin,
                bartender_hourly_rate: body.bartender_hourly_rate,
                num_bartenders: body.num_bartenders,
                helper_hourly_rate: body.helper_hourly_rate,
                num_helpers: body.num_helpers,
                fuel_cost_per_km: body.fuel_cost_per_km,
            })
            .select()
            .single();

        if (eventQuotationError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to create event quotation',
                message: eventQuotationError.message,
            });
        }

        return eventQuotationData;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});
