import * as d3 from "d3";

const data = await d3.csv('/data/data.csv')
console.log("This is my data",data)

//first chart is stacked barchart each bar should show ethnicity general counts and euch gender stacked within.
//sum ethnicity to have a max value for each ethnicity. //the total height of each bar.
const ethnicity_complaints = d3.rollup(data,
    (v) => v.length,
    (d) => d.complainant_ethnicity
);
console.log("Total complaints by Ethnicity",ethnicity_complaints)

//echnicity and gender accross each ethnicity 
const ethnicity_gender = d3.rollup(data,
    (v) => v.length,
    (d) => d.complainant_ethnicity,
    (e) => e.complainant_gender,
);
console.log("This is Ethnictiy/Gender ---->", ethnicity_gender)

//Array.from -> converts to array from an the d3 map 
//goal to have an object I can use for the chart
const chart_one_processed =  Array.from(ethnicity_gender,([ethnicity, gender]) => (
        {
        ethnicity: ethnicity, 
        //converting the elemnts in the d3 rollup array of arrays map to object to easly work with 
        ...Object.fromEntries(gender)
        }
    )
)
console.log("This is chart's one data structure",chart_one_processed)
const chartOne_dataObject  = chart_one_processed
    .filter(d => d.ethnicity !== '')
    .flatMap(d => 
        Object.entries(d)
            .filter(([key]) => key !== 'ethnicity').map(([gender, total]) => ({
                ethnicity: d.ethnicity,
                gender: gender === '' ? 'Unkown' : gender,
                total: total
    }))
)

console.log("this is ChartOne Data Object Values", chartOne_dataObject)


//see documenation to create a stacked bar chart
//https://observablehq.com/@d3/stacked-bar-chart/2

const WIDTH = 800;
const HEIGHT = 500;
const MARGINS = {
    TOP:    10,
    RIGHT:  10,
    BOTTOM: 20,
    LEFT:   40,
};

//stacked barchart 
//geting the keys and vlaues for the values
//stack should be fixed -> it's returning a 0,0 key and not the actual values-
const series = d3.stack()
    .keys(d3.union(chartOne_dataObject.map(d => d.gender)))
    .value((d, key) => d[key] || 0) // get value for each series key and stack
    (d3.group(chartOne_dataObject, d => d.ethnicity));

console.log("This is series", series)

const group  = d3.union(chartOne_dataObject.map(d => d.gender))

console.log("This is keys", group)

//setting up the axes 
// x axes 
const xAxes = d3.scaleBand()
    .domain(d3.groupSort(chartOne_dataObject, D => -d3.sum(D, d => d.total), d => d.ethnicity))
    .range([MARGINS.LEFT, WIDTH - MARGINS.RIGHT])
    .padding(0.1);
// y axes 
const yAxes = d3.scaleLinear()
    .domain([0, d3.sum(chartOne_dataObject, d => d.total)])
    .rangeRound([HEIGHT - MARGINS.BOTTOM, MARGINS.TOP]);

    console.log("yAxes Domain Check",yAxes.domain())

const ChartOneColor = d3.scaleOrdinal()
    .domain(series.map(d => d.key))
    .range(d3.schemeSpectral[series.length]);
console.log("Colors Check", ChartOneColor.range())

const chartOneContainer = d3.select('#ChartOne')
    .append('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT)
    .attr('viewBox', [0, 0, WIDTH, HEIGHT])

// Append the horizontal axis.
chartOneContainer.append("g")
    .attr("transform", `translate(0,${HEIGHT - MARGINS.BOTTOM})`)
    .call(d3.axisBottom(xAxes).tickSizeOuter(0))

// Append the vertical axis.
chartOneContainer.append("g")
    .attr("transform", `translate(${MARGINS.LEFT},0)`)
    .call(d3.axisLeft(yAxes).ticks(null, "s"))

chartOneContainer.append('g')
    .selectAll('g')
    .data(series)
    .enter().append('g')
        .attr('fill', d => ChartOneColor(d.key))
        .selectAll('rect')
        .data(d => d)
        .enter().append('rect')
            .attr('x', d => xAxes(d.data.group))
            .attr('y', d => yAxes(d[1]))
            .attr('height', d => yAxes(d[0]) - yAxes(d[1]))
            .attr('width', xAxes.bandwidth())

// Add legend
const legend = chartOneContainer.append("g")
    .attr("font-family", "sans-serif")
    .attr("font-size", 10)
    .attr("text-anchor", "end")
    .selectAll("g")
    .data(group)
    .enter().append("g")
    .attr("transform", (d, i) => `translate(0,${i * 20})`);

legend.append("rect")
    .attr("x", WIDTH - 19)
    .attr("width", 19)
    .attr("height", 19)
    .attr("fill", ChartOneColor);

legend.append("text")
    .attr("x", WIDTH - 24)
    .attr("y", 9.5)
    .attr("dy", "0.32em")
    .text(d => d);

