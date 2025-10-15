import * as yup from 'yup';

export const eventSchema = yup.object({
    client_id: yup
        .string()
        .required('O cliente é obrigatório'),
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
        .required('O status é obrigatório'),
    notes: yup
        .string()
        .notRequired(),
});