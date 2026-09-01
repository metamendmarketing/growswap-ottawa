export type UserRole = 'USER' | 'GROWER' | 'PRO_GROWER' | 'COMMUNITY_ADMIN' | 'PLATFORM_ADMIN';
export type GardenType = 'BACKYARD' | 'COMMUNITY' | 'BALCONY' | 'GREENHOUSE' | 'SMALL_FARM' | 'ORCHARD';
export type ListingType = 'SALE' | 'SWAP' | 'SALE_OR_SWAP' | 'FREE' | 'RESCUE';
export type ListingStatus = 'DRAFT' | 'UPCOMING' | 'AVAILABLE' | 'RESERVED' | 'COMPLETED' | 'EXPIRED' | 'CANCELLED';
export type TransactionType = 'SALE' | 'SWAP' | 'MULTI_SWAP' | 'FREE' | 'RESCUE' | 'DONATION' | 'CREDIT';
export type TransactionStatus = 'PROPOSED' | 'ACCEPTED' | 'SCHEDULED' | 'READY' | 'COMPLETED' | 'CANCELLED' | 'DISPUTED' | 'EXPIRED';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  username: string;
  display_name: string;
  bio?: string;
  avatar_url?: string;
  preferred_locale: 'en-CA' | 'fr-CA';
  postal_code?: string;
  community_id?: string;
  community_name?: string;
  actual_location: Coordinates;
  public_location: Coordinates;
  default_radius_km: number;
  pickup_enabled: boolean;
  delivery_enabled: boolean;
  verification_level: 'UNVERIFIED' | 'EMAIL' | 'ID_VERIFIED' | 'MASTER_GROWER';
  rating_average: number;
  rating_count: number;
  completed_exchanges: number;
  created_at: string;
}

export interface Community {
  id: string;
  name_en: string;
  name_fr: string;
  slug: string;
  type: 'URBAN' | 'SUBURBAN' | 'RURAL';
  ward_number?: number;
  ward_name?: string;
  center: Coordinates;
  bounds?: [number, number][]; // Polygon coordinates
  active_growers_count?: number;
  total_listings_count?: number;
}

export interface CommunityGarden {
  id: string;
  external_source_id?: string;
  name_en: string;
  name_fr?: string;
  location: Coordinates;
  address?: string;
  plots_count?: number;
  open_to_public: boolean;
}

export interface Product {
  id: string;
  slug: string;
  name_en: string;
  name_fr: string;
  category: 'Vegetables' | 'Herbs' | 'Fruits' | 'Eggs & Apiary' | 'Seeds & Starts' | 'Preserves & Sundries';
  default_unit: string;
  emoji: string;
  image_url: string;
  season_start: number; // Month 1-12
  season_peak: number;  // Month 1-12
  season_end: number;   // Month 1-12
  base_price: number;   // Retail benchmark CAD per default_unit
  yield_per_plant?: number; // e.g. lbs per plant
  yield_unit?: string;
  growing_days?: number;
  active: boolean;
  description_en?: string;
  description_fr?: string;
}

export interface ProductVariety {
  id: string;
  product_id: string;
  name: string;
  notes?: string;
}

export interface GardenBed {
  id: string;
  garden_id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  soil_type?: string;
}

export interface Planting {
  id: string;
  garden_id: string;
  bed_id?: string;
  product_id: string;
  product?: Product;
  variety_id?: string;
  variety_name?: string;
  plant_count: number;
  area_sqft: number;
  planting_date: string;
  transplant_date?: string;
  expected_harvest_start: string;
  expected_harvest_end: string;
  yield_low: number;
  yield_expected: number;
  yield_high: number;
  expected_household_use: number;
  expected_surplus: number;
  available_for_sale: boolean;
  available_for_swap: boolean;
  public_visibility: boolean;
  created_at?: string;
}

export interface Garden {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  garden_type: GardenType;
  area_sqft: number;
  sun_exposure: 'FULL_SUN' | 'PARTIAL_SHADE' | 'FULL_SHADE';
  growing_zone: string;
  community_garden_id?: string;
  is_public: boolean;
  photo_url?: string;
  beds?: GardenBed[];
  plantings?: Planting[];
  created_at: string;
}

export interface Listing {
  id: string;
  seller_id: string;
  seller?: Profile;
  garden_id?: string;
  product_id: string;
  product?: Product;
  variety_id?: string;
  variety_name?: string;
  title: string;
  description?: string;
  listing_type: ListingType;
  quantity_available: number;
  unit: string;
  price?: number; // CAD if for sale
  growswap_value?: number; // Calculated dynamic reference value
  harvested_at?: string;
  expected_harvest_at?: string;
  available_from: string;
  available_until: string;
  accepts_swap: boolean;
  open_to_any_swap: boolean;
  wanted_product_ids?: string[]; // specific products wanted in exchange
  pickup_only: boolean;
  delivery_available: boolean;
  public_location: Coordinates;
  community_name?: string;
  status: ListingStatus;
  images?: string[];
  is_rescue?: boolean;
  rescue_urgent_hours?: number;
  created_at: string;
  updated_at: string;
}

export interface WantedItem {
  id: string;
  user_id: string;
  user?: Profile;
  product_id: string;
  product?: Product;
  variety_id?: string;
  desired_quantity: number;
  unit: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  maximum_distance_km: number;
  maximum_price?: number;
  accept_substitutes: boolean;
  notify: boolean;
  active: boolean;
  created_at: string;
}

export interface PriceObservation {
  id: string;
  product_id: string;
  community_id?: string;
  source_type: 'RETAIL_BENCHMARK' | 'LOCAL_LISTING' | 'COMPLETED_SWAP' | 'MARKET_REPORT';
  price: number;
  unit: string;
  normalized_price: number;
  observed_at: string;
}

export interface PriceIndex {
  id: string;
  product_id: string;
  product?: Product;
  community_id?: string;
  index_date: string;
  base_reference: number;
  listing_median: number;
  transaction_median: number;
  supply_index: number;
  demand_index: number;
  seasonality_factor: number;
  calculated_value: number;
  confidence: number;
}

export interface SwapRouteLeg {
  from_profile: Profile;
  to_profile: Profile;
  giving_product: Product;
  giving_quantity: number;
  giving_unit: string;
  giving_value: number;
  distance_km: number;
}

export interface SwapMatch {
  id: string;
  type: 'TWO_WAY' | 'THREE_WAY' | 'FOUR_WAY';
  match_score: number; // 0-100
  fairness_rating: 'EXCELLENT' | 'FAIR' | 'FLEXIBLE' | 'ASYMMETRIC';
  value_variance_percent: number;
  total_distance_km: number;
  participants: Profile[];
  legs: SwapRouteLeg[];
  summary: string;
  benefits_explanation: string;
}

export interface Transaction {
  id: string;
  transaction_type: TransactionType;
  status: TransactionStatus;
  created_by: string;
  total_reference_value: number;
  participants: Profile[];
  items: {
    from_profile_id: string;
    to_profile_id: string;
    product_id: string;
    product?: Product;
    quantity: number;
    unit: string;
    reference_unit_value: number;
    reference_total_value: number;
  }[];
  created_at: string;
  completed_at?: string;
}

export interface GardenPlanRecommendation {
  product_id: string;
  product: Product;
  current_plantings: number;
  recommended_plantings: number;
  change_type: 'INCREASE' | 'DECREASE' | 'MAINTAIN' | 'NEW_CROP';
  projected_local_demand: 'HIGH' | 'MEDIUM' | 'LOW' | 'OVERSUPPLIED';
  expected_surplus_lbs: number;
  estimated_trade_value: number;
  rationale_en: string;
  rationale_fr: string;
}
