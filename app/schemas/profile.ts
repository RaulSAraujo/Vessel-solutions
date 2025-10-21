import * as yup from 'yup';

export const profileSchema = yup.object({
    full_name: yup
        .string()
        .min(2, 'O nome deve ter no mínimo 2 caracteres')
        .max(100, 'O nome deve ter no máximo 100 caracteres')
        .required('O nome é obrigatório'),
    phone: yup
        .string()
        .matches(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Formato de telefone inválido (XX) XXXXX-XXXX')
        .nullable(),
    avatar_url: yup
        .string()
        .url('URL do avatar deve ser válida')
        .nullable(),
});

export const passwordChangeSchema = yup.object({
    current_password: yup
        .string()
        .required('A senha atual é obrigatória'),
    new_password: yup
        .string()
        .min(8, 'A nova senha deve ter no mínimo 8 caracteres')
        .matches(/[a-z]/, 'A nova senha deve conter pelo menos uma letra minúscula')
        .matches(/[A-Z]/, 'A nova senha deve conter pelo menos uma letra maiúscula')
        .matches(/\d/, 'A nova senha deve conter pelo menos um número')
        .matches(/[^a-zA-Z0-9]/, 'A nova senha deve conter pelo menos um caractere especial')
        .required('A nova senha é obrigatória'),
    confirm_password: yup
        .string()
        .oneOf([yup.ref('new_password')], 'As senhas devem ser iguais')
        .required('A confirmação da senha é obrigatória'),
});
