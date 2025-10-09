export type Ingredients = {
    data: Datum[];
    page: Page;
}

export interface Datum {
    id: string;
    user_id: string;
    unit_id: number;
    name: string;
    unit_weight_g: number | null;
    unit_volume_ml: number | null;
    wastage_percentage: number;
    created_at: string;
    updated_at: string;
    real_cost_per_base_unit: number | null;
    current_quotation_id: null | string;
    quotations: Quotations | null;
    units: Units;
}

export interface Quotations {
    purchase_price: number;
    purchase_unit_id: number;
    purchase_quantity: number;
}

export interface Units {
    name: string;
    abbreviation: string;
}

export type Page = {
    page: number;
    itemsPerPage: number;
    totalRows: number;
    totalPages: number;
}

export type FormIngredients = {
    name: string;
    unit_id: string;
    wastage_percentage?: number;
    unit_weight_g?: number | null;
    unit_volume_ml?: number | null;
}