// Centre : IAV Hassan II, Rabat (Maroc)
var IAV_CENTER = [33.97615, -6.86558];
var IAV_BOUNDS = [
  [33.9707437, -6.870649],
  [33.9816305, -6.8605055],
];

var map = L.map("map", { zoomControl: true }).setView(IAV_CENTER, 17);

// Fonds de carte
var osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 21,
  maxNativeZoom: 19,
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

var satellite = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  { maxZoom: 21, maxNativeZoom: 19, attribution: "Tiles &copy; Esri" },
);

// Couche raster (orthophoto IAV)
var orthophoto = L.imageOverlay("data/iav.png", IAV_BOUNDS, { opacity: 1 });

// Style des routes selon la categorie
var roadStyle = function (f) {
  var p = f.properties;
  return {
    color: p.color || "#506475",
    weight: Math.max((p.width || 3) - 1, 2),
    opacity: 0.9,
    dashArray: p.category === "Piste" ? "6 6" : null,
  };
};

var blocks = L.geoJSON(null, {
  style: { color: "#15803d", weight: 1, fillColor: "#4ade80", fillOpacity: 0.35 },
});
var roads = L.geoJSON(null, { style: roadStyle });
var buildings = L.geoJSON(null, {
  style: { color: "#9a3412", weight: 1.5, fillColor: "#f97316", fillOpacity: 0.6 },
  onEachFeature: function (f, layer) {
    var name = f.properties.name;
    if (name) layer.bindPopup("<b>Bâtiment</b><br>" + name);
    layer.on({
      mouseover: function () {
        layer.setStyle({ fillOpacity: 0.9 });
      },
      mouseout: function () {
        buildings.resetStyle(layer);
      },
    });
  },
});
var trees = L.geoJSON(null, {
  pointToLayer: function (f, latlng) {
    return L.circleMarker(latlng, {
      radius: 4,
      color: "#14532d",
      weight: 1,
      fillColor: "#22c55e",
      fillOpacity: 0.9,
    });
  },
});

// Chargement des couches GeoJSON
function load(layer, file) {
  fetch("data/" + file)
    .then(function (r) {
      return r.json();
    })
    .then(function (data) {
      layer.addData(data);
    })
    .catch(function (e) {
      console.error("Erreur de chargement " + file, e);
    });
}
load(blocks, "iav_block.geojson");
load(roads, "iav_road.geojson");
load(buildings, "building_iav.geojson");
load(trees, "arbre_iav.geojson");

orthophoto.addTo(map);
blocks.addTo(map);
roads.addTo(map);
buildings.addTo(map);
trees.addTo(map);

// Controle des couches
L.control
  .layers(
    { OpenStreetMap: osm, Satellite: satellite },
    {
      "Orthophoto IAV": orthophoto,
      "Blocs (iav_block)": blocks,
      "Routes (iav_road)": roads,
      "Bâtiments (building_iav)": buildings,
      "Arbres (arbre_iav)": trees,
    },
    { collapsed: false },
  )
  .addTo(map);

L.control.scale({ imperial: false }).addTo(map);

// Bouton de retour sur l'IAV
var HomeControl = L.Control.extend({
  onAdd: function () {
    var btn = L.DomUtil.create("button", "home-btn");
    btn.innerHTML = "&#8962; IAV";
    btn.title = "Revenir sur l'IAV Hassan II";
    L.DomEvent.disableClickPropagation(btn);
    btn.onclick = function () {
      map.fitBounds(IAV_BOUNDS);
    };
    return btn;
  },
});
new HomeControl({ position: "topleft" }).addTo(map);

// Legende
var legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML =
    "<h4>Légende</h4>" +
    '<i style="background:#4ade80;border:1px solid #15803d"></i> Blocs<br>' +
    '<i style="background:#f97316;border:1px solid #9a3412"></i> Bâtiments<br>' +
    '<i style="background:#2D3942;height:4px;margin-top:6px"></i> Route principale<br>' +
    '<i style="background:#506475;height:3px;margin-top:6px"></i> Route secondaire<br>' +
    '<i style="background:#22c55e;border-radius:50%;border:1px solid #14532d"></i> Arbres';
  return div;
};
legend.addTo(map);

map.fitBounds(IAV_BOUNDS);
