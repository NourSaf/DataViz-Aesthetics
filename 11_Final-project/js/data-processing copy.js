import * as d3 from "d3";

const data = await d3.csv('/data/data.csv')
console.log(data)


//first chart is stacked barchart 
//sum ethnicity to have a max value for each ethnicity. //the total height of each bar.
const sum_by_ethnicity = d3.rollup(data,
    (v) => d3.sum(v, d => +d.complainant_age_incident),
    (d) => d.complainant_ethnicity
);
console.log("Ethnicity sum",sum_by_ethnicity)

//echnicity and age to ages accross each ethnicity 
const ethnicity_age = d3.rollup(data,
    (v) => v.length,
    (d) => d.complainant_ethnicity,
    (e) => e.complainant_age_incident,
);
console.log("This is Ethnictiy age -->",ethnicity_age)
 
//Array.from -> converts to array from an intrable
//goal to have an object 
const data_object =  Array.from(ethnicity_age,([ethnicity,age]) => ({
ethnicity: ethnicity, 
    //converting the elemnts in the d3 rollup array of arrays map to object to easly work with 
    ...Object.fromEntries(age)
}))
console.log("This is chart's one object",data_object)

const margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

const x = d3.scaleLinear()
    .range([0, width]);

const y = d3.scaleBand()
    .range([height, 0])
    .padding(0.1);

const color = d3.scaleOrdinal(d3.schemeCategory10);

const stack = d3.stack()
    .keys(Object.keys(data_object[0]).filter(key => key !== 'ethnicity'));

const series = stack(data_object);

x.domain([0, d3.max(series, d => d3.max(d, d => d[1]))]);
y.domain(data_object.map(d => d.ethnicity));
color.domain(series.map(d => d.key));

svg.selectAll(".serie")
  .data(series)
  .enter().append("g")
    .attr("class", "serie")
    .attr("fill", d => color(d.key))
  .selectAll("rect")
  .data(d => d)
  .enter().append("rect")
    .attr("y", d => y(d.data.ethnicity))
    .attr("x", d => x(d[0]))
    .attr("width", d => x(d[1]) - x(d[0]))
    .attr("height", y.bandwidth());

svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

svg.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(y));

//second chart 
//second chart https://d3js.org/d3-shape/stack#stackOffsetWiggle
//https://observablehq.com/@d3/stacked-bar-chart/2


//d3 extent use in scales https://snyk.io/advisor/npm-package/d3/functions/d3.extent