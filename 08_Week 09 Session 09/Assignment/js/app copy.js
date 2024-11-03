import * as d3 from "d3";
import 'leaflet';
import { latLng } from "leaflet";
import 'leaflet.markercluster';


const main = d3.select('#main')
const header =  main.append('section').attr('class','header-dev').text('Title')

const leafletContainer = main
    .append('dev')
    .attr('id','map-container')
    .attr('class','map-container')

const mapContainer = leafletContainer
    .append('div')
    .attr('id','#map')
    .style('height','500px')
    .style('width','500px')

const map = L.map(mapContainer.node(), {
    center: [0,0],
    zoom: 2,
})

var Stadia_AlidadeSmoothDark = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 0,
	maxZoom: 20,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});

const tile = map.addLayer(Stadia_AlidadeSmoothDark)

const data = await d3.csv('data/significant_month.csv')
console.log(data)

const latitudes = d3.rollup(data, 
    (v) => v,
    (d) => d.latitude,
)

const longitudes = d3.rollup(data, 
    (v) => v,
    (d) => d.longitude,
)

const longitudeArray = Array.from(longitudes.keys())
console.log('this is Longitude Array',longitudeArray)
const latitudeArray = Array.from(latitudes.keys())
console.log('this is Latitude Array',latitudeArray)

const markers = latitudeArray.map((lat, i) => L.marker([lat, longitudeArray[i]]));
const markerGroup = L.layerGroup(markers).addTo(map);

for ( let i = 0;  i < latitudeArray.length; i++){
    console.log(latitudeArray[i],longitudeArray[i])
    L.circle([latitudeArray[i], longitudeArray[i]], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 50000
    }).addTo(map);
}

