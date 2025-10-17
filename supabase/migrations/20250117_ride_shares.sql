-- Migration: Add Ride Share System
-- Description: Coordinate transportation for away matches
-- Date: 2025-01-17

-- Ride offers from drivers
CREATE TABLE IF NOT EXISTS ride_offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  capacity INT NOT NULL CHECK (capacity > 0 AND capacity <= 8),
  departure_location TEXT NOT NULL,
  departure_time TIMESTAMP WITH TIME ZONE NOT NULL,
  return_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  status TEXT NOT NULL CHECK (status IN ('active', 'full', 'cancelled')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Ride requests/bookings from passengers
CREATE TABLE IF NOT EXISTS ride_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ride_offer_id UUID NOT NULL REFERENCES ride_offers(id) ON DELETE CASCADE,
  passenger_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(ride_offer_id, passenger_id)  -- One request per ride per passenger
);

-- Indexes
CREATE INDEX idx_ride_offers_event ON ride_offers(event_id);
CREATE INDEX idx_ride_offers_driver ON ride_offers(driver_id);
CREATE INDEX idx_ride_offers_status ON ride_offers(status);
CREATE INDEX idx_ride_requests_offer ON ride_requests(ride_offer_id);
CREATE INDEX idx_ride_requests_passenger ON ride_requests(passenger_id);
CREATE INDEX idx_ride_requests_status ON ride_requests(status);

-- RLS Policies
ALTER TABLE ride_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ride_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can view active ride offers
CREATE POLICY "Anyone can view ride offers"
  ON ride_offers FOR SELECT
  USING (true);

-- Users can create their own ride offers
CREATE POLICY "Users can create ride offers"
  ON ride_offers FOR INSERT
  WITH CHECK (auth.uid() = driver_id);

-- Drivers can update their own offers
CREATE POLICY "Drivers can update own offers"
  ON ride_offers FOR UPDATE
  USING (auth.uid() = driver_id);

-- Drivers can delete their own offers
CREATE POLICY "Drivers can delete own offers"
  ON ride_offers FOR DELETE
  USING (auth.uid() = driver_id);

-- Anyone can view ride requests
CREATE POLICY "Anyone can view ride requests"
  ON ride_requests FOR SELECT
  USING (true);

-- Passengers can create requests
CREATE POLICY "Passengers can create requests"
  ON ride_requests FOR INSERT
  WITH CHECK (auth.uid() = passenger_id);

-- Passengers can update their own requests
CREATE POLICY "Passengers can update own requests"
  ON ride_requests FOR UPDATE
  USING (auth.uid() = passenger_id);

-- Drivers can update requests for their offers
CREATE POLICY "Drivers can update requests for their rides"
  ON ride_requests FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM ride_offers
      WHERE ride_offers.id = ride_requests.ride_offer_id
      AND ride_offers.driver_id = auth.uid()
    )
  );

-- Passengers can delete their own requests
CREATE POLICY "Passengers can delete own requests"
  ON ride_requests FOR DELETE
  USING (auth.uid() = passenger_id);

-- Auto-update ride offer status when full
CREATE OR REPLACE FUNCTION update_ride_offer_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the ride offer capacity
  DECLARE
    offer_capacity INT;
    confirmed_count INT;
  BEGIN
    SELECT capacity INTO offer_capacity
    FROM ride_offers
    WHERE id = NEW.ride_offer_id;

    SELECT COUNT(*) INTO confirmed_count
    FROM ride_requests
    WHERE ride_offer_id = NEW.ride_offer_id
    AND status = 'confirmed';

    -- Update status if full
    IF confirmed_count >= offer_capacity THEN
      UPDATE ride_offers
      SET status = 'full'
      WHERE id = NEW.ride_offer_id;
    ELSIF confirmed_count < offer_capacity THEN
      UPDATE ride_offers
      SET status = 'active'
      WHERE id = NEW.ride_offer_id
      AND status = 'full';
    END IF;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ride_request_status_update
AFTER INSERT OR UPDATE OR DELETE ON ride_requests
FOR EACH ROW
EXECUTE FUNCTION update_ride_offer_status();

-- Comments
COMMENT ON TABLE ride_offers IS 'Ride offers from drivers for away matches';
COMMENT ON TABLE ride_requests IS 'Ride requests from passengers';
