import type { FetchError } from 'ofetch'
import type { EmittedFilters } from "~/types/filter";
import type { Datum as Drink } from '~/types/drinks'
import type { Events, Datum, FormEvent } from "~/types/events";
import type { VDataTableServerOptions } from '~/types/data-table';
import type { Datum as EventDrink, FormEventDrinks } from '~/types/event-drinks';

type EventDrinksWithRelations = EventDrink & { drinks: Drink & { drink_categories: { name: string } } }

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
                body: {
                    client_id: data.client_id,
                    location: data.location,
                    start_time: formatDateTimeToDB(data.start_time),
                    end_time: formatDateTimeToDB(data.start_time),
                    guest_count: data.guest_count,
                    distance: data.distance,
                    audience_profile: data.audience_profile,
                    status: data.status,
                    notes: data.notes
                },
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
                body: {
                    client_id: data.client_id,
                    location: data.location,
                    start_time: formatDateTimeToDB(data.start_time),
                    end_time: formatDateTimeToDB(data.end_time),
                    guest_count: data.guest_count,
                    distance: data.distance,
                    audience_profile: data.audience_profile,
                    status: data.status,
                    notes: data.notes
                },
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

    const getEventDrinks = async (eventId: string) => {
        try {
            const res = await $fetch<EventDrinksWithRelations[]>(`/api/events/${eventId}/drinks`);

            return res
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch event drinks.');
        }
    };

    const upsertEventDrinks = async (drinkId: string, data: FormEventDrinks[]) => {
        try {
            const res = await $fetch(`/api/events/${drinkId}/drinks/upsert-multiple`, {
                method: 'POST',
                body: data,
            });

            return res
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to create event drinks.');
        }
    };

    const deleteEventDrink = async (eventId: string, drinkId: string) => {
        try {

            await $fetch(`/api/events/${eventId}/drinks/${drinkId}`, {
                method: 'DELETE',
            });

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to delete event drinks.');
        }
    };

    return {
        getEvents,
        getEventById,
        createEvent,
        updateEvent,
        deleteEvent,
        getEventDrinks,
        upsertEventDrinks,
        deleteEventDrink
    }
}