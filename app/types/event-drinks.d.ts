export type EventDrinks = {
    data: Datum[];
    page: Page;
}

export type Datum = {
    event_id: number;
    drink_id: number;
    drink_percentage: number;
    created_at: string;
    updated_at: string;
}

export type Page = {
    page: number;
    itemsPerPage: number;
    totalRows: number;
    totalPages: number;
}

export type TableDrinks = {
    drink_id: string;
    name: string;
    category: string;
    description: string | null;
    image_url: string | null;
    calculated_cost: number;
    selling_price: number;
    profit_margin_percentage: number;
    drink_percentage: number;
}

export type FormEventDrinks = {
    drink_id: number;
    drink_percentage: number;
};