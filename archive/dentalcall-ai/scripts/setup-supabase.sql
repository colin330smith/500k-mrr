-- DentalCall AI - Complete Supabase Setup
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/fataxuuxjwibugjxekwm/sql

-- ============================================
-- STEP 1: Enable Extensions
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- STEP 2: Create Tables
-- ============================================

-- Profiles (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  practice_name TEXT,
  phone_number TEXT,
  address TEXT,
  website TEXT,
  selected_plan TEXT DEFAULT 'professional',
  stripe_customer_id TEXT UNIQUE,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_invoice_id TEXT UNIQUE NOT NULL,
  stripe_subscription_id TEXT REFERENCES public.subscriptions(stripe_subscription_id),
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Voice Agents
CREATE TABLE IF NOT EXISTS public.voice_agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL DEFAULT 'DentalCall AI',
  greeting TEXT DEFAULT 'Thank you for calling. How may I help you today?',
  voice_id TEXT DEFAULT 'alloy',
  phone_number TEXT,
  vapi_assistant_id TEXT,
  calendar_integration TEXT,
  calendar_id TEXT,
  business_hours JSONB DEFAULT '{"monday":{"open":"09:00","close":"17:00"},"tuesday":{"open":"09:00","close":"17:00"},"wednesday":{"open":"09:00","close":"17:00"},"thursday":{"open":"09:00","close":"17:00"},"friday":{"open":"09:00","close":"17:00"}}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Calls
CREATE TABLE IF NOT EXISTS public.calls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  voice_agent_id UUID REFERENCES public.voice_agents(id),
  vapi_call_id TEXT UNIQUE,
  caller_phone TEXT,
  caller_name TEXT,
  duration_seconds INTEGER DEFAULT 0,
  outcome TEXT CHECK (outcome IN ('booked', 'transferred', 'voicemail', 'inquiry', 'spam', 'missed')),
  transcript TEXT,
  summary TEXT,
  sentiment TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  appointment_booked_at TIMESTAMPTZ,
  recording_url TEXT,
  cost_cents INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Appointments
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  call_id UUID REFERENCES public.calls(id),
  patient_name TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_email TEXT,
  appointment_type TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Call Stats (aggregated for performance)
CREATE TABLE IF NOT EXISTS public.call_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_calls INTEGER DEFAULT 0,
  calls_answered INTEGER DEFAULT 0,
  calls_missed INTEGER DEFAULT 0,
  appointments_booked INTEGER DEFAULT 0,
  minutes_used INTEGER DEFAULT 0,
  estimated_revenue DECIMAL(10,2) DEFAULT 0,
  avg_call_duration INTEGER DEFAULT 0,
  month_start DATE DEFAULT DATE_TRUNC('month', NOW()),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 3: Enable Row Level Security
-- ============================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_stats ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 4: Create RLS Policies
-- ============================================

-- Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Subscriptions
CREATE POLICY "Users can view own subscriptions" ON public.subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Payments
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.subscriptions s WHERE s.stripe_subscription_id = payments.stripe_subscription_id AND s.user_id = auth.uid())
);

-- Voice Agents
CREATE POLICY "Users can view own voice agents" ON public.voice_agents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own voice agents" ON public.voice_agents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own voice agents" ON public.voice_agents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own voice agents" ON public.voice_agents FOR DELETE USING (auth.uid() = user_id);

-- Calls
CREATE POLICY "Users can view own calls" ON public.calls FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own calls" ON public.calls FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Appointments
CREATE POLICY "Users can view own appointments" ON public.appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own appointments" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own appointments" ON public.appointments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own appointments" ON public.appointments FOR DELETE USING (auth.uid() = user_id);

-- Call Stats
CREATE POLICY "Users can view own stats" ON public.call_stats FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- STEP 5: Create Triggers
-- ============================================

-- Auto-create profile and stats on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, practice_name, selected_plan)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'practice_name', 'My Dental Practice'),
    COALESCE(NEW.raw_user_meta_data->>'selected_plan', 'professional')
  );

  INSERT INTO public.call_stats (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_voice_agents_updated_at BEFORE UPDATE ON public.voice_agents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Update call stats on new call
CREATE OR REPLACE FUNCTION public.update_call_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.call_stats (user_id, total_calls, minutes_used)
  VALUES (NEW.user_id, 1, COALESCE(NEW.duration_seconds / 60, 0))
  ON CONFLICT (user_id) DO UPDATE SET
    total_calls = call_stats.total_calls + 1,
    minutes_used = call_stats.minutes_used + COALESCE(NEW.duration_seconds / 60, 0),
    calls_answered = CASE WHEN NEW.outcome != 'missed' THEN call_stats.calls_answered + 1 ELSE call_stats.calls_answered END,
    appointments_booked = CASE WHEN NEW.outcome = 'booked' THEN call_stats.appointments_booked + 1 ELSE call_stats.appointments_booked END,
    estimated_revenue = CASE WHEN NEW.outcome = 'booked' THEN call_stats.estimated_revenue + 200 ELSE call_stats.estimated_revenue END,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_call_created
  AFTER INSERT ON public.calls
  FOR EACH ROW EXECUTE FUNCTION public.update_call_stats();

-- ============================================
-- STEP 6: Create Indexes
-- ============================================
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_calls_user_id ON public.calls(user_id);
CREATE INDEX IF NOT EXISTS idx_calls_created_at ON public.calls(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calls_outcome ON public.calls(outcome);
CREATE INDEX IF NOT EXISTS idx_voice_agents_user_id ON public.voice_agents(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_scheduled_at ON public.appointments(scheduled_at);

-- ============================================
-- STEP 7: Enable Realtime (optional)
-- ============================================
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.calls;
-- ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;

-- ============================================
-- DONE!
-- ============================================
SELECT 'DentalCall AI database setup complete!' as status;
