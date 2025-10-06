export type Drinks = {
    data: Datum[];
    page: Page;
}

export type Datum = {
    id: string;
    name: string
    is_alcoholic: boolean
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

export type FormDrink = {
    id?: string
    name?: string
    is_alcoholic?: boolean
}