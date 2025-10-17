import { getSupabaseClientAndUser } from '~~/server/utils/supabase';
import type { FetchError } from "ofetch";

export default defineEventHandler(async (event) => {
    try {
        const { client, user } = await getSupabaseClientAndUser(event);
        const id = getRouterParam(event, 'id');

        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'ID is required',
            });
        }

        // Buscar o orçamento completo
        const { data: quotation, error: quotationError } = await client
            .from('event_quotations')
            .select(`
                *,
                clients!inner (id, name, email, phone),
                event_quotation_drinks (
                    id,
                    drink_percentage,
                    drink_name,
                    drink_category_name,
                    drink_description,
                    drink_image_url,
                    drink_calculated_cost,
                    drink_selling_price,
                    drink_profit_margin_percentage
                )
            `)
            .eq('id', id)
            .single();

        if (quotationError || !quotation) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Not Found',
                message: 'Event quotation not found',
            });
        }

        // Criar o evento
        const { data: eventData, error: eventError } = await client
            .from('events')
            .insert({
                client_id: quotation.client_id,
                user_id: user.id,
                event_date: quotation.event_date,
                event_name: quotation.event_name,
                guest_count: quotation.guest_count,
                status: 'scheduled',
                total_value: quotation.total_value,
                observations: quotation.observations,
            })
            .select()
            .single();

        if (eventError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to create event',
                message: eventError.message,
            });
        }

        // Criar as bebidas do evento
        const eventDrinksData = quotation.event_quotation_drinks.map((drink: any) => ({
            event_id: eventData.id,
            drink_percentage: drink.drink_percentage,
            drink_name: drink.drink_name,
            drink_category_name: drink.drink_category_name,
            drink_description: drink.drink_description,
            drink_image_url: drink.drink_image_url,
            drink_calculated_cost: drink.drink_calculated_cost,
            drink_selling_price: drink.drink_selling_price,
            drink_profit_margin_percentage: drink.drink_profit_margin_percentage,
        }));

        const { error: eventDrinksError } = await client
            .from('event_drinks')
            .insert(eventDrinksData);

        if (eventDrinksError) {
            // Se falhar ao inserir as bebidas, deletar o evento criado
            await client.from('events').delete().eq('id', eventData.id);

            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to create event drinks',
                message: eventDrinksError.message,
            });
        }

        // Atualizar o status do orçamento para 'converted'
        const { error: updateError } = await client
            .from('event_quotations')
            .update({ status: 'converted' })
            .eq('id', id);

        if (updateError) {
            console.error('Failed to update quotation status:', updateError);
            // Não falhar a operação por causa disso, apenas logar o erro
        }

        // Buscar o evento completo com relacionamentos
        const { data: completeEvent, error: fetchError } = await client
            .from('events')
            .select(`
                *,
                clients!inner (id, name, email, phone),
                event_drinks (
                    id,
                    drink_percentage,
                    drink_name,
                    drink_category_name,
                    drink_description,
                    drink_image_url,
                    drink_calculated_cost,
                    drink_selling_price,
                    drink_profit_margin_percentage
                )
            `)
            .eq('id', eventData.id)
            .single();

        if (fetchError) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch created event',
                message: fetchError.message,
            });
        }

        return {
            event: completeEvent,
            quotation: quotation
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
