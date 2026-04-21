const insforgeUrl = import.meta.env.VITE_INSFORGE_URL;
const insforgeAnonKey = import.meta.env.VITE_INSFORGE_ANON_KEY;

if (!insforgeUrl || !insforgeAnonKey) {
    console.warn('Missing VITE_INSFORGE_URL or VITE_INSFORGE_ANON_KEY');
}

const restBase = `${insforgeUrl}/rest/v1`;
const commonHeaders = {
    apikey: insforgeAnonKey,
    Authorization: `Bearer ${insforgeAnonKey}`,
    'Content-Type': 'application/json',
};

const toUiEntry = (entry) => ({
    _id: entry.id,
    tokenNumber: entry.token_number,
    customerName: entry.customer_name,
    customerMobile: entry.customer_mobile,
    mobileBrandModel: entry.mobile_brand_model,
    issueDescription: entry.issue_description,
    estimatedCharge: entry.estimated_charge,
    status: entry.status,
    entryDate: entry.created_at,
});

async function request(path, options = {}) {
    const res = await fetch(`${restBase}${path}`, {
        ...options,
        headers: {
            ...commonHeaders,
            ...(options.headers || {}),
        },
    });

    const text = await res.text();
    const body = text ? JSON.parse(text) : null;

    if (!res.ok) {
        const msg = body?.message || body?.error_description || body?.error || `Request failed (${res.status})`;
        throw new Error(msg);
    }

    return body;
}

const api = {
    get: async (endpoint) => {
        if (endpoint === '/service-entries') {
            const data = await request('/service_entries?select=*&order=created_at.desc');
            return { data: Array.isArray(data) ? data.map(toUiEntry) : [] };
        }
        throw new Error(`Unsupported endpoint: ${endpoint}`);
    },

    post: async (endpoint, payload) => {
        if (endpoint === '/service-entries') {
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

            const data = await request('/service_entries', {
                method: 'POST',
                headers: { Prefer: 'return=representation' },
                body: JSON.stringify(dbPayload),
            });
            return { data: Array.isArray(data) ? toUiEntry(data[0]) : null };
        }
        throw new Error(`Unsupported endpoint: ${endpoint}`);
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

            const data = await request(`/service_entries?id=eq.${id}`, {
                method: 'PATCH',
                headers: { Prefer: 'return=representation' },
                body: JSON.stringify(dbPayload),
            });
            return { data: Array.isArray(data) ? toUiEntry(data[0]) : null };
        }
        throw new Error(`Unsupported endpoint: ${endpoint}`);
    },

    delete: async (endpoint) => {
        if (endpoint.startsWith('/service-entries/')) {
            const id = endpoint.split('/').pop();
            await request(`/service_entries?id=eq.${id}`, {
                method: 'DELETE',
            });
            return { message: 'Deleted successfully' };
        }
        throw new Error(`Unsupported endpoint: ${endpoint}`);
    },
};

export default api;
