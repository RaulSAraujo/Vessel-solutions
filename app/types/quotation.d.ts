export type { Datum as Supplier } from '~/types/supplier'
export type { Datum as Ingredient } from '~/types/ingredient'

export type Quotations = {
    data: Datum[];
    page: Page;
}

export type Datum = {
    id: string;
    supplier_id: string
    ingredient_id: string
    purchase_price: number
    quotation_date: string | null
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

export type FormQuotations = {
    supplier_id: string
    ingredient_id: string
    purchase_price: number
    quotation_date?: string | null
}