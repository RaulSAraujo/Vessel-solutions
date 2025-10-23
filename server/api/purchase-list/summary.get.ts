import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);

        // Executar queries paralelas para melhor performance
        const [
            { count: totalItems, error: totalError },
            { count: pendingItems, error: pendingError },
            { count: purchasedItems, error: purchasedError },
            { count: cancelledItems, error: cancelledError },
            { data: pendingCostData, error: costError }
        ] = await Promise.all([
            // Total de itens
            client.from("purchase_list").select('id', { count: 'exact', head: true }),

            // Itens pendentes
            client.from("purchase_list").select('id', { count: 'exact', head: true }).eq('status', 'pending'),

            // Itens comprados
            client.from("purchase_list").select('id', { count: 'exact', head: true }).eq('status', 'purchased'),

            // Itens cancelados
            client.from("purchase_list").select('id', { count: 'exact', head: true }).eq('status', 'cancelled'),

            // Custo estimado apenas dos pendentes
            client.from("purchase_list").select('estimated_cost').eq('status', 'pending')
        ]);

        // Verificar erros
        if (totalError || pendingError || purchasedError || cancelledError || costError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch purchase list summary',
                message: totalError?.message || pendingError?.message || purchasedError?.message || cancelledError?.message || costError?.message,
            });
        }

        // Calcular custo total estimado dos pendentes
        const totalEstimatedCost = pendingCostData?.reduce((total, item) => total + (item.estimated_cost || 0), 0) || 0;

        const summary = {
            total_items: totalItems || 0,
            pending_items: pendingItems || 0,
            purchased_items: purchasedItems || 0,
            cancelled_items: cancelledItems || 0,
            total_estimated_cost: totalEstimatedCost,
        };

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
