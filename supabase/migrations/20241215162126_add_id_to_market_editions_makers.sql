-- First add the id column
ALTER TABLE market_edition_makers 
ADD COLUMN id uuid DEFAULT gen_random_uuid() NOT NULL;

-- Make it the primary key
ALTER TABLE market_edition_makers 
ADD PRIMARY KEY (id);

-- Down migration
-- ALTER TABLE market_edition_makers DROP COLUMN id;