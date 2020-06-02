// Store our API endpoint inside queryUrl
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 2.5
  }); 


L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "streets-v9",
    accessToken: API_Key
}).addTo(myMap);

//Create color range for the circle diameter 
function getColor(mag){
    return mag > 5 ? "#a54500":
        mag > 4 ? "#cc5500":
        mag > 3 ? "#ff6f08":
        mag > 2 ? "#ff9143":
        mag > 1 ? "#ffb37e":
                    "#ffcca5";
}

 //Change the magnitude of the earthquake by a factor of 60000 for the radius of the circle.
function markerSize(mag){
    return mag * 60000
}

// Perform a GET request to the query URL
d3.json(queryURL, function(data) {
    createFeatures(data.features);
});


function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer){
    layer.bindPopup("<h3>Magnitude: " + feature.properties.mag +"</h3><h3>Location: "+ feature.properties.place +
    "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    function pointToLayer(feature, latlng) {
        return L.circle(latlng, {
            fillOpacity: 0.75,
            color: "#000",
            weight: 0.8,
            fillColor: getColor(feature.properties.mag),
            radius: markerSize(feature.properties.mag)
    })}
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJson(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });

    earthquakes.addTo(myMap);

    var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function (myMap) {var div = L.DomUtil.create('div', 'info legend'); return div;}
    legend.addTo(myMap);
    var grades = [0, 1, 2, 3, 4, 5];
    var labels = [];

    for (var i = 0; i < grades.length; i++){
        var from = grades [i];
        var to = grades [i+1]-1;
        labels.push('<i style="background:' + getColor(from + 1) + '"></i> ' + from + (to ? '&ndash;' + to : '+'));
    }

    var legendText = labels.join("<br>")

    d3.select(".legend.leaflet-control").html(legendText);

}