import { getSupabaseClientAndUser } from "~~/server/utils/supabase";
import type { FetchError } from "ofetch";
import { convertQuantity } from "#shared/utils/unitConverter";
import type { IngredientDetails, Units } from "#shared/types/units";
import type {
  SupplierAnalysis,
  PriceHistoryItem,
  IngredientPriceTrend
} from "~/types/quotation-history";
import { applySupabaseFilters } from "~~/server/utils/applyFilters";
import { applySort } from "~~/server/utils/applySort";

/**
 * Interface para dados brutos da cotação do Supabase
 */
interface RawQuotation {
  id: string;
  created_at: string | null;
  purchase_price: number;
  purchase_quantity: number;
  purchase_unit_id: number;
  quotation_date: string;
  units: {
    name: string;
    abbreviation: string;
  };
  ingredients: {
    name: string;
    unit_id: number;
    unit_weight_g: number | null;
    unit_volume_ml: number | null;
    units: {
      name: string;
      abbreviation: string;
    };
  };
  suppliers: {
    name: string;
    phone: string | null;
    email: string | null;
    observation: string | null;
  };
}

/**
 * Interface para o resultado do processamento de dados
 */
interface ProcessedQuotationData {
  quotationsWithCalculations: Array<RawQuotation & { total_value: number }>;
  supplierData: SupplierAnalysis[];
  recentPriceHistory: PriceHistoryItem[];
  ingredientPriceTrend: IngredientPriceTrend[];
  summary: {
    totalQuotations: number;
    totalValue: number;
    averageQuotationValue: number;
    totalSuppliers: number;
    totalIngredients: number;
  };
}

/**
 * Busca todas as unidades do sistema
 */
async function fetchUnits(client: Awaited<ReturnType<typeof getSupabaseClientAndUser>>['client']): Promise<Units[]> {
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

  return allUnits;
}

/**
 * Busca cotações com filtros de período e paginação
 */
async function fetchQuotations(
  client: Awaited<ReturnType<typeof getSupabaseClientAndUser>>['client'],
  userId: string,
  startDate?: string,
  endDate?: string,
  page: number = 1,
  itemsPerPage: number = 25,
  filters?: any,
  sortBy?: any
): Promise<{ data: RawQuotation[]; count: number }> {
  const offset = (page - 1) * itemsPerPage;

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
      `,
      { count: "exact" }
    )
    .eq("user_id", userId);

  // Aplicar filtros de período
  if (startDate && endDate) {
    quotationsQuery = quotationsQuery
      .gte("created_at", startDate)
      .lte("created_at", endDate);
  }

  // Aplicar filtros adicionais
  if (filters) {
    quotationsQuery = applySupabaseFilters(quotationsQuery, filters);
  }

  // Aplicar ordenação
  quotationsQuery = applySort(quotationsQuery, sortBy);

  // Aplicar paginação
  quotationsQuery = quotationsQuery.range(offset, offset + itemsPerPage - 1);

  const { data: quotations, error: quotationsError, count } = await quotationsQuery;

  if (quotationsError) {
    console.error('Supabase fetch error:', quotationsError);
    throw createError({
      statusCode: 500,
      statusMessage: "Erro ao buscar cotações",
      message: quotationsError.message,
    });
  }

  return { data: quotations || [], count: count || 0 };
}

export default defineEventHandler(async (event) => {
  try {
    const { client, user } = await getSupabaseClientAndUser(event);

    // Obter parâmetros da query
    const query = getQuery(event);
    const startDate = query.start_date as string;
    const endDate = query.end_date as string;
    const page = parseInt(query.page as string) || 1;
    const itemsPerPage = parseInt(query.itemsPerPage as string) || 25;
    const sortBy = query.sortBy as any;

    // Parse filters se existirem
    let filters;
    if (query.filters && typeof query.filters === "string") {
      try {
        filters = JSON.parse(query.filters);
      } catch (jsonError) {
        console.error("Failed to parse filters JSON:", jsonError);
        throw createError({
          statusCode: 400,
          statusMessage: "Bad Request",
          message: "Invalid 'filters' parameter format. Must be a valid JSON string.",
        });
      }
    }

    // Buscar dados necessários
    const [allUnits, quotationsResult] = await Promise.all([
      fetchUnits(client),
      fetchQuotations(client, user.id, startDate, endDate, page, itemsPerPage, filters, sortBy)
    ]);

    const quotations = quotationsResult.data;

    // Processar dados para análise de histórico
    const result = processQuotationData(quotations, allUnits);

    return {
      data: {
        quotations: result.quotationsWithCalculations,
        suppliers: result.supplierData,
        priceHistory: result.recentPriceHistory,
        ingredientPriceTrend: result.ingredientPriceTrend,
      },
      summary: result.summary,
      page: {
        page,
        itemsPerPage,
        totalRows: quotationsResult.count,
        totalPages: Math.ceil((quotationsResult.count || 0) / itemsPerPage),
      }
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

/**
 * Calcula valor total para cotações unitárias
 * Para cotações unitárias, o valor total é igual ao preço por unidade
 */
function calculateTotalValueWithConversion(
  quotation: RawQuotation,
  allUnits: Units[]
): { totalValue: number; convertedQuantity: number } {
  try {
    const ingredient = quotation.ingredients;
    const purchaseUnitId = quotation.purchase_unit_id;
    const ingredientBaseUnitId = ingredient?.unit_id;

    if (!ingredient || !purchaseUnitId || !ingredientBaseUnitId) {
      // Para cotações unitárias, o valor total é o preço por unidade
      return {
        totalValue: quotation.purchase_price,
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

    // Para cotações unitárias, o valor total é o preço por unidade
    const totalValue = quotation.purchase_price;

    return { totalValue, convertedQuantity };
  } catch (error) {
    console.warn('Erro na conversão de unidades:', error);
    // Para cotações unitárias, o valor total é o preço por unidade
    return {
      totalValue: quotation.purchase_price,
      convertedQuantity: quotation.purchase_quantity
    };
  }
}

/**
 * Processa dados de cotações para análise de histórico
 */
function processQuotationData(
  quotations: RawQuotation[],
  allUnits: Units[]
): ProcessedQuotationData {
  const supplierAnalysis: Record<string, SupplierAnalysis> = {};
  const priceHistory: PriceHistoryItem[] = [];

  quotations.forEach((quotation) => {
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
  const totalQuotations = quotations.length;
  const totalValue = quotations.reduce((sum, q) => {
    const { totalValue } = calculateTotalValueWithConversion(q, allUnits);
    return sum + totalValue;
  }, 0);
  const averageQuotationValue = totalQuotations > 0 ? totalValue / totalQuotations : 0;

  // Análise de tendência de preços (últimos 6 meses)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const recentPriceHistory = priceHistory.filter(
    (item) => new Date(item.date) >= sixMonthsAgo
  );

  // Processar tendência de preços dos ingredientes
  const ingredientPriceTrend = calculateIngredientPriceTrend(recentPriceHistory);

  // Adicionar total_value calculado para cada cotação
  const quotationsWithCalculations = quotations.map(quotation => {
    const { totalValue } = calculateTotalValueWithConversion(quotation, allUnits);
    return {
      ...quotation,
      total_value: totalValue
    };
  });

  return {
    quotationsWithCalculations,
    supplierData,
    recentPriceHistory,
    ingredientPriceTrend: Object.values(ingredientPriceTrend),
    summary: {
      totalQuotations,
      totalValue,
      averageQuotationValue,
      totalSuppliers: supplierData.length,
      totalIngredients: Object.keys(ingredientPriceTrend).length,
    },
  };
}

/**
 * Calcula tendência de preços dos ingredientes
 */
function calculateIngredientPriceTrend(
  recentPriceHistory: PriceHistoryItem[]
): Record<string, IngredientPriceTrend> {
  const ingredientPriceTrend: Record<string, IngredientPriceTrend> = {};

  recentPriceHistory.forEach((item) => {
    if (!ingredientPriceTrend[item.ingredient]) {
      ingredientPriceTrend[item.ingredient] = {
        name: item.ingredient,
        averagePrice: 0,
        priceVariation: 0,
        suppliers: [],
      };
    }

    if (!ingredientPriceTrend[item.ingredient].suppliers.includes(item.supplier)) {
      ingredientPriceTrend[item.ingredient].suppliers.push(item.supplier);
    }
  });

  // Calcular preço médio e variação para cada ingrediente
  Object.keys(ingredientPriceTrend).forEach((ingredient) => {
    const prices = recentPriceHistory
      .filter((item) => item.ingredient === ingredient)
      .map((item) => item.unitPrice);

    if (prices.length > 0) {
      const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      const priceVariation = minPrice > 0 ? ((maxPrice - minPrice) / minPrice) * 100 : 0;

      ingredientPriceTrend[ingredient].averagePrice = averagePrice;
      ingredientPriceTrend[ingredient].priceVariation = priceVariation;
    }
  });

  return ingredientPriceTrend;
}
