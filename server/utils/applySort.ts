/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PostgrestFilterBuilder } from '@supabase/postgrest-js';

interface SortParam {
    key: string; // Ex: 'calculated_cost' ou 'drink_categories.name'
    order: 'asc' | 'desc';
    nullsFirst?: boolean;
    nullsLast?: boolean;
}

// Interface que corresponde à OrderDefinition esperada pelo método .order() do Supabase
// Definimos localmente, já que OrderDefinition não é facilmente exportado.
interface SupabaseOrderConfig {
    column: string;
    ascending?: boolean; // Opcional, padrão é true
    nullsFirst?: boolean;
    referencedTable?: string; // Para ordenação em tabelas relacionadas
}

/**
 * Aplica a lógica de ordenação a uma query do Supabase.
 * Suporta ordenação por múltiplas colunas, incluindo colunas de tabelas relacionadas.
 *
 * @param supabaseQuery O objeto de query do Supabase (e.g., client.from("drinks").select(...))
 * @param sortBy O parâmetro sortBy da query string, pode ser uma string JSON ou um array de strings JSON.
 * @param defaultSort A configuração de ordenação padrão a ser aplicada se nenhuma ordenação válida for fornecida.
 * @returns A query do Supabase com a ordenação aplicada.
 */
export function applySort(
    supabaseQuery: PostgrestFilterBuilder<any, any, any, any>,
    sortBy: string | number | boolean | Record<string, any> | undefined,
    defaultSort: SupabaseOrderConfig = { column: 'created_at', ascending: false }
): PostgrestFilterBuilder<any, any, any, any> {

    const orderConfigArray: SupabaseOrderConfig[] = [];

    // Função auxiliar para processar um único objeto de ordenação
    const processSingleSortParam = (sortParam: SortParam) => {
        if (sortParam.key && sortParam.order) {
            const [foreignTable, foreignColumn] = sortParam.key.split('.');
            const ascending = sortParam.order === 'asc';

            const orderDefinition: SupabaseOrderConfig = {
                column: foreignColumn && foreignTable ? foreignColumn : sortParam.key,
                ascending: ascending,
                ...(foreignTable && foreignColumn && { referencedTable: foreignTable }),
                ...(sortParam.nullsFirst && { nullsFirst: sortParam.nullsFirst }),
            };

            orderConfigArray.push(orderDefinition);
        }
    };

    if (sortBy) {
        if (typeof sortBy === "string") {
            try {
                const parsedSort = JSON.parse(sortBy) as SortParam;
                processSingleSortParam(parsedSort);
            } catch (jsonError) {
                console.warn("Failed to parse single sortBy JSON, ignoring:", jsonError);
            }
        } else if (Array.isArray(sortBy)) {
            for (const sortItem of sortBy) {
                if (typeof sortItem === 'string') {
                    try {
                        const parsedSort = JSON.parse(sortItem) as SortParam;
                        processSingleSortParam(parsedSort);
                    } catch (jsonError) {
                        console.warn("Failed to parse sortBy array element JSON, ignoring:", jsonError);
                    }
                }
            }
        }
    }

    let currentQuery = supabaseQuery; // Usa uma variável temporária para encadear
    if (orderConfigArray.length > 0) {
        for (const orderConfig of orderConfigArray) {
            currentQuery = currentQuery.order(orderConfig.column, {
                ascending: orderConfig.ascending,
                referencedTable: orderConfig.referencedTable,
                nullsFirst: orderConfig.nullsFirst,
            });
        }
    } else {
        // Se nenhuma ordenação dinâmica foi aplicada, usa a ordenação padrão
        currentQuery = currentQuery.order(defaultSort.column, {
            ascending: defaultSort.ascending,
            referencedTable: defaultSort.referencedTable,
            nullsFirst: defaultSort.nullsFirst,
        });
    }

    return currentQuery
}