/* eslint-disable @typescript-eslint/no-explicit-any */
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import customParseFormat from "dayjs/plugin/customParseFormat";
import type { PostgrestFilterBuilder } from "@supabase/postgrest-js";

dayjs.extend(utc)
dayjs.extend(customParseFormat);
dayjs.locale('pt-br')

// Mapeamento de operadores string para métodos do Supabase
const SUPABASE_OPERATORS: { [key: string]: string } = {
    eq: "eq",     // equals
    neq: "neq",   // not equals
    gt: "gt",     // greater than
    gte: "gte",   // greater than or equals
    lt: "lt",     // less than
    lte: "lte",   // less than or equals
    like: "like", // case-sensitive pattern matching (e.g., 'value%')
    ilike: "ilike", // case-insensitive pattern matching (e.g., 'value%')
    is: "is",     // is null, is true, is false
    in: "in",     // is in a list (value should be an array)
    cs: "cs",     // contains (for arrays/jsonb)
    cd: "cd",     // contained by (for arrays/jsonb)
    between: "between", // value should be an array with two elements
};

/**
 * Aplica filtros dinamicamente a uma query Supabase.
 *
 * @template Q O tipo exato do PostgrestFilterBuilder que está sendo passado.
 * @param queryBuilder A instância do Supabase PostgrestFilterBuilder.
 * @param filters Um objeto contendo os filtros a serem aplicados,
 * onde a chave é o nome do campo e o valor é um objeto { op: string; value: any }.
 * @returns O queryBuilder com os filtros aplicados, mantendo o tipo original.
 */
export function applySupabaseFilters<Q extends PostgrestFilterBuilder<any, any, any, any>>(queryBuilder: Q, filters: Record<string, { op: string; value: any }>): Q {
    const currentQuery = queryBuilder;

    for (const field in filters) {
        if (Object.prototype.hasOwnProperty.call(filters, field)) {
            const { op, value } = filters[field];

            // Verifica se o operador é válido e existe no nosso mapeamento
            if (op && value !== undefined && SUPABASE_OPERATORS[op]) {
                const supabaseMethod = SUPABASE_OPERATORS[op];
                let processedValue = value;

                if (op === 'between' && Array.isArray(value)) {
                    (currentQuery as any).gte(field, value[0]);
                    (currentQuery as any).lte(field, value[1]);
                    continue;
                }

                if (op === 'eq' && typeof value === "string") {
                    const dateValue = processDate(value);
                    if (dateValue) {
                        (currentQuery as any).gte(field, dateValue.start);
                        (currentQuery as any).lte(field, dateValue.end);
                        continue;
                    }
                }

                // Adiciona curingas '%' para operadores 'like' e 'ilike'
                if (op === 'like' || op === 'ilike') {
                    // Garante que o valor é uma string antes de adicionar os curingas
                    processedValue = String(value);
                    // Adiciona curingas se eles ainda não estiverem presentes
                    if (!processedValue.startsWith('%')) {
                        processedValue = `%${processedValue}`;
                    }
                    if (!processedValue.endsWith('%')) {
                        processedValue = `${processedValue}%`;
                    }
                }

                (currentQuery as any)[supabaseMethod](field, processedValue);
            } else {
                console.warn(`[applySupabaseFilters] Invalid operator or value for field '${field}': op='${op}', value='${value}'`);
            }
        }
    }

    return currentQuery;
}

/**
 * Processa e formata valores de data usando Day.js.
 *
 * @param value O valor a ser processado (string ou Date).
 * @returns Uma string no formato ISO 8601 ou null se o valor não for uma data válida.
 */
function processDate(value: any): { start: string; end: string } | null {
    if (typeof value === "string") {
        if (value.includes(',')) {
            const [startDate, endDate] = value.split(",").map((date) => date.trim());

            // Processa as duas datas no formato DD/MM/YYYY
            const parsedStartDate = dayjs(startDate, "DD/MM/YYYY", true).utc();
            const parsedEndDate = dayjs(endDate, "DD/MM/YYYY", true).utc();

            if (parsedStartDate.isValid() && parsedEndDate.isValid()) {
                const startOfDay = parsedStartDate.startOf("day").toISOString();
                const endOfDay = parsedEndDate.endOf("day").toISOString();

                return { start: startOfDay, end: endOfDay };
            }
        } else {
            const parsedDate = dayjs(value, "DD/MM/YYYY", true).utc();

            if (parsedDate.isValid()) {
                const startOfDay = parsedDate.startOf("day").toISOString(); // 00:00:00
                const endOfDay = parsedDate.endOf("day").toISOString();     // 23:59:59

                return { start: startOfDay, end: endOfDay };
            }
        }
    }
    return null; // Retorna null se não for uma data válida
}