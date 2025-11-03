export type EventDrinks = {
    data: Datum[];
    page: Page;
}

export type Datum = {
    id: string;
    event_id: string;
    drink_percentage: number;
    drink_name: string;
    drink_description: string | null;
    drink_image_url: string | null;
    drink_calculated_cost: number | null;
    drink_selling_price: number | null;
    drink_profit_margin_percentage: number | null;
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
    id: string;
    drink_name: string;
    drink_description: string | null;
    drink_image_url: string | null;
    drink_calculated_cost: number | null;
    drink_selling_price: number | null;
    drink_profit_margin_percentage: number | null;
    drink_percentage: number;
}

export type FormEventDrinks = {
    id?: string; // ID opcional para permitir atualização
    drink_percentage: number;
    drink_name: string;
    drink_description?: string | null;
    drink_image_url?: string | null;
    drink_calculated_cost?: number | null;
    drink_selling_price?: number | null;
    drink_profit_margin_percentage?: number | null;
};