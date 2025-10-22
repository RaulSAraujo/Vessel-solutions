export type PurchaseList = {
    data: Datum[];
    page: Page;
};

export type Datum = {
    id: string;
    event_id: string;
    ingredient_id: string;
    quantity_needed: number;
    unit_id: number;
    status: PurchaseStatus;
    notes: string | null;
    created_at: string | null;
    updated_at: string | null;
    user_id: string | null;
    // Relacionamentos
    events: {
        id: string;
        location: string;
        start_time: string;
        end_time: string;
        guest_count: number;
        clients: {
            name: string;
        };
    };
    ingredients: {
        id: string;
        name: string;
        unit_weight_g: number | null;
        unit_volume_ml: number | null;
        wastage_percentage: number;
        real_cost_per_base_unit: number | null;
        current_quotation_id: string | null;
        units: {
            name: string;
            abbreviation: string;
        };
    };
    units: {
        id: number;
        name: string;
        abbreviation: string;
    };
};

export type PurchaseStatus = 'pending' | 'purchased' | 'cancelled';

export type Page = {
    page: number;
    itemsPerPage: number;
    totalRows: number;
    totalPages: number;
};

export type FormPurchaseListItem = {
    id?: string;
    event_id: string;
    ingredient_id: string;
    quantity_needed: number;
    unit_id: number;
    status?: PurchaseStatus;
    notes?: string | null;
};

export type PurchaseListFilters = {
    event_id?: string;
    ingredient_id?: string;
    status?: PurchaseStatus;
    date_from?: string;
    date_to?: string;
};

export type PurchaseListSummary = {
    total_items: number;
    pending_items: number;
    purchased_items: number;
    cancelled_items: number;
    total_estimated_cost: number;
};
