import { getSupabaseClientAndUser } from "~~/server/utils/supabase";
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);

        const { count: totalClients, error: clientsError } = await client
            .from("clients")
            .select("*", { count: "exact", head: true })

        const { data: events, error: eventsError, count: totalEvents } = await client
            .from("events")
            .select("total_cost", { count: "exact" })

        if (clientsError || eventsError) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to fetch clients",
                message: clientsError?.message || eventsError?.message,
            });
        }

        return {
            data: {
                clients: {
                    count: totalClients || 0
                },
                events: {
                    count: totalEvents || 0,
                    total_cost: events?.reduce((acc, event) => acc + (event?.total_cost || 0), 0)
                }
            },
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
