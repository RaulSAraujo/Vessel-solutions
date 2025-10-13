import type { FetchError } from 'ofetch'
import type { EmittedFilters } from "~/types/filter";
import type { VDataTableServerOptions } from '~/types/data-table';
import type { Categories, Datum, FormCategory } from "~/types/categories";

export function useCategoriesApi() {
    const getCategories = async (props?: VDataTableServerOptions, filters?: EmittedFilters) => {
        try {
            const res = await $fetch<Categories>('/api/category', {
                query: {
                    ...props,
                    filters
                },
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to fetch category.');
        }
    };

    const getCategoryById = async (id: string) => {
        try {
            const res = await $fetch<Datum>(`/api/category/${id}`);

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to fetch category with ID ${id}.`);
        }
    };

    const createCategory = async (data: FormCategory) => {
        try {
            const res = await $fetch<Datum>('/api/category', {
                method: 'POST',
                body: data,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || 'Failed to create category.');
        }
    };

    const updateCategory = async (id: string, data: FormCategory) => {
        try {
            const res = await $fetch<Datum>(`/api/category/${id}`, {
                method: 'PUT',
                body: data,
            });

            return res;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to update category with ID ${id}.`);
        }
    };

    const deleteCategory = async (id: string) => {
        try {
            await $fetch(`/api/category/${id}`, {
                method: 'DELETE',
            });

            return true;
        } catch (error: unknown) {
            const err = error as FetchError;
            $toast().error(err.message || `Failed to delete category with ID ${id}.`);
        }
    };

    return {
        getCategories,
        getCategoryById,
        createCategory,
        updateCategory,
        deleteCategory
    }
}