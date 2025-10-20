import { getSupabaseClientAndUser } from "~~/server/utils/supabase";
import type { FetchError } from "ofetch";
import { convertQuantity } from "#shared/utils/unitConverter";
import type { IngredientDetails } from "#shared/types/units";

export default defineEventHandler(async (event) => {
  try {
    const { client, user } = await getSupabaseClientAndUser(event);

    // Obter parâmetros de período da query
    const query = getQuery(event);
    const startDate = query.start_date as string;
    const endDate = query.end_date as string;

    // Buscar todas as unidades primeiro
    const { data: allUnits, error: unitsError } = await client
      .from('units')
      .select('*');

    if (unitsError || !allUnits) {
      throw createError({
        statusCode: 500,
        statusMessage: "Erro ao buscar unidades",
        message: unitsError?.message || "Nenhuma unidade encontrada",
      });
    }

    // Buscar histórico de cotações
    let quotationsQuery = client
      .from("quotations")
      .select(
        `
                id,
                created_at,
                purchase_price,
                purchase_quantity,
                purchase_unit_id,
                quotation_date,
                units!inner (name, abbreviation),
                ingredients:ingredients!ingredient_id(
                  name, 
                  unit_id,
                  unit_weight_g,
                  unit_volume_ml,
                  units(name, abbreviation)
                ),
                suppliers!inner (name, phone, email, observation)
            `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (startDate && endDate) {
      quotationsQuery = quotationsQuery
        .gte("created_at", startDate)
        .lte("created_at", endDate);
    }

    const { data: quotations, error: quotationsError } = await quotationsQuery;

    if (quotationsError) {
      console.error('Supabase fetch error:', quotationsError);
      throw createError({
        statusCode: 500,
        statusMessage: "Erro ao buscar cotações",
        message: quotationsError.message,
      });
    }

    // Processar dados para análise de histórico
    const supplierAnalysis: Record<
      string,
      {
        name: string;
        totalQuotations: number;
        totalValue: number;
        averageValue: number;
        lastQuotation: string;
        totalQuantity: number;
      }
    > = {};

    const priceHistory: Array<{
      date: string;
      supplier: string;
      ingredient: string;
      unitPrice: number;
      quantity: number;
      unit: string;
    }> = [];

    // Função auxiliar para calcular valor total com conversão de unidades
    function calculateTotalValueWithConversion(
      quotation: any,
      allUnits: any[]
    ): { totalValue: number; convertedQuantity: number } {
      try {
        const ingredient = quotation.ingredients;
        const purchaseUnitId = quotation.purchase_unit_id;
        const ingredientBaseUnitId = ingredient?.unit_id;

        if (!ingredient || !purchaseUnitId || !ingredientBaseUnitId) {
          // Fallback para cálculo simples se não houver dados suficientes
          return {
            totalValue: quotation.purchase_price * quotation.purchase_quantity,
            convertedQuantity: quotation.purchase_quantity
          };
        }

        const ingredientDetails: IngredientDetails = {
          unit_weight_g: ingredient.unit_weight_g || null,
          unit_volume_ml: ingredient.unit_volume_ml || null,
        };

        // Converter quantidade para unidade base do ingrediente
        const convertedQuantity = convertQuantity(
          quotation.purchase_quantity,
          purchaseUnitId,
          ingredientBaseUnitId,
          allUnits,
          ingredientDetails
        );

        // Calcular valor total baseado na quantidade convertida
        const totalValue = quotation.purchase_price * convertedQuantity;

        return { totalValue, convertedQuantity };
      } catch (error) {
        console.warn('Erro na conversão de unidades:', error);
        // Fallback para cálculo simples em caso de erro
        return {
          totalValue: quotation.purchase_price * quotation.purchase_quantity,
          convertedQuantity: quotation.purchase_quantity
        };
      }
    }

    quotations?.forEach((quotation) => {
      const supplier = quotation.suppliers;
      const ingredient = quotation.ingredients;
      const unit = quotation.units;

      if (supplier && ingredient) {
        const supplierName = supplier.name;

        // Calcular valor total com conversão de unidades
        const { totalValue, convertedQuantity } = calculateTotalValueWithConversion(
          quotation,
          allUnits
        );

        if (!supplierAnalysis[supplierName]) {
          supplierAnalysis[supplierName] = {
            name: supplierName,
            totalQuotations: 0,
            totalValue: 0,
            averageValue: 0,
            lastQuotation: quotation.created_at || quotation.quotation_date,
            totalQuantity: 0,
          };
        }

        supplierAnalysis[supplierName].totalQuotations += 1;
        supplierAnalysis[supplierName].totalValue += totalValue;
        supplierAnalysis[supplierName].totalQuantity += convertedQuantity;
        supplierAnalysis[supplierName].averageValue =
          supplierAnalysis[supplierName].totalValue /
          supplierAnalysis[supplierName].totalQuotations;

        const quotationDate = quotation.created_at || quotation.quotation_date;
        if (quotationDate && quotationDate > supplierAnalysis[supplierName].lastQuotation) {
          supplierAnalysis[supplierName].lastQuotation = quotationDate;
        }

        // Price history
        priceHistory.push({
          date: quotationDate || '',
          supplier: supplierName,
          ingredient: ingredient.name,
          unitPrice: quotation.purchase_price,
          quantity: convertedQuantity,
          unit: unit?.abbreviation || unit?.name || '',
        });
      }
    });

    // Converter para array e ordenar por valor total
    const supplierData = Object.values(supplierAnalysis).sort(
      (a, b) => b.totalValue - a.totalValue
    );

    // Calcular totais
    const totalQuotations = quotations?.length || 0;
    const totalValue = quotations?.reduce((sum, q) => {
      const { totalValue } = calculateTotalValueWithConversion(q, allUnits);
      return sum + totalValue;
    }, 0) || 0;
    const averageQuotationValue =
      totalQuotations > 0 ? totalValue / totalQuotations : 0;

    // Análise de tendência de preços (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const recentPriceHistory = priceHistory.filter(
      (item) => new Date(item.date) >= sixMonthsAgo
    );

    // Agrupar por ingrediente e calcular variação de preço
    const ingredientPriceTrend: Record<
      string,
      {
        name: string;
        averagePrice: number;
        priceVariation: number;
        suppliers: string[];
      }
    > = {};

    recentPriceHistory.forEach((item) => {
      if (!ingredientPriceTrend[item.ingredient]) {
        ingredientPriceTrend[item.ingredient] = {
          name: item.ingredient,
          averagePrice: 0,
          priceVariation: 0,
          suppliers: [],
        };
      }

      if (
        !ingredientPriceTrend[item.ingredient].suppliers.includes(item.supplier)
      ) {
        ingredientPriceTrend[item.ingredient].suppliers.push(item.supplier);
      }
    });

    // Calcular preço médio e variação para cada ingrediente
    Object.keys(ingredientPriceTrend).forEach((ingredient) => {
      const prices = recentPriceHistory
        .filter((item) => item.ingredient === ingredient)
        .map((item) => item.unitPrice);

      if (prices.length > 0) {
        const averagePrice =
          prices.reduce((sum, price) => sum + price, 0) / prices.length;
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const priceVariation =
          minPrice > 0 ? ((maxPrice - minPrice) / minPrice) * 100 : 0;

        ingredientPriceTrend[ingredient].averagePrice = averagePrice;
        ingredientPriceTrend[ingredient].priceVariation = priceVariation;
      }
    });

    // Adicionar total_value calculado para cada cotação
    const quotationsWithCalculations = quotations?.map(quotation => {
      const { totalValue } = calculateTotalValueWithConversion(quotation, allUnits);
      return {
        ...quotation,
        total_value: totalValue
      };
    }) || [];

    return {
      data: {
        quotations: quotationsWithCalculations,
        suppliers: supplierData,
        priceHistory: recentPriceHistory,
        ingredientPriceTrend: Object.values(ingredientPriceTrend),
      },
      summary: {
        totalQuotations,
        totalValue,
        averageQuotationValue,
        totalSuppliers: supplierData.length,
        totalIngredients: Object.keys(ingredientPriceTrend).length,
      },
    };
  } catch (error: unknown) {
    const err = error as FetchError;
    console.error('API handler error:', err);

    throw createError({
      statusCode: err.statusCode || 500,
      statusMessage: err.statusMessage || "Erro interno do servidor",
      message: err.message,
    });
  }
});
