import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client } = await getSupabaseClientAndUser(event);
        const purchaseListItemId = event.context.params?.id;

        if (!purchaseListItemId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Purchase list item ID is required.',
            });
        }

        const { error } = await client
            .from('purchase_list')
            .delete()
            .eq('id', purchaseListItemId);

        if (error) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to delete purchase list item',
                message: error.message,
            });
        }

        return { success: true, message: 'Purchase list item deleted successfully' };
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});
