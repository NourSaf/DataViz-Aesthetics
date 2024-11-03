import * as d3 from "d3";
import 'leaflet';
import { latLng } from "leaflet";
import 'leaflet.markercluster';


const main = d3.select('#main')
const header =  main.append('section').attr('class','header-dev')

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

const places = d3.rollup(data, 
    (v) => v, 
    (d) => d.place,
)

const mags = d3.rollup(data, 
    (v) => v, 
    (d) => d.mag,
)
console.log("those are mafs",mags)

const longitudeArray = Array.from(longitudes.keys());
console.log('this is Longitude Array',longitudeArray);
const latitudeArray = Array.from(latitudes.keys());
console.log('this is Latitude Array',latitudeArray);
const placesArray = Array.from(places.keys());
console.log(placesArray)
const cityName = placesArray.map(place => place.split(' of ')[1]);
console.log(cityName)

const magArray = Array.from(mags.keys()).sort()
console.log("this is Mag array",magArray)

// const markers = latitudeArray.map((lat, i) => L.marker([lat, longitudeArray[i]]).bindPopup(cityName[i]));
// const markerGroup = L.layerGroup(markers).addTo(map);

for ( let i = 0;  i < latitudeArray.length; i++){
    console.log(latitudeArray[i],longitudeArray[i])
    if (magArray[i] >= 6){
        L.circle([latitudeArray[i], longitudeArray[i]], {
            color: 'red',
            weight: 0.5,
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 409000
        })
            .bindPopup(cityName[i])
            .addTo(map)
            .on('click', function(){
                map.setView([latitudeArray[i], longitudeArray[i]], 6);
        });
    } if (magArray[i] > 4 && magArray[i] < 6 ){
        L.circle([latitudeArray[i], longitudeArray[i]], {
            color: 'blue',
            weight: 0.5,
            fillColor: 'blue',
            fillOpacity: 0.5,
            radius: 300000
        })
            .bindPopup(cityName[i])
            .addTo(map)
            .on('click', function(){
                map.setView([latitudeArray[i], longitudeArray[i]], 6);
        });
    } if (magArray[i] < 4 ){
        L.circle([latitudeArray[i], longitudeArray[i]], {
            color: 'green',
            weight: 0.5,
            fillColor: 'green',
            fillOpacity: 0.5,
            radius: 200000
        })
            .bindPopup(cityName[i])
            .addTo(map)
            .on('click', function(){
                map.setView([latitudeArray[i], longitudeArray[i]], 6);
        });
    }
    
}

const resetButton = main.append('button')
    .attr('id', 'reset-view')
    .text('Reset View')
    .style('background-color', 'white')
    .style('color', 'black')
    .style('border', 'sloid 1px')
    .style('padding', '10px 20px')
    .style('cursor', 'pointer')
    .style('border-radius', '30px')
    .on('click', () => {
        map.setView([0, 0], 2);
    });


