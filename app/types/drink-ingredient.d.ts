export type DrinkIngredients = {
    data: Datum[];
    page: Page;
}

export type Datum = {
    id: string
    drink_id: string
    ingredient_id: string
    unit_id: number | null
    quantity: number
    updated_at: string | null
    created_at: string | null
}

export type Page = {
    page: number;
    itemsPerPage: number;
    totalRows: number;
    totalPages: number;
}

export type TableDrinkIngredients = {
    drink_Ingredient_id?: string;
    ingredient_id: string;
    unit_id: number | null;
    name: string;
    quantity: number;
    ingredient_unit_id: number;
    real_cost_per_base_unit: number | null;
    unit_weight_g: number | null;
    unit_volume_ml: number | null;
    cost_unit: number;
}

export type FormDrinkIngredients = {
    drink_id: string
    ingredient_id: string
    unit_id: number | null
    quantity: number
}