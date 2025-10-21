// Tipos para o histórico de cotações

export interface QuotationItem {
    id: string;
    created_at: string;
    purchase_price: number;
    purchase_quantity: number;
    purchase_unit_id: number;
    quotation_date: string;
    total_value?: number; // Valor total calculado com conversão de unidades
    suppliers: {
        name: string;
        phone: string;
        email: string;
        observation: string;
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
    units: {
        name: string;
        abbreviation: string;
    };
}

export interface SupplierAnalysis {
    name: string;
    totalQuotations: number;
    totalValue: number;
    averageValue: number;
    lastQuotation: string;
    totalQuantity: number;
}

export interface PriceHistoryItem {
    date: string;
    supplier: string;
    ingredient: string;
    unitPrice: number;
    quantity: number;
    unit: string;
}

export interface IngredientPriceTrend {
    name: string;
    averagePrice: number;
    priceVariation: number;
    suppliers: string[];
}

export interface QuotationHistoryData {
    quotations: QuotationItem[];
    suppliers: SupplierAnalysis[];
    priceHistory: PriceHistoryItem[];
    ingredientPriceTrend: IngredientPriceTrend[];
}

export interface QuotationHistorySummary {
    totalQuotations: number;
    totalValue: number;
    averageQuotationValue: number;
    totalSuppliers: number;
    totalIngredients: number;
}

export interface QuotationHistoryResponse {
    data: QuotationHistoryData;
    summary: QuotationHistorySummary;
    page: {
        page: number;
        itemsPerPage: number;
        totalRows: number;
        totalPages: number;
    };
}

export interface QuotationInsights {
    topSupplier: SupplierAnalysis | null;
    averageQuotationValue: number;
    totalQuotations: number;
    totalSuppliers: number;
    priceVariation: {
        high: number;
        medium: number;
        low: number;
    };
}

export interface QuotationOverview {
    totalQuotations: number;
    totalValue: number;
    averageQuotationValue: number;
    totalSuppliers: number;
    totalIngredients: number;
}

export interface QuotationWithCalculations extends QuotationItem {
    supplier_name: string;
    ingredient_name: string;
    total_value: number;
}
