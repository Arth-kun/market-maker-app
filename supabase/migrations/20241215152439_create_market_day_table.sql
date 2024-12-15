-- Create trigger function if it doesn't exist
create or replace function public.trigger_set_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create market_days table
create table if not exists market_days (
    id uuid default gen_random_uuid() primary key,
    market_edition_id uuid references market_editions(id) not null,
    date date not null,
    start_time time not null,
    end_time time not null,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add RLS policies
alter table market_days enable row level security;

-- Add basic RLS policy for authenticated users
create policy "Authenticated users can view market days"
    on market_days for select
    to authenticated
    using (true);

-- Add indexes
create index if not exists market_days_market_edition_id_idx on market_days(market_edition_id);
create index if not exists market_days_date_idx on market_days(date);

-- Add updated_at trigger
create trigger set_updated_at
    before update on market_days
    for each row
    execute function trigger_set_updated_at();

-- Down migration
-- drop table if exists market_days;
-- drop function if exists trigger_set_updated_at;