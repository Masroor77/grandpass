-- Create Service Entries Table
CREATE TABLE service_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    token_number TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    customer_mobile TEXT NOT NULL,
    mobile_brand_model TEXT NOT NULL,
    issue_description TEXT NOT NULL,
    estimated_charge NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Delivered')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) - Optional for initial dev but recommended
ALTER TABLE service_entries ENABLE ROW LEVEL SECURITY;

-- Create Policy to allow anonymous access (for development/demo purposes)
-- WARNING: In production, you should restrict this based on authentication.
CREATE POLICY "Allow public access" ON service_entries
    FOR ALL
    USING (true)
    WITH CHECK (true);
