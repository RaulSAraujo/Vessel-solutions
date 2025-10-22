export type EventQuotations = {
    data: EventQuotation[];
    page: Page;
}

export interface EventQuotation {
    id: string;
    location: string;
    start_time: string;
    end_time: string;
    guest_count: number;
    distance: number;
    audience_profile: AudienceProfile;
    status: EventQuotationStatus | null;
    total_cost: number;
    total_revenue: number;
    profit_margin: number;
    estimated_total_drinks: number;
    user_id: string | null;
    notes: string;
    updated_at: string | null;
    created_at: string | null;
    bartender_hourly_rate: number | null;
    num_bartenders: number | null;
    helper_hourly_rate: number | null;
    num_helpers: number | null;
    fuel_cost_per_km: number | null;
    client_name: string;
    client_email: string | null;
    client_phone: string;
    event_quotation_drinks: EventQuotationDrink[];
}

export interface EventQuotationDrink {
    id: string;
    event_quotation_id: string;
    drink_percentage: number;
    drink_name: string | null;
    drink_category_name: string | null;
    drink_description: string | null;
    drink_image_url: string | null;
    drink_calculated_cost: number | null;
    drink_selling_price: number | null;
    drink_profit_margin_percentage: number | null;
    created_at: string;
    updated_at: string;
}


export interface Drinks {
    id: string;
    name: string;
    description?: string;
    category_id: string;
    drink_categories: DrinkCategories;
}

export interface DrinkCategories {
    id: string;
    name: string;
}

export type Page = {
    page: number;
    itemsPerPage: number;
    totalRows: number;
    totalPages: number;
}

export type FormEventQuotation = {
    id?: string;
    location: string;
    start_time: Date;
    end_time: Date;
    guest_count: number;
    distance: number;
    audience_profile: AudienceProfile;
    status: EventQuotationStatus | null;
    notes?: string;
    user_id?: string | null;
    estimated_total_drinks: number;
    total_cost: number;
    total_revenue: number;
    profit_margin: number;
    updated_at?: string | null;
    created_at?: string | null;
    bartender_hourly_rate?: number | null;
    num_bartenders?: number | null;
    helper_hourly_rate?: number | null;
    num_helpers?: number | null;
    fuel_cost_per_km?: number | null;
    client_name: string;
    client_email?: string | null;
    client_phone: string;
    event_quotation_drinks: FormEventQuotationDrink[];
}

export type FormEventQuotationDrink = {
    id?: string; // ID opcional para permitir atualização
    drink_percentage: number;
    drink_name: string | null;
    drink_category_name: string | null;
    drink_description: string | null;
    drink_image_url: string | null;
    drink_calculated_cost: number | null;
    drink_selling_price: number | null;
    drink_profit_margin_percentage: number | null;
}

export type EventQuotationStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'converted';
export type AudienceProfile = 'casual' | 'corporate' | 'premium';
