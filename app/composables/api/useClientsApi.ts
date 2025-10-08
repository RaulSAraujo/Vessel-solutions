import type { FetchError } from 'ofetch'
import type { EmittedFilters } from "~/types/filter";
import type { VDataTableServerOptions } from '~/types/data-table';
import type { Clients, Datum, FormClient, FormClientAddresses, ClientAddresses } from '~/types/clients';

export function useClientsApi() {
    const getClients = async (props?: VDataTableServerOptions, filters?: EmittedFilters) => {
        try {
            const res = await $fetch<Clients>('/api/clients', {
                query: {
                    ...props,
                    filters
                },
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch clients.');
        }
    };

    const getClientById = async (id: string) => {
        try {
            const res = await $fetch<Datum>(`/api/clients/${id}`);

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to fetch client with ID ${id}.`);
        }
    };

    const createClient = async (clientData: FormClient) => {
        try {
            const res = await $fetch<Datum>('/api/clients', {
                method: 'POST',
                body: clientData,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to create client.');
        }
    };

    const updateClient = async (id: string, clientData: FormClient) => {
        try {
            const res = await $fetch<Datum>(`/api/clients/${id}`, {
                method: 'PUT',
                body: clientData,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to update client with ID ${id}.`);
        }
    };

    const deleteClient = async (id: string) => {
        try {
            await $fetch(`/api/clients/${id}`, {
                method: 'DELETE',
            });

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to delete client with ID ${id}.`);
        }
    };

    const createClientAddresses = async (clientId: string, addressData: FormClientAddresses) => {
        try {
            const res = await $fetch<ClientAddresses>(`/api/clients/${clientId}/addresses`, {
                method: 'POST',
                body: addressData,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to create address for client with ID ${clientId}.`);
        }
    };

    const updateClientAddresses = async (clientId: string, addressData: FormClientAddresses) => {
        try {
            const res = await $fetch<ClientAddresses>(`/api/clients/${clientId}/addresses`, {
                method: 'PUT',
                body: addressData,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to create address for client with ID ${clientId}.`);
        }
    };

    const createClientAndAddress = async (clientData: FormClient & FormClientAddresses) => {
        try {
            const res = await $fetch<Datum>('/api/client-address', {
                method: 'POST',
                body: clientData,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to create client.');
        }
    };

    const updateClientAndAddress = async (clientId: string, clientData: FormClient & FormClientAddresses) => {
        try {
            const res = await $fetch<Datum>(`/api/client-address/${clientId}`, {
                method: 'PUT',
                body: clientData,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to create client.');
        }
    };


    return {
        getClients,
        getClientById,
        createClient,
        updateClient,
        deleteClient,
        createClientAddresses,
        updateClientAddresses,
        createClientAndAddress,
        updateClientAndAddress
    };
}