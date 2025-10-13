export type Categories = {
    data: Datum[];
    page: Page;
}

export type Datum = {
    id: string
    name: string
    created_at: string | null
    updated_at: string | null
    user_id: string
}

export type Page = {
    page: number;
    itemsPerPage: number;
    totalRows: number;
    totalPages: number;
}

export type FormCategory = {
    name: string
}