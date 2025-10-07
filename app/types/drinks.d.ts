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
    ingredients: Ingredients
}

export type Ingredients = {
    name: string;
    units: Units
}

export type Units = {
    name: string;
    abbreviation: string
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