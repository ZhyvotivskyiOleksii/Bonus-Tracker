-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    title TEXT NOT NULL,
    body TEXT NOT NULL
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all authenticated users
CREATE POLICY "Allow authenticated read access"
ON notifications
FOR SELECT
TO authenticated
USING (true);

-- Allow write access only to admins
CREATE POLICY "Allow admin write access"
ON notifications
FOR INSERT
TO authenticated
WITH CHECK (
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'site_manager_privilege'
);
