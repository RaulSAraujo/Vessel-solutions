export default defineEventHandler(async (event) => {
    try {
        // Retorna dados de exemplo para testar o componente
        const sampleData = [
            {
                color: "#3b82f6",
                name: "Caipirinha",
                value: 15.50
            },
            {
                color: "#a855f7",
                name: "Mojito",
                value: 12.30
            },
            {
                color: "#22c55e",
                name: "Margarita",
                value: 18.75
            },
            {
                color: "#ef4444",
                name: "Cosmopolitan",
                value: 22.00
            },
            {
                color: "#f59e0b",
                name: "Piña Colada",
                value: 16.80
            }
        ];

        return sampleData;
    } catch (error: unknown) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Internal Server Error',
            message: 'Failed to generate sample data',
        });
    }
});
