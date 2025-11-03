export type Drinks = {
    data: Datum[];
    page: Page;
}

export type Datum = {
    id: string;
    name: string
    user_id: string;
    calculated_cost: number | null
    description: string | null
    image_url: string | null
    profit_margin_percentage: number | null
    selling_price: number | null
    created_at: Date;
    updated_at: Date;
}

export type Page = {
    page: number;
    itemsPerPage: number;
    totalRows: number;
    totalPages: number;
}

export type FormDrink = {
    id?: string
    name: string
    image_url?: string | null
    description?: string | null
    selling_price?: number | null
    calculated_cost: number | null
    profit_margin_percentage: number | null
}