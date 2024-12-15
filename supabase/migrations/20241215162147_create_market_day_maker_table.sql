-- Create market_day_makers table
create table if not exists market_day_makers (
    id uuid default gen_random_uuid() primary key,
    market_day_id uuid references market_days(id) not null,
    market_edition_maker_id uuid references market_edition_makers(id) not null,
    sales_total_amount decimal(10,2) default 0,
    sales_count integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table market_day_makers enable row level security;

create policy "Authenticated users can view market day makers"
    on market_day_makers for select
    to authenticated
    using (true);

create policy "Authenticated users can update market day makers"
    on market_day_makers for update
    to authenticated
    using (true)
    with check (true);

-- Add indexes
create index if not exists market_day_makers_market_day_id_idx 
    on market_day_makers(market_day_id);
create index if not exists market_day_makers_market_edition_maker_id_idx 
    on market_day_makers(market_edition_maker_id);

-- Add unique constraint to prevent duplicate entries
create unique index if not exists market_day_makers_unique_idx 
    on market_day_makers(market_day_id, market_edition_maker_id);

-- Add updated_at trigger
create trigger set_updated_at
    before update on market_day_makers
    for each row
    execute function trigger_set_updated_at();

-- Down migration
-- drop table if exists market_day_makers;