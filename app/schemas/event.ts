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
        .required('O inicio do evento é obrigatório'),
    end_time: yup
        .string()
        .required('A final do evento é obrigatório'),
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