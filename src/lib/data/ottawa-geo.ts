import { Community, CommunityGarden, Coordinates } from '@/types';

// Haversine formula to compute great-circle distance between two points in km
export function calculateDistanceKm(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Earth radius in km
  const dLat = ((coord2.lat - coord1.lat) * Math.PI) / 180;
  const dLon = ((coord2.lng - coord1.lng) * Math.PI) / 180;
  const lat1 = (coord1.lat * Math.PI) / 180;
  const lat2 = (coord2.lat * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

// Obfuscate coordinates with deterministic 300-500m pseudo-random privacy offset
export function obfuscateCoordinates(actual: Coordinates, seed: string = ''): Coordinates {
  // Simple deterministic hash for stable jitter
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const angle = Math.abs(hash % 360) * (Math.PI / 180);
  const radiusKm = 0.35 + (Math.abs(hash % 100) / 100) * 0.25; // 350m - 600m
  
  const dLat = (radiusKm / 111) * Math.cos(angle);
  const dLng = (radiusKm / (111 * Math.cos((actual.lat * Math.PI) / 180))) * Math.sin(angle);

  return {
    lat: Math.round((actual.lat + dLat) * 10000) / 10000,
    lng: Math.round((actual.lng + dLng) * 10000) / 10000,
  };
}

export const OTTAWA_CENTER: Coordinates = { lat: 45.4215, lng: -75.6972 };

export const OTTAWA_COMMUNITIES: Community[] = [
  {
    id: 'comm-centretown',
    name_en: 'Centretown',
    name_fr: 'Centre-ville',
    slug: 'centretown',
    type: 'URBAN',
    ward_number: 14,
    ward_name: 'Somerset',
    center: { lat: 45.4144, lng: -75.6987 },
    active_growers_count: 42,
    total_listings_count: 98,
  },
  {
    id: 'comm-glebe',
    name_en: 'The Glebe',
    name_fr: 'Le Glebe',
    slug: 'the-glebe',
    type: 'URBAN',
    ward_number: 17,
    ward_name: 'Capital',
    center: { lat: 45.4022, lng: -75.6933 },
    active_growers_count: 58,
    total_listings_count: 142,
  },
  {
    id: 'comm-old-ottawa-south',
    name_en: 'Old Ottawa South',
    name_fr: 'Vieil Ottawa-Sud',
    slug: 'old-ottawa-south',
    type: 'URBAN',
    ward_number: 17,
    ward_name: 'Capital',
    center: { lat: 45.3925, lng: -75.6842 },
    active_growers_count: 36,
    total_listings_count: 84,
  },
  {
    id: 'comm-alta-vista',
    name_en: 'Alta Vista',
    name_fr: 'Alta Vista',
    slug: 'alta-vista',
    type: 'SUBURBAN',
    ward_number: 18,
    ward_name: 'Alta Vista',
    center: { lat: 45.3855, lng: -75.6578 },
    active_growers_count: 49,
    total_listings_count: 115,
  },
  {
    id: 'comm-nepean',
    name_en: 'Nepean (Centrepointe & Crestview)',
    name_fr: 'Nepean',
    slug: 'nepean',
    type: 'SUBURBAN',
    ward_number: 8,
    ward_name: 'College',
    center: { lat: 45.3488, lng: -75.7612 },
    active_growers_count: 64,
    total_listings_count: 168,
  },
  {
    id: 'comm-bells-corners',
    name_en: 'Bells Corners',
    name_fr: 'Bells Corners',
    slug: 'bells-corners',
    type: 'SUBURBAN',
    ward_number: 8,
    ward_name: 'College',
    center: { lat: 45.3283, lng: -75.8239 },
    active_growers_count: 28,
    total_listings_count: 67,
  },
  {
    id: 'comm-barrhaven',
    name_en: 'Barrhaven',
    name_fr: 'Barrhaven',
    slug: 'barrhaven',
    type: 'SUBURBAN',
    ward_number: 3,
    ward_name: 'Barrhaven West',
    center: { lat: 45.2725, lng: -75.7483 },
    active_growers_count: 72,
    total_listings_count: 210,
  },
  {
    id: 'comm-kanata',
    name_en: 'Kanata (Beaverbrook & Lakes)',
    name_fr: 'Kanata',
    slug: 'kanata',
    type: 'SUBURBAN',
    ward_number: 4,
    ward_name: 'Kanata North',
    center: { lat: 45.3375, lng: -75.9022 },
    active_growers_count: 67,
    total_listings_count: 185,
  },
  {
    id: 'comm-stittsville',
    name_en: 'Stittsville',
    name_fr: 'Stittsville',
    slug: 'stittsville',
    type: 'SUBURBAN',
    ward_number: 6,
    ward_name: 'Stittsville',
    center: { lat: 45.2592, lng: -75.9228 },
    active_growers_count: 45,
    total_listings_count: 112,
  },
  {
    id: 'comm-carp',
    name_en: 'Carp & West Carleton',
    name_fr: 'Carp et Carleton-Ouest',
    slug: 'carp',
    type: 'RURAL',
    ward_number: 5,
    ward_name: 'West Carleton-March',
    center: { lat: 45.3528, lng: -76.0378 },
    active_growers_count: 31,
    total_listings_count: 95,
  },
  {
    id: 'comm-richmond',
    name_en: 'Richmond',
    name_fr: 'Richmond',
    slug: 'richmond',
    type: 'RURAL',
    ward_number: 21,
    ward_name: 'Rideau-Jock',
    center: { lat: 45.1878, lng: -75.8364 },
    active_growers_count: 24,
    total_listings_count: 78,
  },
  {
    id: 'comm-manotick',
    name_en: 'Manotick',
    name_fr: 'Manotick',
    slug: 'manotick',
    type: 'RURAL',
    ward_number: 21,
    ward_name: 'Rideau-Jock',
    center: { lat: 45.2267, lng: -75.6811 },
    active_growers_count: 38,
    total_listings_count: 104,
  },
  {
    id: 'comm-greely',
    name_en: 'Greely',
    name_fr: 'Greely',
    slug: 'greely',
    type: 'RURAL',
    ward_number: 20,
    ward_name: 'Osgoode',
    center: { lat: 45.2589, lng: -75.5786 },
    active_growers_count: 22,
    total_listings_count: 65,
  },
  {
    id: 'comm-osgoode',
    name_en: 'Osgoode',
    name_fr: 'Osgoode',
    slug: 'osgoode',
    type: 'RURAL',
    ward_number: 20,
    ward_name: 'Osgoode',
    center: { lat: 45.1458, lng: -75.6028 },
    active_growers_count: 19,
    total_listings_count: 52,
  },
  {
    id: 'comm-gloucester',
    name_en: 'Gloucester / Beacon Hill',
    name_fr: 'Gloucester',
    slug: 'gloucester',
    type: 'SUBURBAN',
    ward_number: 11,
    ward_name: 'Beacon Hill-Cyrville',
    center: { lat: 45.4389, lng: -75.6014 },
    active_growers_count: 53,
    total_listings_count: 130,
  },
  {
    id: 'comm-orleans',
    name_en: 'Orléans (Avalon & Convent Glen)',
    name_fr: 'Orléans',
    slug: 'orleans',
    type: 'SUBURBAN',
    ward_number: 1,
    ward_name: 'Orléans East-Cumberland',
    center: { lat: 45.4628, lng: -75.5211 },
    active_growers_count: 78,
    total_listings_count: 224,
  },
  {
    id: 'comm-cumberland',
    name_en: 'Cumberland & Navan',
    name_fr: 'Cumberland et Navan',
    slug: 'cumberland',
    type: 'RURAL',
    ward_number: 19,
    ward_name: 'Orléans South-Navan',
    center: { lat: 45.4217, lng: -75.4128 },
    active_growers_count: 27,
    total_listings_count: 86,
  },
];

export const OTTAWA_COMMUNITY_GARDENS: CommunityGarden[] = [
  {
    id: 'cg-brewer',
    name_en: 'Brewer Park Community Garden',
    name_fr: 'Jardin communautaire du parc Brewer',
    location: { lat: 45.3891, lng: -75.6944 },
    address: '100 Brewer Way, Old Ottawa South',
    plots_count: 48,
    open_to_public: true,
  },
  {
    id: 'cg-kilborn',
    name_en: 'Kilborn Allotment & Community Garden',
    name_fr: 'Jardins partagés Kilborn',
    location: { lat: 45.3842, lng: -75.6612 },
    address: '1500 Kilborn Ave, Alta Vista',
    plots_count: 92,
    open_to_public: true,
  },
  {
    id: 'cg-main',
    name_en: 'Main Street Community Garden',
    name_fr: 'Jardin communautaire de la rue Main',
    location: { lat: 45.4056, lng: -75.6812 },
    address: '150 Main St, Old Ottawa East',
    plots_count: 36,
    open_to_public: true,
  },
  {
    id: 'cg-nault',
    name_en: 'Nault Park Community Garden',
    name_fr: 'Jardin communautaire du parc Nault',
    location: { lat: 45.4411, lng: -75.6517 },
    address: '325 St. Denis St, Vanier',
    plots_count: 40,
    open_to_public: true,
  },
  {
    id: 'cg-centrepoint',
    name_en: 'Centrepointe Community Garden',
    name_fr: 'Jardin communautaire de Centrepointe',
    location: { lat: 45.3472, lng: -75.7661 },
    address: '260 Centrepointe Dr, Nepean',
    plots_count: 55,
    open_to_public: true,
  },
  {
    id: 'cg-beaverbrook',
    name_en: 'Beaverbrook Community Garden',
    name_fr: 'Jardin communautaire Beaverbrook',
    location: { lat: 45.3341, lng: -75.9088 },
    address: '2 The Parkway, Kanata',
    plots_count: 60,
    open_to_public: true,
  },
  {
    id: 'cg-orleans',
    name_en: 'Centennial Park Community Garden',
    name_fr: 'Jardin communautaire du parc Centennial',
    location: { lat: 45.4678, lng: -75.5342 },
    address: '2884 St Joseph Blvd, Orléans',
    plots_count: 50,
    open_to_public: true,
  },
];
