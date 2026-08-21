const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Fetches police stations from OpenStreetMap's Overpass API
 * Uses GET with query parameter (more reliable than POST with raw body)
 */
async function fetchPoliceStations(lat, lon) {
  const radii = [3000, 5000, 10000, 20000, 35000];
  for (const r of radii) {
    // nwr = node + way + relation. Many real police stations are mapped as
    // a building outline (way) or a grouped complex (relation), not a single
    // point (node) — searching node-only silently misses most of those.
    // "out center;" gives us a usable lat/lon for ways/relations too.
    const query = `[out:json][timeout:20];nwr["amenity"="police"](around:${r},${lat},${lon});out center;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'RakshakLine/1.0 (safety app demo)' }
      });
      if (!response.ok) {
        console.error(`[stations] HTTP ${response.status} for radius ${r}m`);
        continue;
      }
      const data = await response.json();
      if (data.elements && data.elements.length > 0) {
        return data.elements
          .map(el => {
            // nodes have lat/lon directly; ways/relations expose it via "center"
            const elLat = el.lat ?? el.center?.lat;
            const elLon = el.lon ?? el.center?.lon;
            if (elLat == null || elLon == null) return null;
            return {
              name: el.tags?.name || 'Police station',
              phone: el.tags?.phone || el.tags?.['contact:phone'] || null,
              lat: elLat,
              lon: elLon,
              distanceKm: Number(haversine(lat, lon, elLat, elLon).toFixed(2))
            };
          })
          .filter(Boolean)
          // de-duplicate: a station's building outline and a nearby node can
          // both come back for the same place — collapse near-identical entries
          .filter((s, i, arr) =>
            arr.findIndex(o => o.name === s.name && Math.abs(o.distanceKm - s.distanceKm) < 0.05) === i
          )
          .sort((a, b) => a.distanceKm - b.distanceKm)
          .slice(0, 6);
      }
    } catch (err) {
      console.error(`[stations] Overpass error (radius ${r}m):`, err.message);
    }
  }
  return [];
}


router.get('/', async (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lon = parseFloat(req.query.lon);
  if (Number.isNaN(lat) || Number.isNaN(lon)) {
    return res.status(400).json({ error: 'lat and lon query params are required' });
  }

  const stations = await fetchPoliceStations(lat, lon);
  res.json({ stations, searchRadiusMeters: 20000 });
});


router.get('/address', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat and lon query params are required' });
  }
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=16`,
      { headers: { 'User-Agent': 'RakshakLine/1.0 (safety app demo)' } }
    );
    const data = await response.json();
    res.json({ address: data.display_name || `${lat}, ${lon}` });
  } catch (err) {
    res.json({ address: `${lat}, ${lon}` });
  }
});

module.exports = router;
