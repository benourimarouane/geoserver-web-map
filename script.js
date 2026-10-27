var map = L.map("map").setView([40.697714, -73.894424], 8);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
L.tileLayer
  .wms("http://localhost:8080/geoserver/wms", {
    layers: "	opengeo:cb_2018_us_state_500k",
    format: "image/png",
    transparent: true,
    version: "1.1.0",
  })
  .addTo(map);
