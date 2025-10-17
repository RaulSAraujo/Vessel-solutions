import * as yup from 'yup';

export const eventQuotationSchema = yup.object({
    location: yup
        .string()
        .required('O local é obrigatório'),

    start_time: yup
        .string()
        .required('O início do evento é obrigatório')
        .matches(
            /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/,
            'O início do evento deve estar no formato DD/MM/YYYY HH:mm'
        ),
    end_time: yup
        .string()
        .required('O final do evento é obrigatório')
        .matches(
            /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}$/,
            'O final do evento deve estar no formato DD/MM/YYYY HH:mm'
        )
        .test(
            'is-after-start-time',
            'O final do evento deve ser posterior ao início do evento',
            function (value) {
                const { start_time } = this.parent;
                if (!start_time || !value) return true; // Ignorar validação se algum dos campos estiver vazio
                const start = new Date(formatDateTimeToDB(start_time));
                const end = new Date(formatDateTimeToDB(value));
                return end > start;
            }
        ),
    guest_count: yup
        .number()
        .required('A quantidade de convidados é obrigatória'),
    distance: yup
        .number()
        .notRequired(),
    audience_profile: yup
        .string()
        .required('O perfil de audiência é obrigatório'),
    status: yup
        .string()
        .oneOf(['draft', 'sent', 'approved', 'rejected', 'converted'], 'Status inválido')
        .required('O status é obrigatório'),
    notes: yup
        .string()
        .notRequired(),
    client_name: yup
        .string()
        .required('O nome do cliente é obrigatório'),
    client_email: yup
        .string()
        .email('O email deve ter um formato válido')
        .notRequired(),
    client_phone: yup
        .string()
        .required('O telefone do cliente é obrigatório'),
    bartender_hourly_rate: yup
        .number()
        .min(0, 'A taxa horária do bartender deve ser maior ou igual a zero')
        .notRequired(),
    num_bartenders: yup
        .number()
        .integer('O número de bartenders deve ser um número inteiro')
        .min(0, 'O número de bartenders deve ser maior ou igual a zero')
        .notRequired(),
    helper_hourly_rate: yup
        .number()
        .min(0, 'A taxa horária dos ajudantes deve ser maior ou igual a zero')
        .notRequired(),
    num_helpers: yup
        .number()
        .integer('O número de ajudantes deve ser um número inteiro')
        .min(0, 'O número de ajudantes deve ser maior ou igual a zero')
        .notRequired(),
    fuel_cost_per_km: yup
        .number()
        .min(0, 'O custo de combustível por km deve ser maior ou igual a zero')
        .notRequired(),
});
