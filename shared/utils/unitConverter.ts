import type { Units, IngredientDetails, UnitCategory } from '#shared/types/units';

// --- Fatores de Conversão Hardcoded ---
// Chave: "abreviação_origem-abreviação_destino"
const CONVERSION_FACTORS: { [key: string]: number } = {
    // Conversões de massa
    'kg-g': 1000,
    'g-kg': 0.001,

    // Conversões de volume
    'L-ml': 1000,
    'ml-L': 0.001,

    // Conversões entre massa e volume (assumindo densidade da água: 1g = 1ml)
    // ATENÇÃO: Estes são valores padrão para água. Para ingredientes com densidades diferentes,
    // você precisará de um campo 'density' no ingrediente ou um mapeamento específico.
    'g-ml': 1,      // 1g = 1ml (água)
    'ml-g': 1,      // 1ml = 1g (água)
    'kg-L': 1,      // 1kg = 1L (água)
    'L-kg': 1,      // 1L = 1kg (água)
    'kg-ml': 1000,  // 1kg = 1000ml (água)
    'ml-kg': 0.001, // 1ml = 0.001kg (água)
    'g-L': 0.001,   // 1g = 0.001L (água)
    'L-g': 1000,    // 1L = 1000g (água)

    // Adicione mais conversões conforme necessário (ex: 'cup-ml', 'tbsp-ml', etc.)
};

// --- Funções Auxiliares ---

/**
 * Determina a categoria de uma unidade com base em sua abreviação.
 * @param unit A unidade a ser categorizada.
 * @returns A categoria da unidade ('mass', 'volume', 'count', 'unknown').
 */
export function getUnitCategory(unit: Units): UnitCategory {
    const massAbbreviations = ['g', 'kg']; // Adicione outras como 'mg', 'lb', 'oz'
    const volumeAbbreviations = ['ml', 'L']; // Adicione outras como 'cup', 'tbsp', 'tsp', 'gal', 'fl_oz'
    const countAbbreviations = ['un']; // Adicione outras como 'pc', 'ea'

    if (massAbbreviations.includes(unit.abbreviation)) return 'mass';
    if (volumeAbbreviations.includes(unit.abbreviation)) return 'volume';
    if (countAbbreviations.includes(unit.abbreviation)) return 'count';
    return 'unknown';
}

// --- Função Principal de Conversão ---

/**
 * Converte uma quantidade de uma unidade para outra usando fatores hardcoded.
 * @param quantity A quantidade a ser convertida.
 * @param fromUnitId O ID da unidade de origem.
 * @param toUnitId O ID da unidade de destino.
 * @param allUnits Um array de todas as unidades disponíveis no sistema.
 * @param ingredientDetails Detalhes específicos do ingrediente (peso/volume por 'Unidade'), se aplicável.
 * @returns A quantidade convertida.
 * @throws Error se a conversão não for possível ou faltarem dados.
 */
export function convertQuantity(
    quantity: number,
    fromUnitId: number,
    toUnitId: number,
    allUnits: Units[],
    ingredientDetails?: IngredientDetails
): number {
    // 1. Obter unidades e IDs especiais
    const fromUnit = allUnits.find(u => u.id === fromUnitId);
    const toUnit = allUnits.find(u => u.id === toUnitId);

    if (!fromUnit || !toUnit) {
        throw new Error(`One or both units (from: ${fromUnitId}, to: ${toUnitId}) not found.`);
    }

    const unitG = allUnits.find(u => u.abbreviation === 'g');
    const unitML = allUnits.find(u => u.abbreviation === 'ml');
    const unitUN = allUnits.find(u => u.abbreviation === 'un');

    if (!unitG || !unitML || !unitUN) {
        throw new Error('Missing essential units (g, ml, un) in provided unit list. System configuration error.');
    }

    // 2. Se as unidades são as mesmas, não há conversão
    if (fromUnitId === toUnitId) {
        return quantity;
    }

    let convertedQuantity: number;
    let tempQuantityInBaseMass: number;
    let tempQuantityInBaseVolume: number;

    // Obter categorias das unidades
    const fromUnitCategory = getUnitCategory(fromUnit);
    const toUnitCategory = getUnitCategory(toUnit);

    if (fromUnitCategory === 'unknown' || toUnitCategory === 'unknown') {
        throw new Error(`Cannot determine category for one or both units (from: ${fromUnit.name}, to: ${toUnit.name}). Ensure abbreviations are correctly defined.`);
    }

    // 3. Cenário: Unidade de origem é 'Unidade' (count)
    if (fromUnitId === unitUN.id) {
        if (!ingredientDetails) {
            throw new Error('Ingredient details (unit_weight_g or unit_volume_ml) are required for conversion from "Unidade".');
        }

        if (toUnitCategory === 'mass') {
            if (ingredientDetails.unit_weight_g === null) {
                throw new Error('Missing ingredient_unit_weight_g for conversion from "Unidade" to mass unit.');
            }
            tempQuantityInBaseMass = quantity * ingredientDetails.unit_weight_g; // Convertendo unidades para gramas
            const conversionKey = `${unitG.abbreviation}-${toUnit.abbreviation}`;
            convertedQuantity = CONVERSION_FACTORS[conversionKey] !== undefined
                ? tempQuantityInBaseMass * CONVERSION_FACTORS[conversionKey]
                : tempQuantityInBaseMass; // Se destino for 'g', não precisa de mais conversão
        } else if (toUnitCategory === 'volume') {
            if (ingredientDetails.unit_volume_ml === null) {
                throw new Error('Missing ingredient_unit_volume_ml for conversion from "Unidade" to volume unit.');
            }
            tempQuantityInBaseVolume = quantity * ingredientDetails.unit_volume_ml; // Convertendo unidades para mililitros
            const conversionKey = `${unitML.abbreviation}-${toUnit.abbreviation}`;
            convertedQuantity = CONVERSION_FACTORS[conversionKey] !== undefined
                ? tempQuantityInBaseVolume * CONVERSION_FACTORS[conversionKey]
                : tempQuantityInBaseVolume; // Se destino for 'ml', não precisa de mais conversão
        } else {
            throw new Error(`Conversion from "Unidade" to ${toUnitCategory} category is not supported.`);
        }
        return convertedQuantity;
    }

    // 4. Cenário: Unidade de destino é 'Unidade' (count)
    if (toUnitId === unitUN.id) {
        if (!ingredientDetails) {
            throw new Error('Ingredient details (unit_weight_g or unit_volume_ml) are required for conversion to "Unidade".');
        }

        if (fromUnitCategory === 'mass') {
            if (ingredientDetails.unit_weight_g === null) {
                throw new Error('Missing ingredient_unit_weight_g for conversion to "Unidade" from mass unit.');
            }
            const conversionKey = `${fromUnit.abbreviation}-${unitG.abbreviation}`;
            tempQuantityInBaseMass = CONVERSION_FACTORS[conversionKey] !== undefined
                ? quantity * CONVERSION_FACTORS[conversionKey]
                : quantity; // Se origem for 'g', não precisa de mais conversão
            convertedQuantity = tempQuantityInBaseMass / ingredientDetails.unit_weight_g;
        } else if (fromUnitCategory === 'volume') {
            if (ingredientDetails.unit_volume_ml === null) {
                throw new Error('Missing ingredient_unit_volume_ml for conversion to "Unidade" from volume unit.');
            }
            const conversionKey = `${fromUnit.abbreviation}-${unitML.abbreviation}`;
            tempQuantityInBaseVolume = CONVERSION_FACTORS[conversionKey] !== undefined
                ? quantity * CONVERSION_FACTORS[conversionKey]
                : quantity; // Se origem for 'ml', não precisa de mais conversão
            convertedQuantity = tempQuantityInBaseVolume / ingredientDetails.unit_volume_ml;
        } else {
            throw new Error(`Conversion to "Unidade" from ${fromUnitCategory} category is not supported.`);
        }
        return convertedQuantity;
    }

    // 5. Cenário: Conversão direta entre unidades (mesma ou diferentes categorias)
    const conversionKey = `${fromUnit.abbreviation}-${toUnit.abbreviation}`;
    const conversionFactor = CONVERSION_FACTORS[conversionKey];

    if (conversionFactor === undefined) {
        throw new Error(`No conversion factor found from ${fromUnit.name} (${fromUnit.abbreviation}) to ${toUnit.name} (${toUnit.abbreviation}).`);
    }

    convertedQuantity = quantity * conversionFactor;

    return convertedQuantity;
}