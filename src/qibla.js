// Qibla: initial great-circle bearing from a point to the Kaaba, in degrees clockwise from true north.
export const KAABA = { lat: 21.422487, lon: 39.826206 };
const rad = (d) => (d * Math.PI) / 180, deg = (r) => (r * 180) / Math.PI;
const DIRS = [['N', 'شمال'], ['NE', 'شمال شرق'], ['E', 'شرق'], ['SE', 'جنوب شرق'], ['S', 'جنوب'], ['SW', 'جنوب غرب'], ['W', 'غرب'], ['NW', 'شمال غرب']];
export function qibla(lat, lon) {
  const p1 = rad(lat), p2 = rad(KAABA.lat), dl = rad(KAABA.lon - lon);
  const b = deg(Math.atan2(Math.sin(dl), Math.cos(p1) * Math.tan(p2) - Math.sin(p1) * Math.cos(dl)));
  const bearing = Math.round(((b + 360) % 360) * 10) / 10, [en, ar] = DIRS[Math.round(bearing / 45) % 8];
  return { bearing, compass: en, compassAr: ar };
}
/** Great-circle distance to the Kaaba in km (haversine). */
export function distanceToKaabaKm(lat, lon) {
  const dp = rad(KAABA.lat - lat), dl = rad(KAABA.lon - lon);
  const a = Math.sin(dp / 2) ** 2 + Math.cos(rad(lat)) * Math.cos(rad(KAABA.lat)) * Math.sin(dl / 2) ** 2;
  return Math.round(2 * 6371.0088 * Math.asin(Math.sqrt(a)));
}
