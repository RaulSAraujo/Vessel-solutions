export type Quotations = {
    data: Datum[];
    page: Page;
}

export interface Datum {
    id: string;
    ingredient_id: string;
    supplier_id: string;
    user_id: string;
    purchase_unit_id: number;
    purchase_price: number;
    purchase_quantity: number;
    quotation_date: string;
    created_at: Date;
    updated_at: Date;
    ingredients: Ingredients;
    suppliers: Suppliers;
    units: Units;
}

export interface Ingredients {
    name: string;
}

export interface Suppliers {
    name: string;
    email: null;
    phone: string;
    observation: string;
}

export interface Units {
    name: string;
    abbreviation: string;
}

export type Page = {
    page: number;
    itemsPerPage: number;
    totalRows: number;
    totalPages: number;
}

export type FormQuotations = {
    supplier_id: string
    ingredient_id: string
    purchase_price: number
    purchase_quantity: number
    purchase_unit_id: number
    quotation_date?: string | null
}