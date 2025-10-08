export interface Clients {
    data: Datum[];
    page: Page;
}

export interface Datum {
    id: string;
    name: string;
    phone: string;
    email: string;
    user_id: string;
    document: string;
    created_at: string;
    updated_at: string;
    phone_optional: string | null
    client_addresses: ClientAddresses;
}

export interface ClientAddresses {
    city: string;
    state: string;
    number: string;
    street: string;
    zip_code: string;
    client_id: string;
    created_at: string;
    updated_at: string;
    neighborhood: string;
    additional_info: string;
}

export interface Page {
    page: number;
    itemsPerPage: number;
    totalRows: number;
    totalPages: number;
}


export type FormClient = {
    id?: string
    name: string
    email?: string | null
    phone?: string | null
    phone_optional?: string | null
    document?: string | null
    user_id?: string | null
    updated_at?: string | null
    created_at?: string | null
}

export interface FormClientAddresses {
    city: string;
    state: string;
    number: string;
    street: string;
    zip_code: string;
    neighborhood: string;
    additional_info?: string;
}