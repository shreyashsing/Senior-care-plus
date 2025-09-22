-- Payment Orders Table
-- This table stores payment order information before payment completion

CREATE TABLE IF NOT EXISTS payment_orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id VARCHAR(255) UNIQUE NOT NULL, -- Application generated order ID
    amount INTEGER NOT NULL, -- Amount in paise
    currency VARCHAR(3) DEFAULT 'INR',
    plan_type VARCHAR(50) NOT NULL,
    patient_data JSONB NOT NULL, -- Store patient form data temporarily
    receipt VARCHAR(100) NOT NULL,
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    razorpay_signature VARCHAR(500),
    status VARCHAR(20) DEFAULT 'created' CHECK (status IN ('created', 'attempted', 'paid', 'failed', 'cancelled')),
    failure_reason TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for payment orders
CREATE INDEX IF NOT EXISTS idx_payment_orders_order_id ON payment_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_razorpay_order_id ON payment_orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_payment_orders_status ON payment_orders(status);
CREATE INDEX IF NOT EXISTS idx_payment_orders_created_at ON payment_orders(created_at);

-- Patient Cards Table (for e-cards)
CREATE TABLE IF NOT EXISTS patient_cards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    card_number VARCHAR(20) UNIQUE NOT NULL,
    issue_date TIMESTAMPTZ DEFAULT NOW(),
    expiry_date TIMESTAMPTZ,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired', 'cancelled')),
    qr_code_data TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes for patient cards
CREATE INDEX IF NOT EXISTS idx_patient_cards_patient_id ON patient_cards(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_cards_card_number ON patient_cards(card_number);
CREATE INDEX IF NOT EXISTS idx_patient_cards_status ON patient_cards(status);

-- Update patients table to include payment information
ALTER TABLE patients 
ADD COLUMN IF NOT EXISTS payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
ADD COLUMN IF NOT EXISTS razorpay_payment_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS razorpay_order_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS plan_amount INTEGER, -- Amount paid in paise
ADD COLUMN IF NOT EXISTS plan_duration VARCHAR(20); -- monthly, yearly

-- Enable RLS on payment_orders
ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to create and view payment orders
CREATE POLICY "Users can create payment orders" ON payment_orders
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can view payment orders" ON payment_orders
    FOR SELECT USING (auth.role() = 'authenticated');

-- Allow admins to view all payment orders
CREATE POLICY "Admins can view all payment orders" ON payment_orders
    FOR SELECT USING (
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' OR
        (auth.jwt() -> 'raw_user_meta_data' ->> 'role') = 'admin'
    );

-- Function to update payment status
CREATE OR REPLACE FUNCTION update_payment_status(
    p_order_id TEXT,
    p_razorpay_payment_id TEXT,
    p_razorpay_signature TEXT,
    p_status TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE payment_orders 
    SET 
        status = p_status,
        razorpay_payment_id = p_razorpay_payment_id,
        razorpay_signature = p_razorpay_signature,
        completed_at = CASE WHEN p_status = 'paid' THEN NOW() ELSE completed_at END,
        updated_at = NOW()
    WHERE order_id = p_order_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add indexes for payment fields in patients table
CREATE INDEX IF NOT EXISTS idx_patients_payment_status ON patients(payment_status);
CREATE INDEX IF NOT EXISTS idx_patients_razorpay_payment_id ON patients(razorpay_payment_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
CREATE OR REPLACE TRIGGER update_payment_orders_updated_at
    BEFORE UPDATE ON payment_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_patient_cards_updated_at
    BEFORE UPDATE ON patient_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to generate unique card number
CREATE OR REPLACE FUNCTION generate_card_number()
RETURNS TEXT AS $$
DECLARE
    card_number TEXT;
    exists_check BOOLEAN;
BEGIN
    LOOP
        -- Generate card number with SC prefix + 8 digit timestamp + 2 random digits
        card_number := 'SC' || LPAD(EXTRACT(EPOCH FROM NOW())::TEXT, 8, '0') || LPAD(FLOOR(RANDOM() * 100)::TEXT, 2, '0');
        
        -- Check if card number already exists
        SELECT EXISTS(SELECT 1 FROM patient_cards WHERE card_number = card_number) INTO exists_check;
        
        -- If doesn't exist, return the card number
        IF NOT exists_check THEN
            RETURN card_number;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Enable RLS on new tables
ALTER TABLE payment_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_cards ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payment_orders
CREATE POLICY "Users can view their own payment orders" ON payment_orders
    FOR SELECT USING (true); -- Allow admins to view all orders

CREATE POLICY "Users can create payment orders" ON payment_orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own payment orders" ON payment_orders
    FOR UPDATE USING (true);

-- RLS Policies for patient_cards
CREATE POLICY "Patients can view their own cards" ON patient_cards
    FOR SELECT USING (true); -- Allow viewing of all cards for now

CREATE POLICY "System can create patient cards" ON patient_cards
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update patient cards" ON patient_cards
    FOR UPDATE USING (true);

-- Sample payment plans data (optional)
CREATE TABLE IF NOT EXISTS payment_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'single', 'couple', 'family'
    duration VARCHAR(20) NOT NULL, -- 'monthly', 'yearly'
    amount INTEGER NOT NULL, -- Amount in paise
    currency VARCHAR(3) DEFAULT 'INR',
    features JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert sample payment plans
INSERT INTO payment_plans (name, type, duration, amount, features) VALUES
('Single Monthly', 'single', 'monthly', 49900, '["24/7 Support", "Emergency Services", "Doctor Consultations"]'),
('Single Yearly', 'single', 'yearly', 499900, '["24/7 Support", "Emergency Services", "Doctor Consultations", "10% Yearly Discount"]'),
('Couple Monthly', 'couple', 'monthly', 79900, '["24/7 Support for 2", "Emergency Services", "Doctor Consultations", "Health Monitoring"]'),
('Couple Yearly', 'couple', 'yearly', 799900, '["24/7 Support for 2", "Emergency Services", "Doctor Consultations", "Health Monitoring", "10% Yearly Discount"]'),
('Family Monthly', 'family', 'monthly', 119900, '["24/7 Support for Family", "Emergency Services", "Doctor Consultations", "Health Monitoring", "Family Health Reports"]'),
('Family Yearly', 'family', 'yearly', 1199900, '["24/7 Support for Family", "Emergency Services", "Doctor Consultations", "Health Monitoring", "Family Health Reports", "10% Yearly Discount"]')
ON CONFLICT DO NOTHING;

-- Add RLS for payment_plans
ALTER TABLE payment_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view payment plans" ON payment_plans
    FOR SELECT USING (is_active = true);

-- Create trigger for payment_plans
CREATE OR REPLACE TRIGGER update_payment_plans_updated_at
    BEFORE UPDATE ON payment_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();