import { insforge } from './lib/insforge';

const api = {
    get: async (endpoint) => {
        if (endpoint === '/service-entries') {
            const { data, error } = await insforge
                .from('service_entries')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            // Map snake_case to camelCase for frontend compatibility
            return {
                data: data.map(entry => ({
                    _id: entry.id,
                    tokenNumber: entry.token_number,
                    customerName: entry.customer_name,
                    customerMobile: entry.customer_mobile,
                    mobileBrandModel: entry.mobile_brand_model,
                    issueDescription: entry.issue_description,
                    estimatedCharge: entry.estimated_charge,
                    status: entry.status,
                    entryDate: entry.created_at,
                }))
            };
        }
    },

    post: async (endpoint, payload) => {
        if (endpoint === '/service-entries') {
            // Map camelCase to snake_case
            const dbPayload = {
                token_number: payload.tokenNumber || `T-${Date.now()}`,
                customer_name: payload.customerName,
                customer_mobile: payload.customerMobile,
                mobile_brand_model: payload.mobileBrandModel,
                issue_description: payload.issueDescription,
                estimated_charge: payload.estimatedCharge,
                status: payload.status,
                ...(payload.entryDate ? { created_at: new Date(payload.entryDate).toISOString() } : {}),
            };

            const { data, error } = await insforge
                .from('service_entries')
                .insert([dbPayload])
                .select();

            if (error) throw error;
            return { data: data[0] };
        }
    },

    put: async (endpoint, payload) => {
        if (endpoint.startsWith('/service-entries/')) {
            const id = endpoint.split('/').pop();

            const dbPayload = {
                token_number: payload.tokenNumber,
                customer_name: payload.customerName,
                customer_mobile: payload.customerMobile,
                mobile_brand_model: payload.mobileBrandModel,
                issue_description: payload.issueDescription,
                estimated_charge: payload.estimatedCharge,
                status: payload.status,
                ...(payload.entryDate ? { created_at: new Date(payload.entryDate).toISOString() } : {}),
                updated_at: new Date().toISOString(),
            };

            const { data, error } = await insforge
                .from('service_entries')
                .update(dbPayload)
                .eq('id', id)
                .select();

            if (error) throw error;
            return { data: data[0] };
        }
    },

    delete: async (endpoint) => {
        if (endpoint.startsWith('/service-entries/')) {
            const id = endpoint.split('/').pop();
            const { error } = await insforge
                .from('service_entries')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { message: 'Deleted successfully' };
        }
    }
};

export default api;
