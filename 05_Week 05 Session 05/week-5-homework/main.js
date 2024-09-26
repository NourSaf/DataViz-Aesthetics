import "./style.css";
import * as d3 from "d3";

const RESOURCE_URL = 'https://data.cityofnewyork.us/resource/tg4x-b46p.json';

const data = await d3.json(RESOURCE_URL);

const groupedData = d3.group(
  data,
  (v) => v.length,
  (d) => d.category
);

console.log(groupedData)

const app = d3.select('#app');

app
.append('div')
.html(`Answer for prompt`)