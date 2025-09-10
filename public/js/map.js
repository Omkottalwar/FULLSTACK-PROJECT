const map = new maplibregl.Map({
  container: "map",
  style: "https://demotiles.maplibre.org/style.json",
  center: coordinate, // Default New Delhi
  zoom: 10,
});

// Reverse geocoding
async function getCityName(lat, lng) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
  );
  const data = await response.json();
  return (
    data.address.city ||
    data.address.town ||
    data.address.village ||
    data.address.state ||
    "Unknown Location"
  );
}

// ✅ Declare coordinates only once
const coordinates = coordinate; // [lng, lat]
const [lng, lat] = coordinates;

// When map loads, add marker
map.on("load", async () => {
  const city = await getCityName(lat, lng);

  new maplibregl.Marker()
    .setLngLat(coordinates)
    .setPopup(new maplibregl.Popup().setHTML(`<b>${city}</b>`))
    .addTo(map)
    .togglePopup();
});