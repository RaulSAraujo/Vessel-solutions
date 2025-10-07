export type DrinkIngredients = {
    data: Datum[];
    page: Page;
}

export type Datum = {
    id: string
    drink_id: string
    ingredient_id: boolean
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