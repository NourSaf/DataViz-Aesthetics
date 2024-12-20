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


for (let i = 0; i < data.length; i++) {
    const latitude = +data[i].latitude;
    const longitude = +data[i].longitude;
    const magnitude = +data[i].mag;
    const place = data[i].place;

    const leafletCoords = L.latLng(latitude, longitude);

    let color;
    if (magnitude >= 5) {
        color = 'red';
    } else if (magnitude > 2) {
        color = 'blue';
    } else {
        color = 'green';
    }

    L.circle(leafletCoords, {
        color: color,
        weight: 0.5,
        fillColor: color,
        fillOpacity: 0.5,
        radius: 90000
    })
        .bindPopup(`City Name: ${place} | Magnitude: ${magnitude}`)
        .addTo(map)
        .on('click', function() {
            map.setView(leafletCoords, 6);
        });
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
    return d > 5          ? 'red'  :
           d > 2 && d < 5 ? 'blue' :
                            'green';
}

const legend = L.control({position:'bottomleft'});
legend.onAdd = function () {
    
    let div = L.DomUtil.create('div', 'legend');
    let classes = [-3, 2, 5];
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


