-- First, create extension if not exists
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop all foreign key constraints first
ALTER TABLE market_editions 
    DROP CONSTRAINT IF EXISTS market_editions_market_id_fkey,
    DROP CONSTRAINT IF EXISTS market_editions_place_id_fkey;

ALTER TABLE market_edition_makers 
    DROP CONSTRAINT IF EXISTS market_edition_makers_market_edition_id_fkey,
    DROP CONSTRAINT IF EXISTS market_edition_makers_maker_id_fkey;

ALTER TABLE maker_categories_junction 
    DROP CONSTRAINT IF EXISTS maker_categories_junction_maker_id_fkey,
    DROP CONSTRAINT IF EXISTS maker_categories_junction_category_id_fkey;

-- 1. Base tables first
-- Markets
ALTER TABLE markets ADD COLUMN new_id uuid DEFAULT gen_random_uuid();
UPDATE markets SET new_id = gen_random_uuid();
ALTER TABLE markets DROP CONSTRAINT markets_pkey;
ALTER TABLE markets ALTER COLUMN new_id SET NOT NULL;
ALTER TABLE markets ADD PRIMARY KEY (new_id);

-- Places
ALTER TABLE places ADD COLUMN new_id uuid DEFAULT gen_random_uuid();
UPDATE places SET new_id = gen_random_uuid();
ALTER TABLE places DROP CONSTRAINT places_pkey;
ALTER TABLE places ALTER COLUMN new_id SET NOT NULL;
ALTER TABLE places ADD PRIMARY KEY (new_id);

-- Makers
ALTER TABLE makers ADD COLUMN new_id uuid DEFAULT gen_random_uuid();
UPDATE makers SET new_id = gen_random_uuid();
ALTER TABLE makers DROP CONSTRAINT makers_pkey;
ALTER TABLE makers ALTER COLUMN new_id SET NOT NULL;
ALTER TABLE makers ADD PRIMARY KEY (new_id);

-- Maker categories
ALTER TABLE maker_categories ADD COLUMN new_id uuid DEFAULT gen_random_uuid();
UPDATE maker_categories SET new_id = gen_random_uuid();
ALTER TABLE maker_categories DROP CONSTRAINT maker_categories_pkey;
ALTER TABLE maker_categories ALTER COLUMN new_id SET NOT NULL;
ALTER TABLE maker_categories ADD PRIMARY KEY (new_id);

-- 2. Market editions
ALTER TABLE market_editions ADD COLUMN new_id uuid DEFAULT gen_random_uuid();
ALTER TABLE market_editions ADD COLUMN new_market_id uuid;
ALTER TABLE market_editions ADD COLUMN new_place_id uuid;

UPDATE market_editions me SET 
    new_id = gen_random_uuid(),
    new_market_id = m.new_id,
    new_place_id = p.new_id
FROM markets m, places p 
WHERE me.market_id = m.id AND me.place_id = p.id;

ALTER TABLE market_editions DROP CONSTRAINT IF EXISTS market_editions_pkey;
ALTER TABLE market_editions ALTER COLUMN new_id SET NOT NULL;
ALTER TABLE market_editions ADD PRIMARY KEY (new_id);

-- 3. Junction tables
ALTER TABLE market_edition_makers ADD COLUMN new_market_edition_id uuid;
ALTER TABLE market_edition_makers ADD COLUMN new_maker_id uuid;

UPDATE market_edition_makers mem SET 
    new_market_edition_id = me.new_id,
    new_maker_id = m.new_id
FROM market_editions me, makers m 
WHERE mem.market_edition_id = me.id AND mem.maker_id = m.id;

ALTER TABLE maker_categories_junction ADD COLUMN new_maker_id uuid;
ALTER TABLE maker_categories_junction ADD COLUMN new_category_id uuid;

UPDATE maker_categories_junction mcj SET 
    new_maker_id = m.new_id,
    new_category_id = mc.new_id
FROM makers m, maker_categories mc 
WHERE mcj.maker_id = m.id AND mcj.category_id = mc.id;

-- 4. Drop old columns and rename new ones
-- Important: Keep primary keys intact during rename
ALTER TABLE markets DROP COLUMN id CASCADE;
ALTER TABLE markets RENAME COLUMN new_id TO id;

ALTER TABLE places DROP COLUMN id CASCADE;
ALTER TABLE places RENAME COLUMN new_id TO id;

ALTER TABLE makers DROP COLUMN id CASCADE;
ALTER TABLE makers RENAME COLUMN new_id TO id;

ALTER TABLE maker_categories DROP COLUMN id CASCADE;
ALTER TABLE maker_categories RENAME COLUMN new_id TO id;

ALTER TABLE market_editions 
    DROP COLUMN id CASCADE,
    DROP COLUMN market_id CASCADE,
    DROP COLUMN place_id CASCADE;
ALTER TABLE market_editions RENAME COLUMN new_id TO id;
ALTER TABLE market_editions RENAME COLUMN new_market_id TO market_id;
ALTER TABLE market_editions RENAME COLUMN new_place_id TO place_id;

ALTER TABLE market_edition_makers 
    DROP COLUMN market_edition_id CASCADE,
    DROP COLUMN maker_id CASCADE;
ALTER TABLE market_edition_makers RENAME COLUMN new_market_edition_id TO market_edition_id;
ALTER TABLE market_edition_makers RENAME COLUMN new_maker_id TO maker_id;

ALTER TABLE maker_categories_junction 
    DROP COLUMN maker_id CASCADE,
    DROP COLUMN category_id CASCADE;
ALTER TABLE maker_categories_junction RENAME COLUMN new_maker_id TO maker_id;
ALTER TABLE maker_categories_junction RENAME COLUMN new_category_id TO category_id;

-- 5. Verify and add NOT NULL constraints where needed
ALTER TABLE market_editions ALTER COLUMN market_id SET NOT NULL;
ALTER TABLE market_editions ALTER COLUMN place_id SET NOT NULL;
ALTER TABLE market_edition_makers ALTER COLUMN market_edition_id SET NOT NULL;
ALTER TABLE market_edition_makers ALTER COLUMN maker_id SET NOT NULL;
ALTER TABLE maker_categories_junction ALTER COLUMN maker_id SET NOT NULL;
ALTER TABLE maker_categories_junction ALTER COLUMN category_id SET NOT NULL;

-- 6. Add back foreign key constraints
ALTER TABLE market_editions 
    ADD CONSTRAINT market_editions_market_id_fkey FOREIGN KEY (market_id) REFERENCES markets(id),
    ADD CONSTRAINT market_editions_place_id_fkey FOREIGN KEY (place_id) REFERENCES places(id);

ALTER TABLE market_edition_makers 
    ADD CONSTRAINT market_edition_makers_market_edition_id_fkey FOREIGN KEY (market_edition_id) REFERENCES market_editions(id),
    ADD CONSTRAINT market_edition_makers_maker_id_fkey FOREIGN KEY (maker_id) REFERENCES makers(id);

ALTER TABLE maker_categories_junction 
    ADD CONSTRAINT maker_categories_junction_maker_id_fkey FOREIGN KEY (maker_id) REFERENCES makers(id),
    ADD CONSTRAINT maker_categories_junction_category_id_fkey FOREIGN KEY (category_id) REFERENCES maker_categories(id);
