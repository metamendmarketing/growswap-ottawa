import { Garden, Listing, Planting, Profile, Transaction, WantedItem } from '@/types';
import { calculateDistanceKm, obfuscateCoordinates, OTTAWA_COMMUNITIES } from './ottawa-geo';
import { SEED_PRODUCTS } from './seed-products';

// Default Demo User: Alex
export const DEMO_USER_PROFILE: Profile = {
  id: 'user-alex',
  user_id: 'uid-alex-demo',
  role: 'GROWER',
  username: 'alex_ottawa',
  display_name: 'Alex Mercer',
  bio: 'Backyard organic gardener in Ottawa South. Passionate about heirloom tomatoes, companion planting, and local food security.',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  preferred_locale: 'en-CA',
  postal_code: 'K1S 3M8',
  community_id: 'comm-old-ottawa-south',
  community_name: 'Old Ottawa South',
  actual_location: { lat: 45.3925, lng: -75.6842 },
  public_location: { lat: 45.3941, lng: -75.6865 },
  default_radius_km: 15,
  pickup_enabled: true,
  delivery_enabled: false,
  verification_level: 'MASTER_GROWER',
  rating_average: 4.95,
  rating_count: 52,
  completed_exchanges: 64,
  created_at: '2024-04-10T12:00:00Z',
};

export const DEMO_USER_GARDEN: Garden = {
  id: 'garden-alex',
  owner_id: 'user-alex',
  name: "Alex's Sunny Ottawa South Garden",
  description: '600 sq ft raised bed backyard garden featuring drip irrigation, compost-enriched soil, and pollinator borders.',
  garden_type: 'BACKYARD',
  area_sqft: 600,
  sun_exposure: 'FULL_SUN',
  growing_zone: 'Zone 5a',
  is_public: true,
  photo_url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&auto=format&fit=crop&q=80',
  beds: [
    { id: 'bed-1', garden_id: 'garden-alex', name: 'Bed A — Tomato Trellis', x: 0, y: 0, width: 4, height: 16, soil_type: 'Compost Mix' },
    { id: 'bed-2', garden_id: 'garden-alex', name: 'Bed B — Summer Squash & Cucumbers', x: 6, y: 0, width: 4, height: 16, soil_type: 'Living Soil' },
    { id: 'bed-3', garden_id: 'garden-alex', name: 'Bed C — Herb Spiral & Peppers', x: 12, y: 0, width: 4, height: 12, soil_type: 'Loam' },
    { id: 'bed-4', garden_id: 'garden-alex', name: 'Bed D — Greens & Roots', x: 18, y: 0, width: 4, height: 12, soil_type: 'Sandy Loam' },
  ],
  plantings: [],
  created_at: '2024-04-15T10:00:00Z',
};

// Key Demo Participants for the Guaranteed 3-Way Cycle
export const DEMO_DAVID_PROFILE: Profile = {
  id: 'user-david',
  user_id: 'uid-david',
  role: 'GROWER',
  username: 'david_nepean',
  display_name: 'David Tremblay',
  bio: 'Centrepointe potato and root crop grower with a 1,200 sq ft suburban lot.',
  avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  preferred_locale: 'en-CA',
  postal_code: 'K2G 1N4',
  community_id: 'comm-nepean',
  community_name: 'Nepean',
  actual_location: { lat: 45.3488, lng: -75.7612 },
  public_location: { lat: 45.3512, lng: -75.7589 },
  default_radius_km: 15,
  pickup_enabled: true,
  delivery_enabled: false,
  verification_level: 'MASTER_GROWER',
  rating_average: 4.9,
  rating_count: 38,
  completed_exchanges: 41,
  created_at: '2025-05-12T08:00:00Z',
};

export const DEMO_SARAH_PROFILE: Profile = {
  id: 'user-sarah',
  user_id: 'uid-sarah',
  role: 'GROWER',
  username: 'sarah_glebe',
  display_name: 'Sarah MacLeod',
  bio: 'Urban micro-homesteader in The Glebe with 4 heritage laying hens and cold frames.',
  avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  preferred_locale: 'en-CA',
  postal_code: 'K1S 2Y8',
  community_id: 'comm-glebe',
  community_name: 'The Glebe',
  actual_location: { lat: 45.4022, lng: -75.6933 },
  public_location: { lat: 45.4045, lng: -75.6912 },
  default_radius_km: 10,
  pickup_enabled: true,
  delivery_enabled: true,
  verification_level: 'ID_VERIFIED',
  rating_average: 5.0,
  rating_count: 24,
  completed_exchanges: 29,
  created_at: '2025-06-01T09:00:00Z',
};

const FIRST_NAMES = ['Liam', 'Emma', 'Noah', 'Olivia', 'Ethan', 'Sophie', 'Lucas', 'Chloe', 'Gabriel', 'Zoe', 'Benjamin', 'Mia', 'Leo', 'Charlotte', 'Mason', 'Amelia', 'Oliver', 'Harper', 'Elijah', 'Evelyn', 'Mathieu', 'Camille', 'Julien', 'Élise', 'Marc', 'Audrey'];
const LAST_NAMES = ['Bouchard', 'Roy', 'Tremblay', 'Gagnon', 'Wilson', 'MacDonald', 'Smith', 'Taylor', 'Lavoie', 'Fortin', 'Côté', 'Campbell', 'Stewart', 'Brown', 'Morin', 'Pelletier', 'Belanger', 'Leblanc'];

export function generateSeedData(): {
  profiles: Profile[];
  gardens: Garden[];
  plantings: Planting[];
  listings: Listing[];
  wants: WantedItem[];
  transactions: Transaction[];
} {
  const profiles: Profile[] = [DEMO_USER_PROFILE, DEMO_DAVID_PROFILE, DEMO_SARAH_PROFILE];
  const listings: Listing[] = [];
  const wants: WantedItem[] = [];
  const gardens: Garden[] = [DEMO_USER_GARDEN];
  const plantings: Planting[] = [];
  const transactions: Transaction[] = [];

  // 1. Seed Alex's Plantings
  const romaTomato = SEED_PRODUCTS.find((p) => p.slug === 'roma-tomato')!;
  const zucchini = SEED_PRODUCTS.find((p) => p.slug === 'zucchini')!;
  const basil = SEED_PRODUCTS.find((p) => p.slug === 'genovese-basil')!;
  const cucumber = SEED_PRODUCTS.find((p) => p.slug === 'cucumber')!;
  const garlic = SEED_PRODUCTS.find((p) => p.slug === 'music-garlic')!;
  const potato = SEED_PRODUCTS.find((p) => p.slug === 'yukon-gold-potatoes')!;
  const eggs = SEED_PRODUCTS.find((p) => p.slug === 'pasture-raised-eggs')!;
  const honey = SEED_PRODUCTS.find((p) => p.slug === 'wildflower-raw-honey')!;
  const apples = SEED_PRODUCTS.find((p) => p.slug === 'honeycrisp-apples')!;

  const alexPlantings: Planting[] = [
    {
      id: 'plant-alex-1',
      garden_id: 'garden-alex',
      bed_id: 'bed-1',
      product_id: romaTomato.id,
      product: romaTomato,
      plant_count: 6,
      area_sqft: 48,
      planting_date: '2026-05-20',
      expected_harvest_start: '2026-08-01',
      expected_harvest_end: '2026-09-30',
      yield_low: 60,
      yield_expected: 72,
      yield_high: 85,
      expected_household_use: 25,
      expected_surplus: 47,
      available_for_sale: true,
      available_for_swap: true,
      public_visibility: true,
    },
    {
      id: 'plant-alex-2',
      garden_id: 'garden-alex',
      bed_id: 'bed-2',
      product_id: zucchini.id,
      product: zucchini,
      plant_count: 4,
      area_sqft: 36,
      planting_date: '2026-05-25',
      expected_harvest_start: '2026-07-15',
      expected_harvest_end: '2026-09-15',
      yield_low: 50,
      yield_expected: 68,
      yield_high: 80,
      expected_household_use: 20,
      expected_surplus: 48,
      available_for_sale: false,
      available_for_swap: true,
      public_visibility: true,
    },
    {
      id: 'plant-alex-3',
      garden_id: 'garden-alex',
      bed_id: 'bed-3',
      product_id: basil.id,
      product: basil,
      plant_count: 8,
      area_sqft: 16,
      planting_date: '2026-05-22',
      expected_harvest_start: '2026-06-25',
      expected_harvest_end: '2026-09-20',
      yield_low: 20,
      yield_expected: 32,
      yield_high: 40,
      expected_household_use: 12,
      expected_surplus: 20,
      available_for_sale: true,
      available_for_swap: true,
      public_visibility: true,
    },
    {
      id: 'plant-alex-4',
      garden_id: 'garden-alex',
      bed_id: 'bed-2',
      product_id: cucumber.id,
      product: cucumber,
      plant_count: 4,
      area_sqft: 24,
      planting_date: '2026-05-28',
      expected_harvest_start: '2026-07-20',
      expected_harvest_end: '2026-09-10',
      yield_low: 30,
      yield_expected: 40,
      yield_high: 50,
      expected_household_use: 15,
      expected_surplus: 25,
      available_for_sale: true,
      available_for_swap: true,
      public_visibility: true,
    },
  ];

  DEMO_USER_GARDEN.plantings = alexPlantings;
  plantings.push(...alexPlantings);

  // 2. Seed Alex's Active Listings & Wants
  listings.push({
    id: 'listing-alex-tomatoes',
    seller_id: DEMO_USER_PROFILE.id,
    seller: DEMO_USER_PROFILE,
    garden_id: DEMO_USER_GARDEN.id,
    product_id: romaTomato.id,
    product: romaTomato,
    title: '10 lb Freshly Picked Organic Roma Paste Tomatoes',
    description: 'Vine-ripened, dense and meaty. Picked this morning in Old Ottawa South. Perfect for sauce and canning.',
    listing_type: 'SALE_OR_SWAP',
    quantity_available: 10,
    unit: 'lb',
    price: 3.00,
    growswap_value: 30.00,
    harvested_at: '2026-08-24T07:30:00Z',
    available_from: '2026-08-24T08:00:00Z',
    available_until: '2026-08-27T18:00:00Z',
    accepts_swap: true,
    open_to_any_swap: false,
    wanted_product_ids: [eggs.id, garlic.id, potato.id],
    pickup_only: true,
    delivery_available: false,
    public_location: DEMO_USER_PROFILE.public_location,
    community_name: 'Old Ottawa South',
    status: 'AVAILABLE',
    images: [romaTomato.image_url],
    created_at: '2026-08-24T07:45:00Z',
    updated_at: '2026-08-24T07:45:00Z',
  });

  listings.push({
    id: 'listing-alex-zucchini',
    seller_id: DEMO_USER_PROFILE.id,
    seller: DEMO_USER_PROFILE,
    product_id: zucchini.id,
    product: zucchini,
    title: 'Tender Garden Zucchini (6-8 inch)',
    description: 'Crisp green zucchini picked at prime tenderness. Great for ratatouille or quick breads.',
    listing_type: 'SWAP',
    quantity_available: 8,
    unit: 'lb',
    price: 1.80,
    growswap_value: 14.40,
    harvested_at: '2026-08-23T16:00:00Z',
    available_from: '2026-08-23T16:00:00Z',
    available_until: '2026-08-26T18:00:00Z',
    accepts_swap: true,
    open_to_any_swap: true,
    pickup_only: true,
    delivery_available: false,
    public_location: DEMO_USER_PROFILE.public_location,
    community_name: 'Old Ottawa South',
    status: 'AVAILABLE',
    images: [zucchini.image_url],
    created_at: '2026-08-23T16:00:00Z',
    updated_at: '2026-08-23T16:00:00Z',
  });

  // Alex's Wants
  wants.push(
    {
      id: 'want-alex-eggs',
      user_id: DEMO_USER_PROFILE.id,
      product_id: eggs.id,
      product: eggs,
      desired_quantity: 2,
      unit: 'dozen',
      priority: 'HIGH',
      maximum_distance_km: 15,
      accept_substitutes: false,
      notify: true,
      active: true,
      created_at: '2026-08-15T12:00:00Z',
    },
    {
      id: 'want-alex-potatoes',
      user_id: DEMO_USER_PROFILE.id,
      product_id: potato.id,
      product: potato,
      desired_quantity: 10,
      unit: 'lb',
      priority: 'NORMAL',
      maximum_distance_km: 15,
      accept_substitutes: true,
      notify: true,
      active: true,
      created_at: '2026-08-18T10:00:00Z',
    },
    {
      id: 'want-alex-garlic',
      user_id: DEMO_USER_PROFILE.id,
      product_id: garlic.id,
      product: garlic,
      desired_quantity: 8,
      unit: 'bulb',
      priority: 'HIGH',
      maximum_distance_km: 15,
      accept_substitutes: true,
      notify: true,
      active: true,
      created_at: '2026-08-10T14:00:00Z',
    }
  );

  // 3. Seed David's Listings (Nepean) & Wants
  listings.push({
    id: 'listing-david-potatoes',
    seller_id: DEMO_DAVID_PROFILE.id,
    seller: DEMO_DAVID_PROFILE,
    product_id: potato.id,
    product: potato,
    title: '12 lb Yukon Gold Freshly Dug Garden Potatoes',
    description: 'Tender thin-skinned new potatoes dug yesterday afternoon in Centrepointe.',
    listing_type: 'SWAP',
    quantity_available: 12,
    unit: 'lb',
    price: 2.50,
    growswap_value: 30.00,
    harvested_at: '2026-08-23T15:00:00Z',
    available_from: '2026-08-23T15:00:00Z',
    available_until: '2026-08-28T18:00:00Z',
    accepts_swap: true,
    open_to_any_swap: false,
    wanted_product_ids: [romaTomato.id],
    pickup_only: true,
    delivery_available: false,
    public_location: DEMO_DAVID_PROFILE.public_location,
    community_name: 'Nepean',
    status: 'AVAILABLE',
    images: [potato.image_url],
    created_at: '2026-08-23T15:00:00Z',
    updated_at: '2026-08-23T15:00:00Z',
  });

  wants.push({
    id: 'want-david-tomatoes',
    user_id: DEMO_DAVID_PROFILE.id,
    product_id: romaTomato.id,
    product: romaTomato,
    desired_quantity: 10,
    unit: 'lb',
    priority: 'HIGH',
    maximum_distance_km: 20,
    accept_substitutes: false,
    notify: true,
    active: true,
    created_at: '2026-08-20T09:00:00Z',
  });

  // 4. Seed Sarah's Listings (The Glebe) & Wants
  listings.push({
    id: 'listing-sarah-eggs',
    seller_id: DEMO_SARAH_PROFILE.id,
    seller: DEMO_SARAH_PROFILE,
    product_id: eggs.id,
    product: eggs,
    title: '4 Dozen Pasture-Raised Heritage Hen Eggs',
    description: 'Laid fresh this weekend by our free-roaming Glebe heritage flock. Rich golden yolks.',
    listing_type: 'SWAP',
    quantity_available: 4,
    unit: 'dozen',
    price: 6.50,
    growswap_value: 26.00,
    harvested_at: '2026-08-24T06:00:00Z',
    available_from: '2026-08-24T06:00:00Z',
    available_until: '2026-08-29T18:00:00Z',
    accepts_swap: true,
    open_to_any_swap: false,
    wanted_product_ids: [potato.id],
    pickup_only: true,
    delivery_available: true,
    public_location: DEMO_SARAH_PROFILE.public_location,
    community_name: 'The Glebe',
    status: 'AVAILABLE',
    images: [eggs.image_url],
    created_at: '2026-08-24T06:30:00Z',
    updated_at: '2026-08-24T06:30:00Z',
  });

  wants.push({
    id: 'want-sarah-potatoes',
    user_id: DEMO_SARAH_PROFILE.id,
    product_id: potato.id,
    product: potato,
    desired_quantity: 12,
    unit: 'lb',
    priority: 'HIGH',
    maximum_distance_km: 15,
    accept_substitutes: true,
    notify: true,
    active: true,
    created_at: '2026-08-21T11:00:00Z',
  });

  // 5. Generate 497 simulated growers across Ottawa communities
  let growerIndex = 4;
  for (const community of OTTAWA_COMMUNITIES) {
    const targetCount = community.active_growers_count || 30;

    for (let i = 0; i < targetCount; i++) {
      const fName = FIRST_NAMES[(growerIndex + i * 3) % FIRST_NAMES.length];
      const lName = LAST_NAMES[(growerIndex + i * 5) % LAST_NAMES.length];
      const username = `${fName.toLowerCase()}_${community.slug}_${i + 1}`;
      const isMaster = i % 8 === 0;

      // Deterministic offset around community center
      const angle = ((i * 37) % 360) * (Math.PI / 180);
      const distKm = 0.2 + ((i * 13) % 40) / 10;
      const latOffset = (distKm / 111) * Math.cos(angle);
      const lngOffset = (distKm / (111 * Math.cos((community.center.lat * Math.PI) / 180))) * Math.sin(angle);

      const actualLoc = {
        lat: Math.round((community.center.lat + latOffset) * 10000) / 10000,
        lng: Math.round((community.center.lng + lngOffset) * 10000) / 10000,
      };
      const pubLoc = obfuscateCoordinates(actualLoc, username);

      const profile: Profile = {
        id: `user-${growerIndex}`,
        user_id: `uid-${growerIndex}`,
        role: isMaster ? 'PRO_GROWER' : 'GROWER',
        username,
        display_name: `${fName} ${lName}`,
        bio: `${community.name_en} gardener. Growing seasonal staples, sharing with neighbours.`,
        preferred_locale: (growerIndex % 5 === 0) ? 'fr-CA' : 'en-CA',
        community_id: community.id,
        community_name: community.name_en,
        actual_location: actualLoc,
        public_location: pubLoc,
        default_radius_km: 10 + (growerIndex % 15),
        pickup_enabled: true,
        delivery_enabled: growerIndex % 4 === 0,
        verification_level: isMaster ? 'MASTER_GROWER' : (growerIndex % 3 === 0 ? 'ID_VERIFIED' : 'EMAIL'),
        rating_average: Math.round((4.6 + ((growerIndex % 5) / 10)) * 10) / 10,
        rating_count: 5 + (growerIndex % 40),
        completed_exchanges: 8 + (growerIndex % 35),
        created_at: '2025-04-01T12:00:00Z',
      };
      profiles.push(profile);

      // Generate 2-4 listings per grower
      const listingCount = 2 + (growerIndex % 3);
      for (let l = 0; l < listingCount; l++) {
        const prod = SEED_PRODUCTS[(growerIndex + l * 4) % SEED_PRODUCTS.length];
        const isRescue = prod.slug === 'zucchini' || prod.slug === 'honeycrisp-apples' || (growerIndex % 11 === 0);
        const lType = isRescue ? 'RESCUE' : (l % 3 === 0 ? 'SWAP' : (l % 3 === 1 ? 'SALE_OR_SWAP' : 'SALE'));
        const qty = (prod.category === 'Vegetables' ? 5 + (l * 4) : 2 + l);
        const price = prod.base_price;
        const totalVal = Math.round(qty * price * 100) / 100;

        listings.push({
          id: `listing-${growerIndex}-${l}`,
          seller_id: profile.id,
          seller: profile,
          product_id: prod.id,
          product: prod,
          title: `${qty} ${prod.default_unit} ${prod.name_en}`,
          description: `Freshly harvested in ${community.name_en}. Grown with organic methods, available for pickup.`,
          listing_type: lType,
          quantity_available: qty,
          unit: prod.default_unit,
          price: isRescue ? 0 : price,
          growswap_value: totalVal,
          harvested_at: '2026-08-24T08:00:00Z',
          available_from: '2026-08-24T08:00:00Z',
          available_until: '2026-08-28T18:00:00Z',
          accepts_swap: lType === 'SWAP' || lType === 'SALE_OR_SWAP',
          open_to_any_swap: l % 2 === 0,
          pickup_only: true,
          delivery_available: profile.delivery_enabled,
          public_location: profile.public_location,
          community_name: community.name_en,
          status: 'AVAILABLE',
          images: [prod.image_url],
          is_rescue: isRescue,
          rescue_urgent_hours: isRescue ? 36 : undefined,
          created_at: '2026-08-24T08:00:00Z',
          updated_at: '2026-08-24T08:00:00Z',
        });
      }

      // Generate 1-2 wants per grower
      const wantProd = SEED_PRODUCTS[(growerIndex + 7) % SEED_PRODUCTS.length];
      wants.push({
        id: `want-${growerIndex}-1`,
        user_id: profile.id,
        product_id: wantProd.id,
        product: wantProd,
        desired_quantity: 6,
        unit: wantProd.default_unit,
        priority: 'NORMAL',
        maximum_distance_km: profile.default_radius_km,
        accept_substitutes: true,
        notify: true,
        active: true,
        created_at: '2026-08-20T10:00:00Z',
      });

      growerIndex++;
    }
  }

  return { profiles, gardens, plantings, listings, wants, transactions };
}
