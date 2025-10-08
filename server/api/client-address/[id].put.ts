import { getSupabaseClientAndUser } from "~~/server/utils/supabase";

import type { FetchError } from "ofetch";
import type { TablesUpdate } from "~~/server/types/database";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const clientId = event.context.params?.id;
        const body = await readBody<TablesUpdate<"clients"> & TablesUpdate<"client_addresses">>(event);

        if (!clientId) {
            throw createError({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "Client ID is required.",
            });
        }

        if (!body.name || !body.email || !body.phone) {
            throw createError({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "Client name and email are required.",
            });
        }

        if (!body.street || !body.city || !body.zip_code || !body.state || !body.neighborhood || !body.number) {
            throw createError({
                statusCode: 400,
                statusMessage: "Bad Request",
                message: "Address is required.",
            });
        }

        const { data, error } = await client.rpc('update_client_and_address', {
            p_client_id: clientId,
            p_name: body.name,
            p_email: body.email,
            p_phone: body.phone,
            p_phone_optional: body.phone_optional || null,
            p_zip_code: body.zip_code,
            p_city: body.city,
            p_state: body.state,
            p_neighborhood: body.neighborhood,
            p_street: body.street,
            p_number: body.number,
            p_additional_info: body.additional_info || null,
        })

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to create client",
                message: error.message,
            });
        }

        if (!data || !data.client || !data!.address) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to create client",
                message: "Failed to create client",
            });
        }

        return {
            ...data.client,
            client_addresses: data.address,
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
