import "./variables"
import "./style.css";
import * as d3 from "d3";
import { height, width } from "./variables";

//The API link of 311-Service-Requests. Query: all data points between July and Oktober 2024
const URL = 'https://data.cityofnewyork.us/resource/erm2-nwe9.json?$query=SELECT%0A%20%20%60unique_key%60%2C%0A%20%20%60created_date%60%2C%0A%20%20%60closed_date%60%2C%0A%20%20%60agency%60%2C%0A%20%20%60agency_name%60%2C%0A%20%20%60complaint_type%60%2C%0A%20%20%60descriptor%60%2C%0A%20%20%60location_type%60%2C%0A%20%20%60incident_zip%60%2C%0A%20%20%60incident_address%60%2C%0A%20%20%60street_name%60%2C%0A%20%20%60cross_street_1%60%2C%0A%20%20%60cross_street_2%60%2C%0A%20%20%60intersection_street_1%60%2C%0A%20%20%60intersection_street_2%60%2C%0A%20%20%60address_type%60%2C%0A%20%20%60city%60%2C%0A%20%20%60landmark%60%2C%0A%20%20%60facility_type%60%2C%0A%20%20%60status%60%2C%0A%20%20%60due_date%60%2C%0A%20%20%60resolution_description%60%2C%0A%20%20%60resolution_action_updated_date%60%2C%0A%20%20%60community_board%60%2C%0A%20%20%60bbl%60%2C%0A%20%20%60borough%60%2C%0A%20%20%60x_coordinate_state_plane%60%2C%0A%20%20%60y_coordinate_state_plane%60%2C%0A%20%20%60open_data_channel_type%60%2C%0A%20%20%60park_facility_name%60%2C%0A%20%20%60park_borough%60%2C%0A%20%20%60vehicle_type%60%2C%0A%20%20%60taxi_company_borough%60%2C%0A%20%20%60taxi_pick_up_location%60%2C%0A%20%20%60bridge_highway_name%60%2C%0A%20%20%60bridge_highway_direction%60%2C%0A%20%20%60road_ramp%60%2C%0A%20%20%60bridge_highway_segment%60%2C%0A%20%20%60latitude%60%2C%0A%20%20%60longitude%60%2C%0A%20%20%60location%60%0AWHERE%0A%20%20(%60complaint_type%60%20IS%20NOT%20NULL)%0A%20%20AND%20(%60created_date%60%0A%20%20%20%20%20%20%20%20%20BETWEEN%20%222024-07-01T23%3A35%3A24%22%20%3A%3A%20floating_timestamp%0A%20%20%20%20%20%20%20%20%20AND%20%222024-10-03T23%3A35%3A24%22%20%3A%3A%20floating_timestamp)%0AORDER%20BY%20%60created_date%60%20DESC%20NULL%20FIRST'

// async function to fetch's the data from URL
const dataFetch = async () => {
  const data = await d3.json(URL)
  console.log(data)
  return data
}
//activate dataFetch then work with data when data the promis is returned.
//also cleans data a bit
dataFetch().then((data) => {
 const complaintType = d3.rollup(data, 
  (v) => v.length,
  (d) => {
    const type = d["complaint_type"];
    let typeWater = /water/i;
    let street = /street/i;
    let sideWalk = /sidewalk/i;
    let noise  = /noise/i
    let dirty = /dirty/i;
    let food = /food/i;
  
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
    };
    return type
  });
  console.log(" –> Complaint Type Count ", complaintType)
   
})

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

  main
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox",`0 0 ${width} ${height}`)
    .style("background-color", "white")
    .style("max-width", "100%")
    .style("height", "auto");

//set up x and y axis 