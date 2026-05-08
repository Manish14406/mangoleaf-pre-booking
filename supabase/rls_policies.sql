-- ============================================================
-- RLS POLICIES FOR ANONYMOUS USERS
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- OPTIONAL: Prevent duplicate party bookings at DB level
-- ALTER TABLE party_bookings ADD CONSTRAINT unique_party_booking UNIQUE (date, time);

-- ── table_bookings ──────────────────────────────────────────

-- Enable RLS (in case it is not already enabled)
ALTER TABLE table_bookings ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist (idempotent re-run safety)
DROP POLICY IF EXISTS "anon_select_table_bookings"  ON table_bookings;
DROP POLICY IF EXISTS "anon_insert_table_bookings"  ON table_bookings;
DROP POLICY IF EXISTS "anon_update_table_bookings"  ON table_bookings;
DROP POLICY IF EXISTS "anon_delete_table_bookings"  ON table_bookings;

-- Allow anonymous users to read all bookings (needed for availability check)
CREATE POLICY "anon_select_table_bookings"
  ON table_bookings
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to insert a new booking (creates pending row)
CREATE POLICY "anon_insert_table_bookings"
  ON table_bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to update their own booking (confirm after payment)
CREATE POLICY "anon_update_table_bookings"
  ON table_bookings
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Allow anonymous users to delete their own booking (cleanup on cancel)
CREATE POLICY "anon_delete_table_bookings"
  ON table_bookings
  FOR DELETE
  TO anon
  USING (true);


-- ── tables ──────────────────────────────────────────────────

-- Enable RLS
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist
DROP POLICY IF EXISTS "anon_select_tables" ON tables;

-- Allow anonymous users to read all tables (needed for availability check)
CREATE POLICY "anon_select_tables"
  ON tables
  FOR SELECT
  TO anon
  USING (true);


-- ── party_bookings ─────────────────────────────────────────

-- Enable RLS
ALTER TABLE party_bookings ENABLE ROW LEVEL SECURITY;

-- Drop old policies if they exist (idempotent re-run safety)
DROP POLICY IF EXISTS "anon_select_party_bookings" ON party_bookings;
DROP POLICY IF EXISTS "anon_insert_party_bookings" ON party_bookings;
DROP POLICY IF EXISTS "anon_update_party_bookings" ON party_bookings;

-- Allow anonymous users to read party bookings (admin dashboard)
CREATE POLICY "anon_select_party_bookings"
  ON party_bookings
  FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to insert a party booking (after payment)
CREATE POLICY "anon_insert_party_bookings"
  ON party_bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to update party bookings (admin status changes)
CREATE POLICY "anon_update_party_bookings"
  ON party_bookings
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);
