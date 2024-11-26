import * as d3 from "d3";

const WIDTH = 800;
const HEIGHT = 500;
const MARGINS = {
    TOP:    10,
    RIGHT:  10,
    BOTTOM: 20,
    LEFT:   40,
};

const data = await d3.csv('/data/data.csv')
//console.log("This is my data",data)

//first chart is stacked barchart each bar should show ethnicity general counts and euch gender stacked within.
//echnicity and gender accross each ethnicity 

//first we have and we have mising values in the ethnicity we need to filter them out;
const filteredData_chartOne = data.filter( function(d) {return d.ethnicity !== ""})
console.log("filteredData_chartOne")
console.log(filteredData_chartOne)

const ethnicity_gender = d3.rollup(data,
    (v) => v.length,
    (d) => d.complainant_ethnicity,
    (e) => e.complainant_gender
);
console.log("This is Ethnictiy/Gender Map")
console.log(ethnicity_gender)

//Array.from -> converts to array from an the d3 map 
//goal to have an object I can use for the chart
const chart_one_processed =  Array.from(ethnicity_gender,([ethnicity, gender]) => (
        {
        ethnicity: ethnicity, 
        ...Object.fromEntries(gender)
        }
    )
)
console.log("This is chart's one data structure",chart_one_processed)

const chartOne_dataObject  = chart_one_processed
    .filter(d => d.ethnicity !== '')
    .flatMap(d => 
        Object.entries(d)
            .filter(([key]) => key !== 'ethnicity' && (key === 'Male' || key === 'Female'))
            .map(([gender, total]) => ({
                ethnicity: d.ethnicity,
                gender: gender,
                total: total
    }))
)
console.log("this is ChartOne Data Object Values", chartOne_dataObject)

const yValue = d => d.ethnicity;
const xValue = d => d.total;
const colorValue = d => d.gender;

const grouped = d3.flatRollup(
    chartOne_dataObject,
    (values) => 
        new Map(
            values.map((d) => [colorValue(d), xValue(d)])
        ),
    yValue,
)
console.log("Grouped")
console.log(grouped)

const stacked = d3.stack()
    .keys(grouped[0][1].keys())
    .value((d, key) => d[1].get(key))(grouped);
console.log('This is Stacked')
console.log(stacked)

//
const xScale = d3.scaleLinear()
    .domain(d3.extent(stacked.flat(2)))
    .range([MARGINS.LEFT, WIDTH - MARGINS.RIGHT])

const yScale = d3.scaleBand()
    .domain(chartOne_dataObject.map(yValue))
    .range([HEIGHT - MARGINS.BOTTOM, MARGINS.TOP])
    .padding(0.2)
console.log("yScale")
console.log(yScale.domain())


const ChartOneColor = d3.scaleOrdinal()
    .domain(stacked.map(d => d.key))
    .range(["#ffeda0","#feb24c","#f03b20"]);
console.log("Colors Check", ChartOneColor.range())

const chartOneContainer = d3.select('#ChartOne')
    .append('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT)
    .attr('viewBox', [0, 0, WIDTH, HEIGHT])

// Append the horizontal axis.
chartOneContainer.append("g")
    .attr("transform", `translate(0,${HEIGHT - MARGINS.BOTTOM})`)
    .call(d3.axisBottom(xScale).tickSizeOuter(0))

// Append the vertical axis.
chartOneContainer.append("g")
    .attr("transform", `translate(${MARGINS.LEFT},0)`)
    .call(d3.axisLeft(yScale).ticks(null, "s"))

chartOneContainer.append('g')
    .selectAll('g.stacks')
    .data(stacked)
    .join('g')
    .attr('fill', ({key}) => ChartOneColor(key))
        .selectAll('rect')
        .data(d => d)
        .join('rect')
        .attr('x', ([x1])=> xScale(x1))
        .attr('y', ({data:[key]}) => yScale(key))
            .attr('width', ([x1, x2]) => xScale(x2) - xScale(x1))
            .attr('height', yScale.bandwidth())
