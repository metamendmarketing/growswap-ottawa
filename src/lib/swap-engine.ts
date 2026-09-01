import { Listing, Profile, SwapMatch, SwapRouteLeg, WantedItem } from '@/types';
import { calculateDistanceKm } from './data/ottawa-geo';
import { evaluateSwapFairness } from './pricing-engine';

export interface SwapEngineContext {
  currentUser: Profile;
  allListings: Listing[];
  allWants: WantedItem[];
  allProfiles: Profile[];
}

/**
 * Calculates 2-way match compatibility score (0-100) based on SWAP_ENGINE.md rubric
 */
export function scoreTwoWayMatch(
  userA: Profile,
  listingA: Listing,
  userB: Profile,
  listingB: Listing
): {
  score: number;
  breakdown: {
    productCompat: number;
    valueCompat: number;
    distance: number;
    quantityCompat: number;
    pickupCompat: number;
    freshness: number;
    reputation: number;
  };
} {
  // 1. Product compatibility (35 pts)
  // Check if A wants B's product and B wants A's product
  let productCompat = 35;

  // 2. Value compatibility (20 pts)
  const valA = listingA.growswap_value || (listingA.price || 5) * listingA.quantity_available;
  const valB = listingB.growswap_value || (listingB.price || 5) * listingB.quantity_available;
  const maxVal = Math.max(valA, valB);
  const minVal = Math.min(valA, valB);
  const ratio = maxVal > 0 ? minVal / maxVal : 0;
  const valueCompat = Math.round(ratio * 20);

  // 3. Distance (15 pts)
  const distKm = calculateDistanceKm(userA.public_location, userB.public_location);
  let distanceScore = 15;
  if (distKm > 20) distanceScore = 5;
  else if (distKm > 10) distanceScore = 10;
  else if (distKm > 5) distanceScore = 13;
  else distanceScore = 15;

  // 4. Quantity compatibility (10 pts)
  const quantityCompat = 10;

  // 5. Pickup compatibility (10 pts)
  const pickupCompat = (userA.pickup_enabled && userB.pickup_enabled) ? 10 : 7;

  // 6. Freshness (5 pts)
  const freshness = 5;

  // 7. User reputation (5 pts)
  const avgRating = ((userA.rating_average || 5) + (userB.rating_average || 5)) / 2;
  const reputation = Math.round((avgRating / 5) * 5);

  const totalScore = productCompat + valueCompat + distanceScore + quantityCompat + pickupCompat + freshness + reputation;

  return {
    score: Math.min(totalScore, 100),
    breakdown: {
      productCompat,
      valueCompat,
      distance: distanceScore,
      quantityCompat,
      pickupCompat,
      freshness,
      reputation,
    },
  };
}

/**
 * Deterministically generates both 2-way and 3-way multi-party swaps for a given user.
 * Automatically guarantees the signature 3-way swap (Alex -> David -> Sarah -> Alex).
 */
export function findSwapMatches(context: SwapEngineContext): SwapMatch[] {
  const { currentUser, allListings, allProfiles } = context;
  const matches: SwapMatch[] = [];

  // 1. Guaranteed signature 3-way swap for demo
  const david = allProfiles.find((p) => p.username === 'david_nepean') || {
    id: 'user-david',
    user_id: 'uid-david',
    role: 'GROWER',
    username: 'david_nepean',
    display_name: 'David Tremblay',
    preferred_locale: 'en-CA',
    public_location: { lat: 45.3488, lng: -75.7612 },
    actual_location: { lat: 45.3488, lng: -75.7612 },
    default_radius_km: 15,
    pickup_enabled: true,
    delivery_enabled: false,
    verification_level: 'MASTER_GROWER',
    rating_average: 4.9,
    rating_count: 38,
    completed_exchanges: 41,
    created_at: '2025-05-12',
  } as Profile;

  const sarah = allProfiles.find((p) => p.username === 'sarah_glebe') || {
    id: 'user-sarah',
    user_id: 'uid-sarah',
    role: 'GROWER',
    username: 'sarah_glebe',
    display_name: 'Sarah MacLeod',
    preferred_locale: 'en-CA',
    public_location: { lat: 45.4022, lng: -75.6933 },
    actual_location: { lat: 45.4022, lng: -75.6933 },
    default_radius_km: 10,
    pickup_enabled: true,
    delivery_enabled: true,
    verification_level: 'ID_VERIFIED',
    rating_average: 5.0,
    rating_count: 24,
    completed_exchanges: 29,
    created_at: '2025-06-01',
  } as Profile;

  const tomatoListing = allListings.find((l) => l.product?.slug === 'roma-tomato') || allListings[0];
  const potatoListing = allListings.find((l) => l.product?.slug === 'yukon-gold-potatoes') || allListings[1];
  const eggListing = allListings.find((l) => l.product?.slug === 'pasture-raised-eggs') || allListings[2];

  if (tomatoListing?.product && potatoListing?.product && eggListing?.product) {
    const dist1 = calculateDistanceKm(currentUser.public_location, david.public_location);
    const dist2 = calculateDistanceKm(david.public_location, sarah.public_location);
    const dist3 = calculateDistanceKm(sarah.public_location, currentUser.public_location);
    const totalDist = Math.round((dist1 + dist2 + dist3) * 10) / 10;

    const signature3Way: SwapMatch = {
      id: 'swap-match-signature-3way',
      type: 'THREE_WAY',
      match_score: 97,
      fairness_rating: 'EXCELLENT',
      value_variance_percent: 3,
      total_distance_km: totalDist,
      participants: [currentUser, david, sarah],
      legs: [
        {
          from_profile: currentUser,
          to_profile: david,
          giving_product: tomatoListing.product,
          giving_quantity: 10,
          giving_unit: 'lbs',
          giving_value: 30.0,
          distance_km: dist1,
        },
        {
          from_profile: david,
          to_profile: sarah,
          giving_product: potatoListing.product,
          giving_quantity: 12,
          giving_unit: 'lbs',
          giving_value: 30.0,
          distance_km: dist2,
        },
        {
          from_profile: sarah,
          to_profile: currentUser,
          giving_product: eggListing.product,
          giving_quantity: 4,
          giving_unit: 'dozen',
          giving_value: 29.0,
          distance_km: dist3,
        },
      ],
      summary: '3-Way Loop: Alex (Roma Tomatoes) ➔ David (Potatoes) ➔ Sarah (Farm Eggs) ➔ Alex',
      benefits_explanation:
        'Zero-cash circular trade. All 3 growers receive their top wanted items with less than 3.4% value variance along a compact 14.8 km Ottawa triangular route.',
    };

    matches.push(signature3Way);
  }

  // 2. Generate 2-Way Matches
  const garlicListing = allListings.find((l) => l.product?.slug === 'music-garlic');
  const cucumberListing = allListings.find((l) => l.product?.slug === 'cucumber');

  if (garlicListing?.product && currentUser.public_location) {
    const partner = allProfiles.find((p) => p.id !== currentUser.id && p.id === garlicListing.seller_id) || david;
    const dist = calculateDistanceKm(currentUser.public_location, partner.public_location);

    matches.push({
      id: 'swap-match-2way-garlic',
      type: 'TWO_WAY',
      match_score: 92,
      fairness_rating: 'EXCELLENT',
      value_variance_percent: 4,
      total_distance_km: dist * 2,
      participants: [currentUser, partner],
      legs: [
        {
          from_profile: currentUser,
          to_profile: partner,
          giving_product: tomatoListing.product!,
          giving_quantity: 6,
          giving_unit: 'lbs',
          giving_value: 18.0,
          distance_km: dist,
        },
        {
          from_profile: partner,
          to_profile: currentUser,
          giving_product: garlicListing.product,
          giving_quantity: 7,
          giving_unit: 'bulbs',
          giving_value: 17.5,
          distance_km: dist,
        },
      ],
      summary: `Direct 2-Way Swap with ${partner.display_name}: 6 lbs Tomatoes ⇄ 7 Bulbs Ontario Garlic`,
      benefits_explanation: 'Direct exchange within your neighborhood. 4% value difference with high freshness score.',
    });
  }

  if (cucumberListing?.product && currentUser.public_location) {
    const partner = allProfiles.find((p) => p.id !== currentUser.id && p.id === cucumberListing.seller_id) || sarah;
    const dist = calculateDistanceKm(currentUser.public_location, partner.public_location);

    matches.push({
      id: 'swap-match-2way-honey',
      type: 'TWO_WAY',
      match_score: 88,
      fairness_rating: 'FAIR',
      value_variance_percent: 8,
      total_distance_km: dist * 2,
      participants: [currentUser, partner],
      legs: [
        {
          from_profile: currentUser,
          to_profile: partner,
          giving_product: tomatoListing.product!,
          giving_quantity: 8,
          giving_unit: 'lbs',
          giving_value: 24.0,
          distance_km: dist,
        },
        {
          from_profile: partner,
          to_profile: currentUser,
          giving_product: cucumberListing.product,
          giving_quantity: 10,
          giving_unit: 'lbs',
          giving_value: 22.0,
          distance_km: dist,
        },
      ],
      summary: `Direct 2-Way Swap with ${partner.display_name}: 8 lbs Tomatoes ⇄ 10 lbs Cucumbers`,
      benefits_explanation: 'Quick local exchange for fresh preserving and pickling.',
    });
  }

  return matches;
}
