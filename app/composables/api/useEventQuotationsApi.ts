import type { FetchError } from 'ofetch'
import type { EmittedFilters } from "~/types/filter";
import type { VDataTableServerOptions } from '~/types/data-table';
import type { EventQuotations, EventQuotation, FormEventQuotation, FormEventQuotationDrink } from "~/types/event-quotations";

export function useEventQuotationsApi() {
    const getEventQuotations = async (props?: VDataTableServerOptions, filters?: EmittedFilters) => {
        try {
            const res = await $fetch<EventQuotations>('/api/event-quotations', {
                query: {
                    ...props,
                    filters
                },
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch Event Quotations.');
        }
    };

    const getEventQuotationById = async (id: string) => {
        try {
            const res = await $fetch<EventQuotation>(`/api/event-quotations/${id}`);

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to fetch event quotation with ID ${id}.`);
        }
    };

    const createEventQuotation = async (data: FormEventQuotation) => {
        try {
            const res = await $fetch<EventQuotation>('/api/event-quotations', {
                method: 'POST',
                body: {
                    client_name: data.client_name,
                    client_email: data.client_email,
                    client_phone: data.client_phone,
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
            $toast().error(err.message || 'Failed to create event quotation.');
        }
    };

    const updateEventQuotation = async (id: string, data: FormEventQuotation) => {
        try {
            const res = await $fetch<EventQuotation>(`/api/event-quotations/${id}`, {
                method: 'PUT',
                body: {
                    client_name: data.client_name,
                    client_email: data.client_email,
                    client_phone: data.client_phone,
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
                    fuel_cost_per_km: data.fuel_cost_per_km,
                },
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to update event quotation with ID ${id}.`);
        }
    };

    const deleteEventQuotation = async (id: string) => {
        try {
            await $fetch(`/api/event-quotations/${id}`, {
                method: 'DELETE',
            });

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to delete event quotation with ID ${id}.`);
        }
    };

    const getEventQuotationDrinks = async (eventQuotationId: string) => {
        try {
            const res = await $fetch(`/api/event-quotations/${eventQuotationId}/drinks`);

            return res
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch event quotation drinks.');
        }
    };

    const upsertEventQuotationDrinks = async (drinkId: string, data: FormEventQuotationDrink[]) => {
        try {
            const res = await $fetch(`/api/event-quotations/${drinkId}/drinks/upsert-multiple`, {
                method: 'POST',
                body: data,
            });

            return res
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to create event quotation drinks.');
        }
    };

    const deleteEventQuotationDrink = async (eventQuotationId: string, eventQuotationDrinkId: string) => {
        try {

            await $fetch(`/api/event-quotations/${eventQuotationId}/drinks/${eventQuotationDrinkId}`, {
                method: 'DELETE',
            });

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to delete event quotation drinks.');
        }
    };

    const convertToEvent = async (eventQuotationId: string) => {
        try {
            const res = await $fetch(`/api/event-quotations/${eventQuotationId}/convert-to-event`, {
                method: 'POST',
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to convert event quotation to event.');
        }
    };

    return {
        getEventQuotations,
        getEventQuotationById,
        createEventQuotation,
        updateEventQuotation,
        deleteEventQuotation,
        getEventQuotationDrinks,
        upsertEventQuotationDrinks,
        deleteEventQuotationDrink,
        convertToEvent
    }
}
