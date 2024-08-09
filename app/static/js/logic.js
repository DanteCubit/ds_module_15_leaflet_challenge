// Define functions outside of data fetching for better readability
function getColor(depth) {
  switch (true) {
      case depth <= 10: return "#98EE00";
      case depth <= 30: return "#D4EE00";
      case depth <= 50: return "#EECC00";
      case depth <= 70: return "#EE9C00";
      case depth <= 90: return "#EA822C";
      default: return "#EA2C2C";
  }
}

function getRadius(magnitude) {
  return magnitude === 0 ? 1 : magnitude * 4;
}

function styleInfo(feature) {
  return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.geometry.coordinates[2]),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
  };
}

// Create map
let map = L.map("map", {
  center: [40.7, -94.5],
  zoom: 3
});

// Create and add base layers
let basemap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
}).addTo(map);

let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});

// Create layer groups
let earthquakesLayer = L.layerGroup();
let tectonicPlatesLayer = L.layerGroup();

// Add earthquake data to the earthquakesLayer
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
  L.geoJson(data, {
      pointToLayer: function(feature, latlng) {
          return L.circleMarker(latlng);
      },
      style: styleInfo,
      onEachFeature: function(feature, layer) {
          layer.bindPopup(
              `Magnitude: ${feature.properties.mag}<br>Depth: ${feature.geometry.coordinates[2]}<br>Location: ${feature.properties.place}`
          );
      }
  }).addTo(earthquakesLayer);
  
  earthquakesLayer.addTo(map);  // Add to map initially

  // Add tectonic plates data to the tectonicPlatesLayer
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json").then(function(platesData) {
      L.geoJson(platesData, {
          color: "orange",
          weight: 2,
          opacity: 0.7
      }).addTo(tectonicPlatesLayer);

      tectonicPlatesLayer.addTo(map);  // Add to map initially

      // Add layer control
      let baseMaps = {
          "StreetMap": basemap,
          "TopographicalMap": topo
      };

      let overlayMaps = {
          "Earthquakes": earthquakesLayer,
          "Tectonic Plates": tectonicPlatesLayer
      };

      L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map);

      // Add legend
      let legend = L.control({ position: "bottomright" });

      legend.onAdd = function() {
          let div = L.DomUtil.create("div", "info legend");
          let legendInfo = `
              <h4>Legend</h4>
              <i style='background: #98EE00'></i>-10-10<br/>
              <i style='background: #D4EE00'></i>10-30<br/>
              <i style='background: #EECC00'></i>30-50<br/>
              <i style='background: #EE9C00'></i>50-70<br/>
              <i style='background: #EA822C'></i>70-90<br/>
              <i style='background: #EA2C2C'></i>90+
          `;
          div.innerHTML = legendInfo;
          return div;
      };

      legend.addTo(map);
  });
});