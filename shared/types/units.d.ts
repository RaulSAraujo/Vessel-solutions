// types/units.d.ts

export interface Units {
    id: number;
    name: string;
    abbreviation: string;
}

export interface IngredientDetails {
    unit_weight_g: number | null; // Peso em gramas de 1 'Unidade' do ingrediente
    unit_volume_ml: number | null; // Volume em ml de 1 'Unidade' do ingrediente
}

export type UnitCategory = 'mass' | 'volume' | 'count' | 'unknown';