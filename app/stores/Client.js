import { defineStore } from 'pinia';
import { toast } from 'vue-sonner';
import { createFormData } from '@/utils/formData';
import { handleRequest } from '@/utils/request';

export const useClientStore = defineStore('client', () => {
    const config = useRuntimeConfig();
    const token = useCookie('access_token');
    const authHeader = { Authorization: `Bearer ${token.value}` };

    const fields = ['name', 'address', 'phone', 'email', 'web', 'logoFile', 'status'];

    const searchById = async (customerId) => {
        const customers = await handleRequest(`${config.public.apiBase}/client`, 'GET', authHeader);
        return customers?.results.find(result => result.id === customerId)?.name || null;
    };

    const fetchAll = (page = 1, search = '', status = 'eksternal') =>
        handleRequest(`${config.public.apiBase}/client/?page=${page}&name=${search}&status=${status}`, 'GET', authHeader);

    const all = () => {
        return handleRequest(`${config.public.apiBase}/client/all`, 'GET', authHeader);
    };

    const update = async (id, data) => {
        try {
            const formData = createFormData(data, fields);
            const response = await handleRequest(`${config.public.apiBase}/client/${id}/`, 'PUT', authHeader, formData);
            if (response) {
                toast.success('Client updated successfully');
            }
            return response;
        } catch (error) {
            toast.error('Failed to update client. Please try again.');
            throw error;
        }
    };

    const add = async (data) => {
        try {
            const formData = createFormData(data, fields);
            const response = await handleRequest(`${config.public.apiBase}/client/`, 'POST', authHeader, formData);
            if (response) {
                toast.success('Client added successfully');
            }
            return response;
        } catch (error) {
            toast.error('Failed to add client. Please try again.');
            throw error;
        }
    };

    const destroy = async (id) => {
        try {
            const response = await handleRequest(`${config.public.apiBase}/client/${id}`, 'DELETE', authHeader);
            if (response !== undefined) {
                toast.success('Client deleted successfully');
            }
            return response;
        } catch (error) {
            toast.error('Failed to delete client. Please try again.');
            throw error;
        }
    };

    return {
        searchById,
        fetchAll,
        update,
        destroy,
        all,
        add
    };
});
