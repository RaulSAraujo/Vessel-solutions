import * as yup from 'yup';

// Regex para validar telefone no formato (XX) XXXX-XXXX ou (XX) XXXXX-XXXX
// Permite espaços após o DDD e aceita números com 8 ou 9 dígitos no final.
const phoneRegex = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;

// Regex para validar CPF no formato ###.###.###-##
const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

// Regex para validar CNPJ no formato ##.###.###/####-##
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;

// Regex para validar CEP no formato #####-###
const cepRegex = /^\d{5}-\d{3}$/;

export const clientSchema = yup.object().shape({
    name: yup.string()
        .required('O nome do cliente é obrigatório.')
        .min(3, 'O nome deve ter pelo menos 3 caracteres.')
        .max(100, 'O nome não pode exceder 100 caracteres.'),

    phone: yup.string()
        .required('O telefone é obrigatório.')
        .matches(phoneRegex, 'Formato de telefone inválido.'),

    email: yup.string()
        .required('O e-mail é obrigatório.')
        .email('Formato de e-mail inválido.'),

    document: yup.string()
        .required('CPF ou CNPJ é obrigatório.')
        .test('is-cpf-or-cnpj', 'CPF ou CNPJ inválido.', (value) => {
            if (!value) return false;
            return cpfRegex.test(value) || cnpjRegex.test(value);
        }),

    address: yup.string()
        .required('O endereço é obrigatório.')
        .min(5, 'O endereço deve ter pelo menos 5 caracteres.')
        .max(200, 'O endereço não pode exceder 200 caracteres.'),

    city: yup.string()
        .required('A cidade é obrigatória.')
        .min(2, 'A cidade deve ter pelo menos 2 caracteres.')
        .max(100, 'A cidade não pode exceder 100 caracteres.'),

    zip_code: yup.string()
        .matches(cepRegex, 'Formato de CEP inválido. Use XXXXX-XXX.')
        .nullable(),

});