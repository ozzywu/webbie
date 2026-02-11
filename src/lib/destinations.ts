export interface Destination {
  id: number;
  city: string;
  country: string;
  keyword: string;
  coords: string;
  lat: number;
  lng: number;
  date: string;
  description: string;
  elevation: string;
  duration: string;
}

// Your travel destinations - edit this to add/remove places
export const destinations: Destination[] = [
  {
    id: 1, city: "Dubai", country: "UAE", keyword: "Excess",
    coords: "25.2048° N, 55.2708° E", lat: 25.2048, lng: 55.2708,
    date: "DEC 10", description: "Where the desert meets the future. Gold-dusted skylines and spice-scented souks.",
    elevation: "5m", duration: "5 DAYS",
  },
  {
    id: 2, city: "Hong Kong", country: "China", keyword: "Density",
    coords: "22.3193° N, 114.1694° E", lat: 22.3193, lng: 114.1694,
    date: "FEB 05", description: "獅子山下。Where the mountains meet the sea and dim sum is a way of life.",
    elevation: "32m", duration: "10 DAYS",
  },
  {
    id: 3, city: "Niseko", country: "Japan", keyword: "Powder",
    coords: "42.8048° N, 140.6874° E", lat: 42.8048, lng: 140.6874,
    date: "JAN 15", description: "Powder paradise. Where the snow whispers and the onsens steam at dusk.",
    elevation: "240m", duration: "7 DAYS",
  },
  {
    id: 4, city: "Milan", country: "Italy", keyword: "Craft",
    coords: "45.4642° N, 9.1900° E", lat: 45.4642, lng: 9.19,
    date: "APR 20", description: "La moda e il design. Where every espresso is a ritual and every street is a runway.",
    elevation: "120m", duration: "8 DAYS",
  },
  {
    id: 5, city: "Copenhagen", country: "Denmark", keyword: "Magic",
    coords: "55.6761° N, 12.5683° E", lat: 55.6761, lng: 12.5683,
    date: "AUG 15", description: "Design capital. The bicycles outnumber the cars, and the light lasts until midnight.",
    elevation: "14m", duration: "6 MO",
  },
  {
    id: 6, city: "Milos", country: "Greece", keyword: "Aegean",
    coords: "36.7246° N, 24.4299° E", lat: 36.7246, lng: 24.4299,
    date: "JUL 01", description: "Moon landscapes on water. Sarakiniko bleached white against the deepest Aegean blue.",
    elevation: "8m", duration: "5 DAYS",
  },
  {
    id: 7, city: "Palermo", country: "Italy", keyword: "Chaos",
    coords: "38.1157° N, 13.3615° E", lat: 38.1157, lng: 13.3615,
    date: "JUL 08", description: "Sicily's beating heart. Crumbling baroque palaces and the best street food in the Mediterranean.",
    elevation: "14m", duration: "4 DAYS",
  },
  {
    id: 8, city: "London", country: "UK", keyword: "Layers",
    coords: "51.5074° N, 0.1278° W", lat: 51.5074, lng: -0.1278,
    date: "SEP 01", description: "The old world. Where centuries layer like sediment and every pub has a ghost story.",
    elevation: "11m", duration: "12 DAYS",
  },
  {
    id: 9, city: "Shanghai", country: "China", keyword: "Neon",
    coords: "31.2304° N, 121.4737° E", lat: 31.2304, lng: 121.4737,
    date: "JAN 20", description: "东方明珠。The city that never sleeps, where tradition meets tomorrow.",
    elevation: "4m", duration: "14 DAYS",
  },
  {
    id: 10, city: "Kyoto", country: "Japan", keyword: "Stillness",
    coords: "35.0116° N, 135.7681° E", lat: 35.0116, lng: 135.7681,
    date: "MAR 22", description: "Where every garden is a meditation and every temple tells a thousand-year story.",
    elevation: "50m", duration: "5 DAYS",
  },
  {
    id: 11, city: "Marrakech", country: "Morocco", keyword: "Spice",
    coords: "31.6295° N, 7.9811° W", lat: 31.6295, lng: -7.9811,
    date: "NOV 03", description: "A labyrinth of color and noise. The souks swallow you whole.",
    elevation: "466m", duration: "6 DAYS",
  },
  {
    id: 12, city: "Reykjavik", country: "Iceland", keyword: "Void",
    coords: "64.1466° N, 21.9426° W", lat: 64.1466, lng: -21.9426,
    date: "FEB 14", description: "Edge of the world. Where the earth cracks open and the sky dances green.",
    elevation: "15m", duration: "4 DAYS",
  },
  {
    id: 13, city: "Buenos Aires", country: "Argentina", keyword: "Tango",
    coords: "34.6037° S, 58.3816° W", lat: -34.6037, lng: -58.3816,
    date: "APR 01", description: "Melancholy and passion in every corner. The Paris of South America.",
    elevation: "25m", duration: "9 DAYS",
  },
  {
    id: 14, city: "Lisbon", country: "Portugal", keyword: "Saudade",
    coords: "38.7223° N, 9.1393° W", lat: 38.7223, lng: -9.1393,
    date: "MAY 10", description: "Fado echoes through tiled streets. Light that painters chase forever.",
    elevation: "108m", duration: "7 DAYS",
  },
  {
    id: 15, city: "Seoul", country: "South Korea", keyword: "Tempo",
    coords: "37.5665° N, 126.9780° E", lat: 37.5665, lng: 126.978,
    date: "OCT 05", description: "Ancient palaces and neon streets. Speed and tradition in perfect tension.",
    elevation: "38m", duration: "6 DAYS",
  },
  {
    id: 16, city: "Cape Town", country: "South Africa", keyword: "Edge",
    coords: "33.9249° S, 18.4241° E", lat: -33.9249, lng: 18.4241,
    date: "DEC 20", description: "Where two oceans collide. Table Mountain watches over everything.",
    elevation: "0m", duration: "10 DAYS",
  },
  {
    id: 17, city: "Vienna", country: "Austria", keyword: "Order",
    coords: "48.2082° N, 16.3738° E", lat: 48.2082, lng: 16.3738,
    date: "MAY 28", description: "Imperial symmetry. Coffee house culture and the weight of classical music.",
    elevation: "171m", duration: "5 DAYS",
  },
  {
    id: 18, city: "Havana", country: "Cuba", keyword: "Decay",
    coords: "23.1136° N, 82.3666° W", lat: 23.1136, lng: -82.3666,
    date: "MAR 15", description: "Frozen in time. Crumbling pastel facades and rum-soaked nights.",
    elevation: "59m", duration: "8 DAYS",
  },
  {
    id: 19, city: "Bruges", country: "Belgium", keyword: "Amber",
    coords: "51.2093° N, 3.2247° E", lat: 51.2093, lng: 3.2247,
    date: "NOV 20", description: "Medieval perfection preserved in stone. Canals like liquid glass.",
    elevation: "8m", duration: "3 DAYS",
  },
  {
    id: 20, city: "Jaipur", country: "India", keyword: "Pink",
    coords: "26.9124° N, 75.7873° E", lat: 26.9124, lng: 75.7873,
    date: "JAN 08", description: "The pink city. Forts and bazaars painted in sunset hues.",
    elevation: "431m", duration: "5 DAYS",
  },
  {
    id: 21, city: "Taipei", country: "Taiwan", keyword: "Humid",
    coords: "25.0330° N, 121.5654° E", lat: 25.033, lng: 121.5654,
    date: "SEP 18", description: "Night markets and mountain temples. Warmth in every bowl of beef noodle.",
    elevation: "9m", duration: "7 DAYS",
  },
  {
    id: 22, city: "Santorini", country: "Greece", keyword: "Caldera",
    coords: "36.3932° N, 25.4615° E", lat: 36.3932, lng: 25.4615,
    date: "JUN 15", description: "Blue domes against white walls. Sunsets that silence entire crowds.",
    elevation: "120m", duration: "4 DAYS",
  },
  {
    id: 23, city: "Bergen", country: "Norway", keyword: "Rain",
    coords: "60.3913° N, 5.3221° E", lat: 60.3913, lng: 5.3221,
    date: "AUG 02", description: "Wooden houses and fjord mist. It rains but you stop caring.",
    elevation: "12m", duration: "3 DAYS",
  },
  {
    id: 24, city: "Petra", country: "Jordan", keyword: "Carved",
    coords: "30.3285° N, 35.4444° E", lat: 30.3285, lng: 35.4444,
    date: "APR 14", description: "Rose-red city half as old as time. Sandstone cathedrals in the desert.",
    elevation: "810m", duration: "2 DAYS",
  },
  {
    id: 25, city: "Oaxaca", country: "Mexico", keyword: "Mezcal",
    coords: "17.0732° N, 96.7266° W", lat: 17.0732, lng: -96.7266,
    date: "NOV 01", description: "Day of the Dead. Mole negro and smoky agave under a violet sky.",
    elevation: "1555m", duration: "6 DAYS",
  },
  {
    id: 26, city: "Dubrovnik", country: "Croatia", keyword: "Walls",
    coords: "42.6507° N, 18.0944° E", lat: 42.6507, lng: 18.0944,
    date: "JUL 22", description: "Pearl of the Adriatic. Ancient walls that have seen everything.",
    elevation: "3m", duration: "4 DAYS",
  },
  {
    id: 27, city: "Osaka", country: "Japan", keyword: "Flavor",
    coords: "34.6937° N, 135.5023° E", lat: 34.6937, lng: 135.5023,
    date: "OCT 12", description: "Japan's kitchen. Where takoyaki sizzles and the people are unfiltered.",
    elevation: "12m", duration: "5 DAYS",
  },
  {
    id: 28, city: "Fez", country: "Morocco", keyword: "Ancient",
    coords: "34.0181° N, 5.0078° W", lat: 34.0181, lng: -5.0078,
    date: "NOV 08", description: "The world's largest car-free urban area. A medieval maze still alive.",
    elevation: "410m", duration: "4 DAYS",
  },
  {
    id: 29, city: "Porto", country: "Portugal", keyword: "Tile",
    coords: "41.1579° N, 8.6291° W", lat: 41.1579, lng: -8.6291,
    date: "MAY 15", description: "Azulejos everywhere. Port wine cellars and bridges over the Douro.",
    elevation: "104m", duration: "5 DAYS",
  },
  {
    id: 30, city: "Luang Prabang", country: "Laos", keyword: "Dawn",
    coords: "19.8856° N, 102.1347° E", lat: 19.8856, lng: 102.1347,
    date: "FEB 20", description: "Monks at sunrise. The Mekong flows slow and time stops.",
    elevation: "305m", duration: "6 DAYS",
  },
];

// Calculate total distance (approximate great circle distance)
export function calculateTotalDistance(dests: Destination[]): number {
  let total = 0;
  for (let i = 0; i < dests.length - 1; i++) {
    total += haversineDistance(
      dests[i].lat,
      dests[i].lng,
      dests[i + 1].lat,
      dests[i + 1].lng
    );
  }
  return Math.round(total);
}

function haversineDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
