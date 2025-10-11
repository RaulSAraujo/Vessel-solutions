import * as yup from 'yup';

export const quotationSchema = yup.object({
    supplier_id: yup.string().required('O fornecedor é obrigatório'),
    ingredient_id: yup.string().required('O ingrediente é obrigatório'),
    purchase_price: yup.number().required('O preço de compra é obrigatório'),
    purchase_quantity: yup.number().required('A quantidade de compra é obrigatória'),
    purchase_unit_id: yup.number().required('A unidade de compra é obrigatória'),
    quotation_date: yup.date().nullable().default(null),
});
