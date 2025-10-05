export type Supplier = {
    data: Datum[];
    page: Page;
}

export type Datum = {
    id: string
    name: string
    phone: string | null
    email: string | null
    observation: string | null
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

export type FormSupplier = {
    name: string
    phone?: string | null
    email?: string | null
    observation?: string | null
}