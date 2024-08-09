Create a Visualization of Global Earthquake Data

Legend code provided by Instructor
  // Step 6: Legend
  let legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    let div = L.DomUtil.create("div", "info legend");

    let legendInfo = "<h4>Legend</h4>"
    legendInfo += "<i style='background: #98EE00'></i>-10-10<br/>";
    legendInfo += "<i style='background: #D4EE00'></i>10-30<br/>";
    legendInfo += "<i style='background: #EECC00'></i>30-50<br/>";
    legendInfo += "<i style='background: #EE9C00'></i>50-70<br/>";
    legendInfo += "<i style='background: #EA822C'></i>70-90<br/>";
    legendInfo += "<i style='background: #EA2C2C'></i>90+";

    div.innerHTML = legendInfo;
    return div;
  };

leaflet-heat.js from
 (c) 2014, Vladimir Agafonkin
 simpleheat, a tiny JavaScript library for drawing heatmaps with Canvas
 https://github.com/mourner/simpleheat

index.html
copy paste from class assignments
