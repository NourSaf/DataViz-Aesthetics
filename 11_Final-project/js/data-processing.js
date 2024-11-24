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


//------------------------------------------
// FIRST CHART DATA PROCESSING
//------------------------------------------

/* 
The first chart is stacked barchart each bar should show ethnicity general counts and euch gender stacked within echnicity and gender accross each ethnicity 
first we have and we have mising values in the ethnicity we need to filter them out as well in the gender;
*/

function condition (d) {
    return d.complainant_ethnicity !== "" && d.complainant_gender !== "";
}

const filteredData_chartOne = data.filter(condition)
console.log(" This is filteredData_chartOne", filteredData_chartOne)

const ethnicity_gender = d3.rollup(filteredData_chartOne,
    (v) => v.length,
    (d) => d.complainant_ethnicity,
    (e) => e.complainant_gender
);
// console.log("This is Ethnictiy/Gender Map: ", ethnicity_gender)

/* 
/Converting the d3 InternMap to array of objects 
to have keys: ethnicty and values the gender
goal to have an array of objects
*/

const chart_one_processed =  Array.from(ethnicity_gender,([ethnicity, gender]) => (
        {
        ethnicity: ethnicity, 
        ...Object.fromEntries(gender)
        }
    )
)

const chartOneData  = chart_one_processed
    .flatMap(d => 
        Object.entries(d)
            .filter(([key]) => key !== 'ethnicity' && (key === 'Male' || key === 'Female'))
            .map(([gender, total]) => ({
                ethnicity: d.ethnicity,
                gender: gender,
                total: total
    }))
)
console.log("this is ChartOne Data Object structure", chartOneData)

//------------------------------------------
// For stacked bar chart or steamgraphs we should use stacked. 
// Stacked needs a map with keys and values. I will use flatRollup
// to construct the correct data structre to use in stacked 
//------------------------------------------

//values to use on each axes 
const xValue     = d => d.total;
const yValue     = d => d.ethnicity;
const colorValue = d => d.gender;

const grouped = d3.flatRollup(
    chartOneData,
    (values) => 
        new Map(
            values.map((d) => [colorValue(d), xValue(d)]),
        ),
    yValue,
)
console.log("This is grouped data: ",grouped)


const stacked = d3.stack()
    .keys(grouped[0][1].keys())
    .value((d, key) => d[1].get(key))(grouped);
console.log('This is Stacked',stacked)

//------------------------------------------------------------------------------------
// setting up scales, xScale, yScale and colorScale
//------------------------------------------------------------------------------------

const xScale = d3.scaleLinear()
    .domain(d3.extent(stacked.flat(2)))
    .range([MARGINS.LEFT, WIDTH - MARGINS.RIGHT])
// console.log("Check xScale is working -> ",xScale.range())

const yScale = d3.scaleBand()
    .domain(chartOneData.map(yValue))
    .range([HEIGHT - MARGINS.BOTTOM, MARGINS.TOP])
    .padding(0.2)
// console.log("Check yScale is working -> ",yScale.domain())


const colorScale = d3.scaleOrdinal()
    .domain(stacked.map(d => d.key))
    .range(["#6e40aa","#4c6edb","#23abd8","#1ddfa3","#52f667","#aff05b"]);
// console.log("Check if ColorScale is working", colorScale.domain())

//------------------------------------------------------------------------------------
// creating the bar using the processed data and scales ------
//------------------------------------------------------------------------------------

const chartOneContainer = d3.select('#ChartOne')
    .append('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT)
    .attr('viewBox', [0, 0, WIDTH, HEIGHT])

// Append the horizontal axis
chartOneContainer.append("g")
    .attr("transform", `translate(0,${HEIGHT - MARGINS.BOTTOM})`)
    .call(d3.axisBottom(xScale).tickSizeOuter(0))

// Append the vertical axis
chartOneContainer.append("g")
    .attr("transform", `translate(${MARGINS.LEFT},0)`)
    .call(d3.axisLeft(yScale).ticks(null, "s"))

// chartOneContainer.selectAll(".domain").remove();
// chartOneContainer.selectAll(".tick line").remove();

//------------------------------------------------------------------------------------
// Nesting the bars in groups for each gender a group 
//------------------------------------------------------------------------------------

chartOneContainer.append('g')
    .attr("class", "chartOne-group")
    .selectAll('g.stacks')
    .data(stacked)
    .join('g')
    .attr('class', ({key}) => key)
    .attr('fill', ({key}) => colorScale(key))
    .selectAll('rect')
        .data(d => d)
        .join('rect')
        .attr('x', ([x1]) => xScale(x1))
        .attr('y', ({data: [key]}) => yScale(key))
        .attr('class', ({data: [key]}) => key)
        .attr('width', ([x1, x2]) => xScale(x2) - xScale(x1))
        .attr('height', yScale.bandwidth())

//------------------------------------------------------------------------------------
// Adding a Legend 
//------------------------------------------------------------------------------------

const legend = chartOneContainer.append('g')
        .attr("text-anchor", "end")
        .selectAll('g')
        .data(stacked.map(d => d.key))
        .enter()
        .append('g')
        .attr("transform", (_, i) => `translate(0,${i * 20})`); 

     legend.append('rect')
        .attr('x', WIDTH - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", colorScale)

     legend.append('text')
        .attr('fill', 'white')
        .attr('x', WIDTH - 30)
        .attr('y', 9.5)
        .text(d => d)