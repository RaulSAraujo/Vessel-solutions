import * as yup from 'yup';

export const drinkSchema = yup.object({
    name: yup
        .string()
        .required('O nome é obrigatório'),
    is_alcoholic: yup
        .boolean()
});