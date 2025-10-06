import * as yup from 'yup';

export const quotationSchema = yup.object({
    supplier_id: yup.string().required('O fornecedor é obrigatório'),
    ingredient_id: yup.string().required('O ingrediente é obrigatório'),
    purchase_price: yup.number().required('O preço de compra é obrigatório'),
    quotation_date: yup.date().nullable().default(null),
});
