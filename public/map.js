if (typeof countryCoords !== "undefined") {
  const map = L.map("map").setView([countryCoords.lat, countryCoords.lng], 4);

  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  // Highlight country with a marker
  L.marker([countryCoords.lat, countryCoords.lng])
    .addTo(map)
    .bindPopup(`Bird location: ${countryCoords.country}`)
    .openPopup();
}