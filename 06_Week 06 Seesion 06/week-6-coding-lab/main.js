import "./variables"
import "./style.css";
import * as d3 from "d3";
import { height, width,margin } from "./variables";

//The API link of 311-Service-Requests. Query: all data points between July and Oktober 2024
const URL = 'https://data.cityofnewyork.us/resource/erm2-nwe9.json?$query=SELECT%0A%20%20%60unique_key%60%2C%0A%20%20%60created_date%60%2C%0A%20%20%60closed_date%60%2C%0A%20%20%60agency%60%2C%0A%20%20%60agency_name%60%2C%0A%20%20%60complaint_type%60%2C%0A%20%20%60descriptor%60%2C%0A%20%20%60location_type%60%2C%0A%20%20%60incident_zip%60%2C%0A%20%20%60incident_address%60%2C%0A%20%20%60street_name%60%2C%0A%20%20%60cross_street_1%60%2C%0A%20%20%60cross_street_2%60%2C%0A%20%20%60intersection_street_1%60%2C%0A%20%20%60intersection_street_2%60%2C%0A%20%20%60address_type%60%2C%0A%20%20%60city%60%2C%0A%20%20%60landmark%60%2C%0A%20%20%60facility_type%60%2C%0A%20%20%60status%60%2C%0A%20%20%60due_date%60%2C%0A%20%20%60resolution_description%60%2C%0A%20%20%60resolution_action_updated_date%60%2C%0A%20%20%60community_board%60%2C%0A%20%20%60bbl%60%2C%0A%20%20%60borough%60%2C%0A%20%20%60x_coordinate_state_plane%60%2C%0A%20%20%60y_coordinate_state_plane%60%2C%0A%20%20%60open_data_channel_type%60%2C%0A%20%20%60park_facility_name%60%2C%0A%20%20%60park_borough%60%2C%0A%20%20%60vehicle_type%60%2C%0A%20%20%60taxi_company_borough%60%2C%0A%20%20%60taxi_pick_up_location%60%2C%0A%20%20%60bridge_highway_name%60%2C%0A%20%20%60bridge_highway_direction%60%2C%0A%20%20%60road_ramp%60%2C%0A%20%20%60bridge_highway_segment%60%2C%0A%20%20%60latitude%60%2C%0A%20%20%60longitude%60%2C%0A%20%20%60location%60%0AWHERE%0A%20%20%60created_date%60%0A%20%20%20%20BETWEEN%20%222024-08-01T21%3A50%3A13%22%20%3A%3A%20floating_timestamp%0A%20%20%20%20AND%20%222024-10-06T21%3A50%3A13%22%20%3A%3A%20floating_timestamp%0AORDER%20BY%20%60created_date%60%20DESC%20NULL%20FIRST'

// async function to fetch's the data from URL
const dataFetch = async () => {
  const data = await d3.json(URL)
  console.log(data)
  return data
}
//activate dataFetch then work with data when data the promis is returned.
//also cleans data a bit
let complaintType;
dataFetch().then((data) => {
  complaintType = d3.rollup(data, 
  (v) => v.length,
  (d) => {
    const type = d["complaint_type"];
    let typeWater = /water/i;
    let street = /street/i;
    let sideWalk = /sidewalk/i;
    let noise  = /noise/i;
    let dirty = /dirty/i;
    if ( noise.test(type ) ){
     return "Noise"
    } else if ( typeWater.test( type ) ){      
      return "Water complaint"
    } else if ( type == "Noise" ) {
      return "Noise"
    } else if ( (street.test(type)) || sideWalk.test(type)){
      return "Street Complaint"
    } else if (dirty.test(type)){
      return "Dirty conditions"
    } else {
      return type
    }
  });
})

const myData = await dataFetch();

console.log(" –> Complaint Type Count ", complaintType)
// Group complaint types with values between 1 and 10 into "Other"
// Group complaint types with values between 1 and 10 into "Other"
let otherCount = 0;
complaintType.forEach((value, key) => {
  if (value >= 1 && value <= 10) {
    otherCount += value;
    complaintType.delete(key);
  }
});
complaintType.set("Other", otherCount);

//extract the categories and values from the data 
const complaintCat = Array.from(complaintType.keys());
console.log(complaintCat)
const complaintVal = Array.from(complaintType.values());
const [min,max] = d3.extent(complaintVal);
const color = d3.scaleOrdinal().domain(complaintCat).range(d3.schemeObservable10)

console.log("this is min & max",min,":", max)

//creates dynamic elements in the DOM 
const main = d3.select('#chartContainer')

const header = 
  main
    .append("h1")
    .attr('class',"h1Header")
    .html('311 Service Requests')

  main
    .append("h2")
    .attr('class',"h2Header")
    .html('Complaints between July and Oktober 2024')

const svg = 
    main
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox",`0 0 ${width} ${height}`)
    .style("background-color", "white")
    .style("max-width", "100%")
    .style("height", "auto");

//set up x and y axis 
const xScale = d3
  .scaleBand()
  .domain( complaintCat )
  .range( [ margin.left, width - margin.right ] )
  .padding( 0.1 )
  .round(true);

const yScale = d3
  .scaleLinear()
  .domain( [max, 0 ]) 
  .range( [margin.top, height - margin.bottom] )
  .nice();

//creates groups for each component
const gridLines = svg
  .append('g')
  .attr('data-component','grid-lines');

const axes = svg
  .append('g')
  .attr('data-component', 'axes');

const bars = svg
  .append('g')
  .attr('data-component', 'bars');

const bardata = Array.from(complaintType.entries()).sort((a, b) =>  b[1] -  a[1]);
console.log('this is bardata',bardata )
xScale.domain(bardata.map(d => d[0]));

bars
  .selectAll('rect')
  .data(bardata)
  .join('rect')
  .attr('x', (d) => xScale(d[0]))
  .attr('y', (d) => yScale(d[1]))
  .attr('width', xScale.bandwidth())
  .attr('height', (d) => height - margin.bottom - yScale(d[1]))
  .attr('fill', (d) => color(d[0]));

axes
  .append("g")
  .attr("transform", `translate(0 ${height - margin.bottom + 5})`)
  .call(d3.axisBottom(xScale));

axes 
  .append("g")
  .call(d3.axisLeft(yScale).tickSize(0))