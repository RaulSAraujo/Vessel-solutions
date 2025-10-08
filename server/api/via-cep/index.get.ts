import type { FetchError } from "ofetch";
import type { ViaCep } from '~~/server/types/via-cep'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event);

        if (query.cep === undefined) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Bad Request',
                message: 'Missing "cep" parameter.',
            });
        }

        const response = await fetch(`https://viacep.com.br/ws/${query.cep}/json/`);

        const data = await response.json();

        if (data.erro) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Failed to fetch cep',
                message: data.erro.message || 'Failed to fetch cep',
            });
        }

        return data as ViaCep;
    } catch (error: unknown) {
        const err = error as FetchError;

        throw createError({
            statusCode: err.statusCode || 500,
            statusMessage: err.statusMessage || "Internal Server Error",
            message: err.message,
        });
    }
});