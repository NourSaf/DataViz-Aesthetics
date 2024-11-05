import * as d3 from "d3";
import 'leaflet';
import 'leaflet.markercluster';


const main = d3.select('#main')
const header =  main.append('section').attr('class','header-dev')

header
    .append('div')
    .attr('class','map-title')
    .style('font-size', '2em')
    .style('color', 'white')
    .text('World Earthquakes Map')

header
    .append('p')
    .attr('class','subtext')
    .style('font-size', '0.9em')
    .style('color', 'white')
    .text('Earthquakes from 04.10 - 04.11.2024')

header
    .append('div')
    .attr('class', 'data-source')
    .style('font-size', '0.8em')
    .style('color', 'gray')
    .append('a')
    .attr('href', 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/csv.php')
    .attr('target', '_blank')
    .style('text-decoration', 'none')
    .style('color', 'gray')
    .text('data source here');



const leafletContainer = main
    .append('dev')
    .attr('id','map-container')
    .attr('class','map-container')

const mapContainer = leafletContainer
    .append('div')
    .attr('id','map')

const map = L.map(mapContainer.node(), {
    center: [10,-10],
    zoom: 3,
})

var Stadia_AlidadeSmoothDark =  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}', {
	minZoom: 3,
	maxZoom: 4,
	attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	ext: 'png'
});

map.addLayer(Stadia_AlidadeSmoothDark)

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

for ( let i = 0;  i < latitudeArray.length; i++){
    console.log(latitudeArray[i],longitudeArray[i])
    const leafletCoords = L.latLng(latitudeArray[i], longitudeArray[i]); 
    if (magArray[i] >= 6){
        L.circle(leafletCoords, {
            color: 'red',
            weight: 0.5,
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 120000
        })
            .bindPopup(`City Name: ${cityName[i]} | Magnitude: ${magArray[i]}`)
            .addTo(map)
            .on('click', function(){
                map.setView(leafletCoords, 6);
            });
    } if (magArray[i] > 4 && magArray[i] < 6 ){
        L.circle(leafletCoords, {
            color: 'blue',
            weight: 0.5,
            fillColor: 'blue',
            fillOpacity: 0.5,
            radius: 120000
        })
            .bindPopup(`City Name: ${cityName[i]} | Magnitude: ${magArray[i]}`)
            .addTo(map)
            .on('click', function(){
                map.setView(leafletCoords, 6);
            });
    } if (magArray[i] < 4 ){
        L.circle(leafletCoords, {
            color: 'green',
            weight: 0.5,
            fillColor: 'green',
            fillOpacity: 0.5,
            radius: 120000
        })
            .bindPopup(`City Name: ${cityName[i]} | Magnitude: ${magArray[i]}`)
           
            .addTo(map)
            .on('click', function(){
                map.setView(leafletCoords, 6);
        });
    } 
}


L.Control.ResetButton = L.Control.extend({
    options: {
        position: "topleft"
    },
    onAdd: function (map){
        const container = d3
            .create('div')
            .attr('class', "leaflet-bar leaflet-control");

            const button = container
                .append('a')
                .attr('class','leaflet-control-button')
                .attr('role','button')
                .style('cursor','pointer');
            button
                .append('img')
                .attr('src',"/imgs/refresh-icon.svg")
                .style('transform','scale(0.5)');
            button.on('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                map.setView([10,-10],3)
            });
            return container.node();
    },
    onRemove:function (){},
});

const resetView = new L.Control.ResetButton();
resetView.addTo(map)


function getColor(d) {
    return d > 6          ? 'red'  :
           d > 4 && d < 6 ? 'blue' :
                            'green';
}

const legend = L.control({position:'bottomleft'});
legend.onAdd = function () {
    
    let div = L.DomUtil.create('div', 'legend');
    let classes = [1, 4, 6];
    // let labels = [];

    div.innerHTML += '<p class="legend-title">Earthquake Magnitude</p>';

    for (let i = 0; i < classes.length; i++) {
        div.innerHTML +=
        ` 
        <div class="legend-item"> 
            <i style="background:${getColor(classes[i] + 1)} "></i> 
            ${classes[i] + (classes[i + 1] ? ` &ndash; ${classes[i + 1]}<br>` : ' +')}
        </div>
        `;
    }

    return div;
};
legend.addTo(map);


