export type Ingredients = {
    data: Datum[];
    page: Page;
}

export type Datum = {
    id: string;
    name: string;
    user_id: string;
    unit_id: string;
    created_at: Date;
    updated_at: Date;
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
}