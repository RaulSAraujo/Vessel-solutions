import * as yup from 'yup';

export const drinkSchema = yup.object({
    name: yup
        .string()
        .required('O nome é obrigatório'),

    profit_margin_percentage: yup
        .number()
        .positive('A margem de lucro deve ser maior que zero')
        .required('A margem de lucro é obrigatória'),
});