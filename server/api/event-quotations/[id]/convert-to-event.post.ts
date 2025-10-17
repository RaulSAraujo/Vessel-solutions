import { getSupabaseClientAndUser } from '~~/server/utils/supabase';

export default defineEventHandler(async (event) => {
    const { client, user } = await getSupabaseClientAndUser(event);
    const eventQuotationId = getRouterParam(event, "id");

    if (!eventQuotationId) {
        throw createError({
            statusCode: 400,
            statusMessage: "Event quotation ID is required"
        });
    }

    try {
        // 1. Buscar a cotação com todos os dados necessários
        const { data: eventQuotation, error: quotationError } = await client
            .from("event_quotations")
            .select(`
            *,
            event_quotation_drinks (*)
        `)
            .eq("id", eventQuotationId)
            .eq("user_id", user.id)
            .single();

        if (quotationError || !eventQuotation) {
            throw createError({
                statusCode: 404,
                statusMessage: "Event quotation not found"
            });
        }

        // 2. Verificar se já existe um cliente com o mesmo email
        let clientId: string;

        if (eventQuotation.client_email) {
            const { data: existingClient } = await client
                .from("clients")
                .select("id")
                .eq("email", eventQuotation.client_email)
                .eq("user_id", user.id)
                .single();

            if (existingClient) {
                clientId = existingClient.id;
            } else {
                // Criar novo cliente
                const { data: newClient, error: clientError } = await client
                    .from("clients")
                    .insert({
                        name: eventQuotation.client_name,
                        email: eventQuotation.client_email,
                        phone: eventQuotation.client_phone,
                        user_id: user.id
                    })
                    .select("id")
                    .single();

                if (clientError || !newClient) {
                    throw createError({
                        statusCode: 500,
                        statusMessage: "Failed to create client"
                    });
                }

                clientId = newClient.id;
            }
        }

        // 3. Criar o evento
        const { data: newEvent, error: eventError } = await client
            .from("events")
            .insert({
                client_id: clientId,
                location: eventQuotation.location,
                start_time: eventQuotation.start_time,
                end_time: eventQuotation.end_time,
                guest_count: eventQuotation.guest_count,
                distance: eventQuotation.distance,
                audience_profile: eventQuotation.audience_profile,
                status: "confirmed", // Status padrão para eventos convertidos
                notes: eventQuotation.notes,
                estimated_total_drinks: eventQuotation.estimated_total_drinks,
                total_cost: eventQuotation.total_cost,
                total_revenue: eventQuotation.total_revenue,
                profit_margin: eventQuotation.profit_margin,
                bartender_hourly_rate: eventQuotation.bartender_hourly_rate,
                num_bartenders: eventQuotation.num_bartenders,
                helper_hourly_rate: eventQuotation.helper_hourly_rate,
                num_helpers: eventQuotation.num_helpers,
                fuel_cost_per_km: eventQuotation.fuel_cost_per_km,
                user_id: user.id
            })
            .select("id")
            .single();

        if (eventError || !newEvent) {
            throw createError({
                statusCode: 500,
                statusMessage: "Failed to create event"
            });
        }

        // 4. Transferir os drinks da cotação para o evento
        if (eventQuotation.event_quotation_drinks && eventQuotation.event_quotation_drinks.length > 0) {
            const eventDrinks = eventQuotation.event_quotation_drinks.map((drink: any) => ({
                event_id: newEvent.id,
                drink_percentage: drink.drink_percentage,
                drink_name: drink.drink_name,
                drink_category_name: drink.drink_category_name,
                drink_description: drink.drink_description,
                drink_image_url: drink.drink_image_url,
                drink_calculated_cost: drink.drink_calculated_cost,
                drink_selling_price: drink.drink_selling_price,
                drink_profit_margin_percentage: drink.drink_profit_margin_percentage
            }));

            const { error: drinksError } = await client
                .from("event_drinks")
                .insert(eventDrinks);

            if (drinksError) {
                console.error("Error transferring drinks:", drinksError);
                // Não falhar a operação por causa dos drinks, apenas logar o erro
            }
        }

        // 5. Atualizar o status da cotação para "converted"
        const { error: updateError } = await client
            .from("event_quotations")
            .update({ status: "converted" })
            .eq("id", eventQuotationId)
            .eq("user_id", user.id);

        if (updateError) {
            console.error("Error updating quotation status:", updateError);
            // Não falhar a operação por causa da atualização do status
        }

        return {
            success: true,
            eventId: newEvent.id,
            clientId: clientId,
            message: "Event quotation successfully converted to event"
        };

    } catch (error: any) {
        console.error("Error converting event quotation to event:", error);

        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || "Internal server error"
        });
    }
});
