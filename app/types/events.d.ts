export type Events = {
    data: Datum[];
    page: Page;
}

export type Datum = {
    id: string
    client_id: string
    location: string
    start_time: Date
    end_time: Date
    guest_count: number
    distance: number
    audience_profile: string
    status: string | null
    total_cost: number
    total_revenue: number
    profit_margin: number
    estimated_total_drinks: number
    user_id: string | null
    notes: string
    updated_at: string | null
    created_at: string | null
}

export type Page = {
    page: number;
    itemsPerPage: number;
    totalRows: number;
    totalPages: number;
}

export type FormEvent = {
    id?: string
    client_id: string
    location: string
    start_time: Date
    end_time: Date
    guest_count: number
    distance: number
    audience_profile: string
    status: string | null
    notes?: string
    user_id?: string | null
    updated_at?: string | null
    created_at?: string | null
}