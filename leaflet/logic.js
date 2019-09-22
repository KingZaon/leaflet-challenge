// Creating map object
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
});   
   
   // Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
}).addTo(myMap);



var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var query2 = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

// Perform GET request to query
d3.json(queryUrl, function(data) {
    createFeatures(data.features);    
});

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" +
        "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p>");
    }


    // Create a Geojson alyer containing the feature array on earthquake object
    // Run onEach function for every piece of data
    var earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: function (feature, latlng) {
            var color;
            var r = 255;
            var g = Math.floor(255-80*feature.properties.mag);
            var b = Math.floor(255-80*feature.properties.mag);
            color= "rgb("+r+","+g+","+b+")"

            var geojsonMarkerOptions = {
                radius: 4*feature.properties.mag,
                fillColor: color,
                color: "black",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            };
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }
    });

    // Sending earthquakes layer to createMap function
    earthquakes.addTo(myMap);
}
    // Create overlay object to hold the layer

    var overlayMaps = {
        "Earthquakes": earthquakes
    };


    //Color functions for different layers of earthquakes levels

    function getColor(d) {
        return d < 1 ? 'rgb(255,255,255)' :
            d < 2 ? 'rgb(255,255,255)' :
            d < 3 ? 'rgb(255,195,195)' :
            d < 4 ? 'rgb(255,165,165)' :
            d < 5 ? 'rgb(255,135,135)' :
            d < 6 ? 'rgb(255,105,105)' :
            d < 7 ? 'rgb(255,75,75)' :
            d < 8 ? 'rgb(255,45,45)' :
            d < 9 ? 'rgb(255,15,15)' :
                        'rgb(255,0,0)';
    }

    // Create a legend to display information about our map
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
        grades = [0,1,2,3,4,5,6,7,8],
        labels =[];

        div.innerHTML +='Magnitude<br><hr>'

        // Loop through density interbals and generate a label with colored square
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background: ' + getColor(grdades[i] + 1) + '">&nbsp&nbsp&nbsp&nbsp</i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i +1] + '<br>' : '+');
    }

    return div;
    };

    legend.addTo(myMap);

