import * as yup from 'yup';

const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;

export const supplierSchema = yup.object({
    name: yup
        .string()
        .required('O nome é obrigatório'),
    phone: yup.string()
        .matches(phoneRegex, 'Formato de telefone inválido.'),
    email: yup.string()
        .email('Formato de e-mail inválido.'),
    observation: yup.string()
});