import type { FetchError } from 'ofetch'
import type { EmittedFilters } from "~/types/filter";
import type { Datum as Drink } from '~/types/drinks'
import type { Events, Datum, FormEvent } from "~/types/events";
import type { VDataTableServerOptions } from '~/types/data-table';
import type { Datum as EventDrink, FormEventDrinks } from '~/types/event-drinks';

type EventDrinksWithRelations = EventDrink & { drinks: Drink }

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
                    end_time: formatDateTimeToDB(data.end_time),
                    guest_count: data.guest_count,
                    audience_profile: data.audience_profile,
                    status: data.status,
                    notes: data.notes,
                    estimated_total_drinks: data.estimated_total_drinks,
                    total_cost: data.total_cost,
                    distance: data.distance,
                    total_revenue: data.total_revenue,
                    profit_margin: data.profit_margin,
                    bartender_hourly_rate: data.bartender_hourly_rate,
                    num_bartenders: data.num_bartenders,
                    helper_hourly_rate: data.helper_hourly_rate,
                    num_helpers: data.num_helpers,
                    fuel_cost_per_km: data.fuel_cost_per_km
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
                    audience_profile: data.audience_profile,
                    status: data.status,
                    notes: data.notes,
                    estimated_total_drinks: data.estimated_total_drinks,
                    total_cost: data.total_cost,
                    total_revenue: data.total_revenue,
                    distance: data.distance,
                    profit_margin: data.profit_margin,
                    bartender_hourly_rate: data.bartender_hourly_rate,
                    num_bartenders: data.num_bartenders,
                    helper_hourly_rate: data.helper_hourly_rate,
                    num_helpers: data.num_helpers,
                    fuel_cost_per_km: data.fuel_cost_per_km
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

    const deleteEventDrink = async (eventId: string, eventDrinkId: string) => {
        try {

            await $fetch(`/api/events/${eventId}/drinks/${eventDrinkId}`, {
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