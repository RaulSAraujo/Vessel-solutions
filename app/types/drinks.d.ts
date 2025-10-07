import type { DatumWithRelations as IngredientWithRelations } from '~/types/ingredients'

export type Drinks = {
    data: Datum[];
    page: Page;
}

export type Datum = {
    id: string;
    name: string
    type: string
    created_at: Date;
    updated_at: Date;
    user_id: string;
    drink_ingredients: DrinkIngredients[]
}

export type DrinkIngredients = {
    id?: string
    quantity: number
    ingredients: IngredientWithRelations
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
    type?: string
    drink_ingredients: DrinkIngredients[]
}