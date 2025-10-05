export type Ingredients = {
    data: Datum[];
    page: Page;
}

export type Datum = {
    id: string;
    name: string;
    created_at: Date;
    updated_at: Date;
    user_id: string;
}

export type Page = {
    page: number;
    itemsPerPage: number;
    totalRows: number;
    totalPages: number;
}

export type FormIngredients = {
    name: string
}