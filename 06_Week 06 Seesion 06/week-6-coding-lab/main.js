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


//as the categories are too many I reduced the groups. 
//Added OTHER Group, in which all complaints are calculated that has from one till six complaints
let otherCount = 0; 
complaintType.forEach( ( value, key ) => {
  if ( value >= 1 && value <= 11){
    otherCount += value
    complaintType.delete(key)
  }
})
complaintType.set("Other", otherCount)
console.log('this is others', {otherCount})

//extract the categories and values from the data 
const complaintCat = Array.from(complaintType.keys());
console.log(complaintCat)
const complaintVal = Array.from(complaintType.values());
const [min,max] = d3.extent(complaintVal);
const color = d3.scaleOrdinal().domain(complaintCat).range(d3.schemeObservable10)

console.log("this is min & max",min,":", max)

//creates dynamic elements in the DOM 
const main = d3
  .select('#chartContainer')
  .style("padding","2em")
  .style("display", "flex")
  .style("align-items", "center")
  .style("flex-direction","column")
  
const legendContainer = d3
  .select('.legend')
  .style("display", "flex")
  .style("align-items", "left")
  .style("flex-direction","row")
  .style("padding-left","525px")

const header = 
  main
    .append("h1")
    .attr('class',"h1Header")
    .html('311 Service Requests')
    .style("font-size","3.2em")

  main
    .append("h2")
    .attr('class',"h2Header")
    .html('Complaints between July and Oktober 2024')
    .style("font-size","1.5em")
  
    main
    .append("h2")
    .attr('class',"h2Header")
    .html('Chart by: Nour AL Safadi,<br>This bar chart visualization presents data from the 311-Service-Requests API, capturing all service requests made between July and October 2024. It highlights key trends in the volume and types of complaints, with a special grouping: any complaint types that appear between one and six times are consolidated into an "OTHER" category, offering a clearer view of the more common complaint types.')
    .style("font-size","1.5em")
    .style("padding-left","460px")
    .style("padding-right","525px")



const svg = 
    main
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox",`0 0 ${width} ${height}`)
    .style("background-color", "black")
    .style("max-width", "100%")
    .style("height", "auto");

//legend
const legendHeight = 200, legendWidth = 200;
const legendDiv = 
legendContainer.append('svg')
    .attr('class', 'legend')
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .attr("viewBox",`${legendWidth  - 20 } 0 ${legendWidth} ${legendHeight}`)
    .style("background-color", "black")
    .style("max-width", "100%")
    .style("height", "auto")
    
    
    ;
      
//set up x and y axis 
const xScale = d3
  .scaleBand()
  .domain( complaintCat )
  .range( [ margin.left, width - margin.right ] )
  .padding( 0.05 )
  .round(true);

const yScale = d3
  .scaleLinear()
  .domain( [ max, 0 ]) 
  .range( [ margin.top, height - margin.bottom ] )
  .nice();

const legendScale = d3
  .scaleBand()
  .domain(complaintCat)
  .range([0, legendWidth])
  .padding(0.2)
  .round(true)

const bardata = Array.from(complaintType.entries()).sort((a, b) =>  b[1] -  a[1]);
console.log('this is bardata',bardata )
xScale.domain(bardata.map(d => d[0]));

const gridLines = svg.append('g').attr('data-component', 'grid-lines')
const axes = svg.append('g').attr('data-component','axes')
const bars =  svg.append('g').attr('data-component','bars')
const legend = legendDiv.append('g').attr('data-component','legend')

bars
  .append('g')
  .selectAll('rect')
  .data(bardata)
  .join('rect')
  .attr('x', (d) => xScale(d[0]))
  .attr('y', (d) => yScale(d[1]))
  .attr('width', xScale.bandwidth())
  .attr('height', (d) => height - margin.bottom - yScale(d[1]))
  .attr('fill', (d) => color(d[0]))
  .attr('rx',3);

const hideDefLines = (g) => {
  return g.select("path.domain").style('opacity',0)
}

const styleAxes = (g) => {
  return (
    g.selectAll('text')
    .attr('class', 'axesStyle')
    .attr('font-family','monospace')
  )
}  

gridLines
  .append('g')
  .attr('transform', `translate(${width - margin.left + 13.5} 0 )`)
  .call( d3.axisLeft(yScale)
          .tickSize(width - (margin.left + margin.right))
          .tickFormat("")
        )
  .call(hideDefLines)
  .attr('opacity',0.1)
  
axes
  .append('g')
  .attr('transform', `translate(0 ${height - margin.bottom})`)
  .call(d3.axisBottom(xScale))
  .call(hideDefLines)
  .call(styleAxes);

axes
  .append('g')
  .attr('transform', `translate(${margin.left} 0)`)
  .call(d3.axisLeft(yScale))
  .call(hideDefLines)
  .call(styleAxes);

legend
  .append('g')
  .selectAll('rect')
  .data(bardata)
  .join('rect')
  .attr('x', `${legendWidth  - 20 }`)
  .attr('y',(d) => legendScale(d[0]))
  .attr('width',"20px")
  .attr('height','20px')
  .attr('fill', (d) => color(d[0]))

legend
  .append('g')
  .attr('transform', `translate(${legendWidth} 0)`)
  .call(d3.axisRight(legendScale))
  .call(hideDefLines)
  .call(styleAxes);


  //https://d3-graph-gallery.com/graph/custom_legend.html
  