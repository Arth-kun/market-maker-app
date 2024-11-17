-- Create Market table
CREATE TABLE markets (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name text NOT NULL,
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Place table
CREATE TABLE places (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name text NOT NULL,
    address text NOT NULL,
    city text NOT NULL,
    country text NOT NULL,
    latitude double precision,
    longitude double precision,
    additional_info text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create MarketEdition table (modified to include place_id)
CREATE TABLE market_editions (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    market_id bigint REFERENCES markets(id) ON DELETE CASCADE,
    place_id bigint REFERENCES places(id) ON DELETE SET NULL,
    name text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT valid_dates CHECK (end_date >= start_date)
);

-- Create Maker table
CREATE TABLE makers (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name text NOT NULL,
    description text,
    contact_email text,
    phone text,
    website text,
    social_media text,
    profile_image text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create MakerCategory table
CREATE TABLE maker_categories (
    id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    name text NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create MarketEdition_Maker junction table
CREATE TABLE market_edition_makers (
    market_edition_id bigint REFERENCES market_editions(id) ON DELETE CASCADE,
    maker_id bigint REFERENCES makers(id) ON DELETE CASCADE,
    booth_number text,
    special_notes text,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (market_edition_id, maker_id)
);

-- Create Maker_Category junction table
CREATE TABLE maker_categories_junction (
    maker_id bigint REFERENCES makers(id) ON DELETE CASCADE,
    category_id bigint REFERENCES maker_categories(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (maker_id, category_id)
);

-- Create indexes for better query performance
CREATE INDEX idx_market_editions_market_id ON market_editions(market_id);
CREATE INDEX idx_market_editions_place_id ON market_editions(place_id);
CREATE INDEX idx_market_edition_makers_maker_id ON market_edition_makers(maker_id);
CREATE INDEX idx_maker_categories_junction_category_id ON maker_categories_junction(category_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_markets_updated_at
    BEFORE UPDATE ON markets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_places_updated_at
    BEFORE UPDATE ON places
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_market_editions_updated_at
    BEFORE UPDATE ON market_editions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_makers_updated_at
    BEFORE UPDATE ON makers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maker_categories_updated_at
    BEFORE UPDATE ON maker_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_market_edition_makers_updated_at
    BEFORE UPDATE ON market_edition_makers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();