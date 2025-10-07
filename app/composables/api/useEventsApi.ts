import type { FetchError } from 'ofetch'
import type { EmittedFilters } from "~/types/filter";
import type { VDataTableServerOptions } from '~/types/data-table';
import type { Events, Datum, FormEvent } from "~/types/events";

export function useEventsApi() {
    const getEvents = async (props?: VDataTableServerOptions, filters?: EmittedFilters) => {
        try {
            const res = await $fetch<Events>('/api/events', {
                query: {
                    ...props,
                    filters
                },
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch Events.');
        }
    };

    const getEventById = async (id: string) => {
        try {
            const res = await $fetch<Datum>(`/api/events/${id}`);

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to fetch event with ID ${id}.`);
        }
    };

    const createEvent = async (data: FormEvent) => {
        try {
            const res = await $fetch<Datum>('/api/events', {
                method: 'POST',
                body: data,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to create event.');
        }
    };

    const updateEvent = async (id: string, data: FormEvent) => {
        try {
            const res = await $fetch<Datum>(`/api/events/${id}`, {
                method: 'PUT',
                body: data,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to update event with ID ${id}.`);
        }
    };

    const deleteEvent = async (id: string) => {
        try {
            await $fetch(`/api/events/${id}`, {
                method: 'DELETE',
            });

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to delete event with ID ${id}.`);
        }
    };

    return {
        getEvents,
        getEventById,
        createEvent,
        updateEvent,
        deleteEvent
    }
}