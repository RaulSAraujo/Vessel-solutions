import { getSupabaseClientAndUser } from "~~/server/utils/supabase";

import type { FetchError } from "ofetch";
import type { Tables, TablesUpdate } from "~~/server/types/database";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const clientId = event.context.params?.id;
        const body = await readBody<TablesUpdate<"client_addresses">>(event);

        if (!clientId) {
            throw createError({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "Client ID is required.",
            });
        }

        const { data, error } = await client.from("client_addresses")
            .update(body)
            .eq("client_id", clientId)
            .select();

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to update client address",
                message: error.message,
            });
        }

        return data[0] as Tables<"client_addresses">;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});
