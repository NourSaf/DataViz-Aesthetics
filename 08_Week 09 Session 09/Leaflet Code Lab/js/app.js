// import d3 library
import * as d3 from "d3";
// import leaflet library
import "leaflet";
// import leaflet.markercluster library
import 'leaflet.markercluster';

const zip_codes = [
  '10001',
  '10003',
  '10010', 
  '10011',
  '10012',
  '10014',
  '10016',
  '10018',
  '10019',
  '10036',
  '10199',
  '10033',
];

const app = d3
  .select("#app")
  // replace the text of the app div with nothing
  .html("")
  // place chart in the center of the page
  .style("position", "fixed")
  .style("inset", "0")
  .style("padding", "50px")
  .style("overflow", "auto")
  // add new div for content to be placed in
  .append("div")
  .style("margin", "0 auto")
  .style("padding", "20px")
  .style("border-radius", "10px")
  .style("width", "100%")
  .style("max-width", "800px")
  .style("background", "hsl(255, 6%, 10%)")
  .style("box-shadow", "0px 0px 2px hsla(0, 0%, 0%, 0.1)");

// add title
const title = app
  .append("h1")
  .style("margin", "0")
  .style("padding-top", "4px")
  .style("padding-left", "2px")
  .style("padding-bottom", "12px")
  .style("font-size", "1.1rem")
  .style("font-weight", 500)
  .style("color", "#eee")
  .text("Leaflet Exercise");

// create a <div id="map"></div> inside of div#app
const mapElement = app
  .append("div")
  .attr("id", "map")
  .style("height", "500px")
  .style("border-radius", "8px");

// create leaflet map
const map = L.map(mapElement.node()).setView([0, 0], 15);

// Tile Layer
const tileLayer = L.tileLayer("http://services.arcgisonline.com/arcgis/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}", {
	minZoom: 10,
	maxZoom: 16,
    attribution: "ARCGIS ONLINE",
});

// The New School Data
const tnsCoordinates = new L.LatLng(40.7359728, -73.9957851);
const tnsIcon = L.icon({
    iconUrl: './images/new_school.png',
    className: 'tns-icon-marker',
    iconSize:     [40, 40],
    shadowSize:   [0, 0], 
    iconAnchor:   [20, 20],
    shadowAnchor: [0, 0], 
    popupAnchor:  [0, 0]
});

const tnsMarker = L.marker(tnsCoordinates, { icon: tnsIcon });

tnsMarker.bindPopup('The New School')

const zipCodeGeoJson = await d3.json('./data/zip-code.json');
console.log(zipCodeGeoJson)

const zipCodeLayer = L.geoJSON(zipCodeGeoJson, {
  style: function (feature) {
    // if (feature.properties['zcta'] === '10001')
    if (feature.properties['zcta'] === '10001')
      return {
        color: "green"
      };
    if (zip_codes.includes(feature.properties["zcta"]))
    return {
      color: 'red',
      fillColor: "blue",
      fillOpacity: 0.1
    };
    
  },
  filter: function (feature) {
    return zip_codes.includes(feature.properties["zcta"]);
  },
});


// add layers to map
map
.panTo(tnsCoordinates)
.addLayer(zipCodeLayer)
.addLayer(tnsMarker)
.addLayer(tileLayer);
