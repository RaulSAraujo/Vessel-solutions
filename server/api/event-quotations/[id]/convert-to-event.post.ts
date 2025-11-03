import { getSupabaseClientAndUser } from "~~/server/utils/supabase";
import type { Tables, TablesInsert } from "~~/server/types/database";

export default defineEventHandler(async (event) => {
  const { client, user } = await getSupabaseClientAndUser(event);
  const eventQuotationId = getRouterParam(event, "id");

  if (!eventQuotationId) {
    throw createError({
      statusCode: 400,
      statusMessage: "Event quotation ID is required",
    });
  }

  try {
    const body = await readBody<
      (TablesInsert<"clients"> & TablesInsert<"client_addresses">) | undefined
    >(event);

    // 1. Buscar a cotação com todos os dados necessários
    const { data: eventQuotation, error: quotationError } = await client
      .from("event_quotations")
      .select(
        `
            *,
            event_quotation_drinks (*)
        `
      )
      .eq("id", eventQuotationId)
      .eq("user_id", user.id)
      .single();

    if (quotationError || !eventQuotation) {
      throw createError({
        statusCode: 404,
        statusMessage: "Event quotation not found",
      });
    }

    // 2. Resolver cliente
    let clientId: string | undefined;

    // 2.1 Tentar resolver por document quando enviado no body
    if (body && body.document) {
      const { data: existingByDocument, error: findByDocumentError } =
        await client
          .from("clients")
          .select("id")
          .eq("document", body.document)
          .eq("user_id", user.id)
          .single();

      if (!findByDocumentError && existingByDocument) {
        // Cliente encontrado
        clientId = existingByDocument.id as string;
      } else {
        // Não existe cliente com o CPF informado: criar cliente + endereço via RPC
        if (!body.name) {
          throw createError({
            statusCode: 400,
            statusMessage: "Invalid client payload",
            message: "Nome é obrigatório para criar o cliente.",
          });
        }

        const { data: rpcData, error: rpcError } = await client.rpc(
          "insertion_client_and_address",
          {
            p_name: body.name,
            p_email: body.email || "",
            p_phone: body.phone || "",
            p_phone_optional: body.phone_optional || "",
            p_user_id: user.id,
            p_zip_code: body.zip_code || "",
            p_city: body.city || "",
            p_state: body.state || "",
            p_neighborhood: body.neighborhood || "",
            p_street: body.street || "",
            p_number: body.number || "",
            p_additional_info: body.additional_info || "",
          }
        );

        if (rpcError || !rpcData?.client) {
          // Se falhar a criação do cliente, não converter
          throw createError({
            statusCode: 500,
            statusMessage: "Failed to create client",
          });
        }

        clientId = rpcData.client.id as string;
      }
    }

    if (!clientId) {
      throw createError({
        statusCode: 400,
        statusMessage: "Client not resolved: Document is required",
      });
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
        user_id: user.id,
      })
      .select("id")
      .single();

    if (eventError || !newEvent) {
      throw createError({
        statusCode: 500,
        statusMessage: "Failed to create event",
      });
    }

    // 4. Transferir os drinks da cotação para o evento
    if (
      eventQuotation.event_quotation_drinks &&
      eventQuotation.event_quotation_drinks.length > 0
    ) {
      const eventDrinks = eventQuotation.event_quotation_drinks.map(
        (drink: Tables<"event_quotation_drinks">) => ({
          event_id: newEvent.id,
          drink_percentage: drink.drink_percentage,
          drink_name: drink.drink_name,
          drink_description: drink.drink_description,
          drink_image_url: drink.drink_image_url,
          drink_calculated_cost: drink.drink_calculated_cost,
          drink_selling_price: drink.drink_selling_price,
          drink_profit_margin_percentage: drink.drink_profit_margin_percentage,
        })
      );

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
      message: "Event quotation successfully converted to event",
    };
  } catch (error: unknown) {
    const err = error as { statusCode?: number; statusMessage?: string };
    console.error("Error converting event quotation to event:", error);

    throw createError({
      statusCode: err?.statusCode || 500,
      statusMessage: err?.statusMessage || "Internal server error",
    });
  }
});
