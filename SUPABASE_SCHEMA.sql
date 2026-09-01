-- GrowSwap Ottawa starter schema
create extension if not exists postgis;
create extension if not exists pgcrypto;

create type user_role as enum ('USER','GROWER','PRO_GROWER','COMMUNITY_ADMIN','PLATFORM_ADMIN');
create type garden_type as enum ('BACKYARD','COMMUNITY','BALCONY','GREENHOUSE','SMALL_FARM','ORCHARD');
create type listing_type as enum ('SALE','SWAP','SALE_OR_SWAP','FREE','RESCUE');
create type listing_status as enum ('DRAFT','UPCOMING','AVAILABLE','RESERVED','COMPLETED','EXPIRED','CANCELLED');
create type transaction_type as enum ('SALE','SWAP','MULTI_SWAP','FREE','RESCUE','DONATION','CREDIT');
create type transaction_status as enum ('PROPOSED','ACCEPTED','SCHEDULED','READY','COMPLETED','CANCELLED','DISPUTED','EXPIRED');

create table profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null,
  role user_role not null default 'USER',
  username text unique not null,
  display_name text not null,
  bio text,
  avatar_url text,
  preferred_locale text not null default 'en-CA',
  postal_code text,
  actual_location geography(point,4326),
  public_location geography(point,4326),
  default_radius_km numeric not null default 10,
  pickup_enabled boolean not null default true,
  delivery_enabled boolean not null default false,
  verification_level text default 'EMAIL',
  rating_average numeric default 0,
  rating_count integer default 0,
  completed_exchanges integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table communities (
  id uuid primary key default gen_random_uuid(),
  name_en text not null,
  name_fr text,
  slug text unique not null,
  type text not null,
  polygon geometry(multipolygon,4326),
  centroid geometry(point,4326),
  created_at timestamptz not null default now()
);

create table community_gardens (
  id uuid primary key default gen_random_uuid(),
  external_source_id text,
  name_en text not null,
  name_fr text,
  location geography(point,4326) not null,
  source text,
  source_updated_at timestamptz,
  created_at timestamptz not null default now()
);

create table products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_fr text,
  category text not null,
  default_unit text not null,
  emoji text,
  image_url text,
  season_start smallint,
  season_peak smallint,
  season_end smallint,
  base_price numeric,
  yield_unit text,
  active boolean not null default true
);

create table product_varieties (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  name text not null,
  unique(product_id,name)
);

create table gardens (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references profiles(id) on delete cascade,
  name text not null,
  description text,
  garden_type garden_type not null,
  area_sqft numeric,
  sun_exposure text,
  growing_zone text,
  community_garden_id uuid references community_gardens(id),
  is_public boolean not null default true,
  photo_url text,
  created_at timestamptz not null default now()
);

create table garden_beds (
  id uuid primary key default gen_random_uuid(),
  garden_id uuid not null references gardens(id) on delete cascade,
  name text not null,
  x numeric,
  y numeric,
  width numeric,
  height numeric,
  created_at timestamptz not null default now()
);

create table plantings (
  id uuid primary key default gen_random_uuid(),
  garden_id uuid not null references gardens(id) on delete cascade,
  bed_id uuid references garden_beds(id) on delete set null,
  product_id uuid not null references products(id),
  variety_id uuid references product_varieties(id),
  plant_count integer,
  area_sqft numeric,
  planting_date date,
  transplant_date date,
  expected_harvest_start date,
  expected_harvest_end date,
  yield_low numeric,
  yield_expected numeric,
  yield_high numeric,
  expected_household_use numeric,
  expected_surplus numeric,
  available_for_sale boolean default false,
  available_for_swap boolean default false,
  public_visibility boolean default true,
  created_at timestamptz not null default now()
);

create table listings (
  id uuid primary key default gen_random_uuid(),
  seller_id uuid not null references profiles(id) on delete cascade,
  garden_id uuid references gardens(id) on delete set null,
  product_id uuid not null references products(id),
  variety_id uuid references product_varieties(id),
  title text not null,
  description text,
  listing_type listing_type not null,
  quantity_available numeric not null,
  unit text not null,
  price numeric,
  harvested_at timestamptz,
  expected_harvest_at timestamptz,
  available_from timestamptz,
  available_until timestamptz,
  accepts_swap boolean not null default false,
  open_to_any_swap boolean not null default false,
  pickup_only boolean not null default true,
  delivery_available boolean not null default false,
  public_location geography(point,4326),
  status listing_status not null default 'AVAILABLE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table wanted_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  product_id uuid not null references products(id),
  variety_id uuid references product_varieties(id),
  desired_quantity numeric,
  unit text,
  priority text default 'NORMAL',
  maximum_distance_km numeric default 10,
  maximum_price numeric,
  accept_substitutes boolean default true,
  notify boolean default true,
  active boolean default true,
  created_at timestamptz not null default now()
);

create table price_observations (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id),
  community_id uuid references communities(id),
  source_type text not null,
  price numeric not null,
  unit text not null,
  normalized_price numeric not null,
  observed_at timestamptz not null default now()
);

create table price_indices (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id),
  community_id uuid references communities(id),
  index_date date not null,
  base_reference numeric,
  listing_median numeric,
  transaction_median numeric,
  supply_index numeric,
  demand_index numeric,
  seasonality_factor numeric,
  calculated_value numeric not null,
  confidence numeric,
  unique(product_id,community_id,index_date)
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  transaction_type transaction_type not null,
  status transaction_status not null default 'PROPOSED',
  created_by uuid references profiles(id),
  total_reference_value numeric,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table transaction_participants (
  transaction_id uuid not null references transactions(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  primary key(transaction_id,profile_id)
);

create table transaction_items (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid not null references transactions(id) on delete cascade,
  from_profile_id uuid references profiles(id),
  to_profile_id uuid references profiles(id),
  product_id uuid not null references products(id),
  quantity numeric not null,
  unit text not null,
  reference_unit_value numeric,
  reference_total_value numeric
);

create index profiles_actual_location_idx on profiles using gist(actual_location);
create index profiles_public_location_idx on profiles using gist(public_location);
create index listings_public_location_idx on listings using gist(public_location);
create index communities_polygon_idx on communities using gist(polygon);
