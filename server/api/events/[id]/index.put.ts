import type { FetchError } from "ofetch";
import type { TablesUpdate } from "~~/server/types/database";
import { generatePurchaseListItems, recalculatePurchaseListForEvent } from "~~/server/utils/purchaseListGenerator";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const eventId = event.context.params?.id;

        const body = await readBody<TablesUpdate<"events">>(event);

        if (!eventId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Event ID is required.',
            });
        }

        // Buscar o evento atual para verificar mudanças
        const { data: currentEvent } = await client
            .from('events')
            .select('status, estimated_total_drinks')
            .eq('id', eventId)
            .single();

        const { data, error } = await client
            .from('events')
            .update(body)
            .eq('id', eventId)
            .select(`
                *,
                clients!inner (name)
            `);

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to update event',
                message: error.message,
            });
        }

        if (!data || data.length === 0) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: `Event with ID ${eventId} not found or not accessible for update.`,
            });
        }

        const updatedEvent = data[0];
        if (!updatedEvent) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: `Event with ID ${eventId} not found or not accessible for update.`,
            });
        }

        // Verificar se o status foi alterado para 'purchase'
        if (body.status === 'purchase' && currentEvent?.status !== 'purchase') {
            await generatePurchaseListItems(client, eventId, updatedEvent as import("~~/server/types/database").Tables<"events">);
        }

        // Verificar se a quantidade estimada de drinks foi alterada
        if (body.estimated_total_drinks !== undefined &&
            body.estimated_total_drinks !== currentEvent?.estimated_total_drinks) {
            // Recalcular purchase-list se já existe
            await recalculatePurchaseListForEvent(client, eventId);
        }

        return updatedEvent;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});
