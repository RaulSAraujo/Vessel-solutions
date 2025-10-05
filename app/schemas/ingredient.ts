import * as yup from 'yup';

export const ingredientSchema = yup.object({
    name: yup
        .string()
        .required('O nome é obrigatório'),
});