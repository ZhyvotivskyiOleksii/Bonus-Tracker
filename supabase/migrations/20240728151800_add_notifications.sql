-- Create the notifications table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow authenticated users to read all notifications
CREATE POLICY "Allow authenticated real-time read access"
ON public.notifications
FOR SELECT
TO authenticated
USING (true);

-- Add the table to the publication for real-time
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
