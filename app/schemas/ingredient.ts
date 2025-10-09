import * as yup from 'yup';

export const ingredientSchema = yup.object({
    name: yup
        .string()
        .required('O nome é obrigatório'),
    unit_id: yup
        .string()
        .required('A unidade é obrigatória'),
    unit_volume_ml: yup
        .number()
        .nullable()
        .optional(),
    unit_weight_g: yup
        .number()
        .nullable()
        .optional(),
    wastage_percentage: yup
        .number()
        .nonNullable()
        .optional()
});