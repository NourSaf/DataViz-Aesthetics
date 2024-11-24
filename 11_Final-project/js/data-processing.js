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
The first chart is stacked_chartOne barchart each bar should show ethnicity general counts and euch gender stacked_chartOne within echnicity and gender accross each ethnicity 
first we have and we have mising values in the ethnicity we need to filter them out as well in the gender;
*/

function condition (d) {
    return d.complainant_ethnicity !== "" && d.complainant_gender !== "";
}

const filteredData_chartOne = data.filter(condition)
// console.log(" This is filteredData_chartOne", filteredData_chartOne)

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
// console.log("This is data procesed",chart_one_processed)

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
// console.log("this is ChartOne Data Object structure", chartOneData)

//------------------------------------------
// For stacked_chartOne bar chart or steamgraphs we should use stacked_chartOne. 
// stacked_chartOne needs a map with keys and values. I will use flatRollup
// to construct the correct data structre to use in stacked_chartOne 
//------------------------------------------

//values to use on each axes 
const xValue_chartOne     = d => d.total;
const yValue_chartOne     = d => d.ethnicity;
const colorValue_chartOne = d => d.gender;

const chartOne_grouped = d3.flatRollup(
    chartOneData,
    (values) => 
        new Map(
            values.map((d) => [colorValue_chartOne(d), xValue_chartOne(d)]),
        ),
    yValue_chartOne,
)
// console.log("This is chartOne_grouped data: ",chartOne_grouped)

const stacked_chartOne = d3.stack()
    .keys(chartOne_grouped[0][1].keys())
    .value((d, key) => d[1].get(key))(chartOne_grouped)
// console.log('This is stacked_chartOne',stacked_chartOne)

//------------------------------------------------------------------------------------
// Setting up scales, xScale_chartOne, yScale_chartOne and colorScale_chartOne
//------------------------------------------------------------------------------------

const xScale_chartOne = d3.scaleLinear()
    .domain(d3.extent(stacked_chartOne.flat(2)))
    .range([MARGINS.LEFT, WIDTH - MARGINS.RIGHT])
// console.log("Check xScale_chartOne is working -> ",xScale_chartOne.range())

const yScale_chartOne = d3.scaleBand()
    .domain(chartOneData.map(yValue_chartOne))
    .range([HEIGHT - MARGINS.BOTTOM, MARGINS.TOP])
    .padding(0.2)
// console.log("Check yScale_chartOne is working -> ",yScale_chartOne.domain())


const colorScale_chartOne = d3.scaleOrdinal()
    .domain(stacked_chartOne.map(d => d.key))
    .range(["#6e40aa","#4c6edb","#23abd8","#1ddfa3","#52f667","#aff05b"]);
// console.log("Check if ColorScale_chartOne is working", colorScale_chartOne.domain())

//------------------------------------------------------------------------------------
// Creating the bar using the processed data and scales
//------------------------------------------------------------------------------------

const chartOneContainer = d3.select('#ChartOne')
    .append('svg')
    .attr('width', WIDTH)
    .attr('height', HEIGHT)
    .attr('viewBox', [0, 0, WIDTH, HEIGHT])

// Append the horizontal axis
chartOneContainer.append("g")
    .attr("transform", `translate(0,${HEIGHT - MARGINS.BOTTOM})`)
    .call(d3.axisBottom(xScale_chartOne).tickSizeOuter(0))

// Append the vertical axis
chartOneContainer.append("g")
    .attr("transform", `translate(${MARGINS.LEFT},0)`)
    .call(d3.axisLeft(yScale_chartOne).ticks(null, "s"))

// chartOneContainer.selectAll(".domain").remove();
// chartOneContainer.selectAll(".tick line").remove();

//------------------------------------------------------------------------------------
// Nesting the bars in groups for each gender a group 
//------------------------------------------------------------------------------------

chartOneContainer.append('g')
    .attr("class", "chartOne-group")
    .selectAll('g.stacks')
    .data(stacked_chartOne)
    .join('g')
    .attr('class', ({key}) => key)
    .attr('fill', ({key}) => colorScale_chartOne(key))
    .selectAll('rect')
        .data(d => d)
        .join('rect')
        .attr('x', ([x1]) => xScale_chartOne(x1))
        .attr('y', ({data: [key]}) => yScale_chartOne(key))
        .attr('class', ({data: [key]}) => key)
        .attr('width', ([x1, x2]) => xScale_chartOne(x2) - xScale_chartOne(x1))
        .attr('height', yScale_chartOne.bandwidth())

//------------------------------------------------------------------------------------
// Adding a Legend_chartOne //https://www.youtube.com/watch?v=lAOgD_udvTw adds hover effect 
//------------------------------------------------------------------------------------

const legend_chartOne = chartOneContainer.append('g')
        .attr("text-anchor", "end")
        .selectAll('g')
        .data(stacked_chartOne.map(d => d.key))
        .enter()
        .append('g')
        .attr("transform", (_, i) => `translate(0,${i * 20})`); 

     legend_chartOne.append('rect')
        .attr('x', WIDTH - 19)
        .attr("width", 19)
        .attr("height", 19)
        .attr("fill", colorScale_chartOne)

     legend_chartOne.append('text')
        .attr('fill', 'white')
        .attr('x', WIDTH - 30)
        .attr('y', 9.5)
        .text(d => d)


//------------------------------------------------------------------------------------
// Second Chart: Steam Graph chart
// Shows 10 years_secondChart from 2010 to 2020 and compliant type
// references 
// https://observablehq.com/@d3/streamgraph/2
// https://d3js.org/d3-shape/stack#stackOffsetWiggle
//------------------------------------------------------------------------------------

//Filter the years we want to map
const years_secondChart = data
    .filter((d) =>  +d.year_received < 2019)
    .sort((a,b) => a.year_received - b.year_received) 


const year_type = d3.rollup(
    years_secondChart,
        (v) => v.length,
        (d) => d.year_received,
        (e) => e.fado_type,
)
console.log("This is year type Map", year_type)

//convert the map to an object
const year_type_objects = Array.from(year_type, ([year,type])=>(
        {
            date:year,
            ...Object.fromEntries(type)
        }
    )
)
console.log("This is year type array of objects", year_type_objects)

const secondChartData = year_type_objects
    .flatMap(d => Object.entries(d)
        .filter(([key]) => key !== 'date')
        .map(([type, total]) => ({
            date: d.date, 
            type:type, 
            total:total
        })))

console.log("This is second chart Data", secondChartData)

//------------------------------------------------------
// Prepare data for stacked and get the values for axex
//------------------------------------------------------

//get the values for the axes 

const xValue_secondChart     = d => d.total;
const yValue_secondChat      = d => d.date;
const colorValue_secondCahrt = d => d.type;

//Prepare a map for the stacked function 
const secondChart_group = d3.flatRollup(
    secondChartData, 
    (values) => 
        new Map (
            values.map((d) => [colorValue_secondCahrt(d), xValue_secondChart(d)]) 
        ),
        yValue_secondChat,
)
console.log("This is secondChart_Group", secondChart_group)

//Stacked function 
//Here for the steam graph we need .offset and .order 
const stacked_secondChart = d3.stack()
    .offset(d3.stackOffsetWiggle)
    .order(d3.stackOrderInsideOut)
    .keys(secondChart_group[0][1].keys())
    .value((d, key) => d[1].get(key))(secondChart_group)
console.log("This is second Chart Stacked", stacked_secondChart)


//------------------------------------------------------------------------------------
// Setting up scales for the second chart
//------------------------------------------------------------------------------------
const sec_WIDTH = 1200;
const sec_HEIGHT = 600;
const sec_MARGINS = {
    TOP:    10,
    RIGHT:  10,
    BOTTOM: 20,
    LEFT:   40,
};

const xScale_secondChart = d3.scaleUtc()
    .domain(d3.extent(secondChartData, d => +d.date ))
    .range([sec_MARGINS.LEFT, sec_WIDTH - sec_MARGINS.RIGHT]);

const yScale_secondChart = d3.scaleLinear()
    .domain(d3.extent(stacked_secondChart.flat(2)))
    .rangeRound([sec_HEIGHT - sec_MARGINS.BOTTOM, sec_MARGINS.TOP]);

const colorScale_secondChart = d3.scaleOrdinal()
    .domain(stacked_secondChart.map(d => d.key))
    .range(d3.schemeTableau10);

//we nead an area for stream graphs 
const area_secondChart = d3.area()
    .x( d => xScale_secondChart(d.data[0]))
    .y0(d => yScale_secondChart(d[0]))
    .y1(d => yScale_secondChart(d[1]));

const sec_chartContainer = d3.select('#chartTow')
    .append('svg')
    .attr('width', sec_WIDTH)
    .attr('height', sec_HEIGHT)
    .attr('viewBox', [0,0, sec_WIDTH, sec_HEIGHT])

//Y axes 
sec_chartContainer.append('g')
    .attr('transform', `translate(${sec_MARGINS.LEFT}, 0)`)
    .call(d3.axisLeft(yScale_secondChart).ticks(sec_HEIGHT/80).tickFormat((d) => Math.abs(d).toLocaleString("en-US")))
    .call(g => g.select('.dmian').remove())
    .call(g => g.selectAll('.tick line').clone()
        .attr('x2', sec_WIDTH - sec_MARGINS.LEFT - sec_MARGINS.RIGHT)
        .attr('strock-opacity',0.1)
    )
    .call(d => d.append("text")
        .attr("x", -sec_MARGINS.LEFT)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text("↑ FADO Type")
    )

// X axes
sec_chartContainer.append("g")
    .attr("transform", `translate(0,${sec_HEIGHT - sec_MARGINS.BOTTOM})`)
    //xScale_secondChart
    .call(d3.axisBottom(xScale_secondChart).tickSizeOuter(0))
    .call(g => g.select(".domain").remove());

// append path for each stacked element
sec_chartContainer.append('g')
    .selectAll()
    .data(stacked_secondChart)
    .join('path')
        .attr('fill', d => colorScale_secondChart(d.key))
        .attr('d', area_secondChart)
    .append('title')
        .text(d => d.key)


//------------------------------------------------------------------------------------
// Adding a sec_legend
//------------------------------------------------------------------------------------


const sec_legend = sec_chartContainer.append('g')
        .attr('class', 'second-legend')  
        // .attr("text-anchor", "start")
        // .attr("x", )
        .selectAll('g')
        .data(stacked_secondChart.map(d => d.key))
        .enter()
        .append('g')
        .attr("transform", (_, i) => `translate(0,${i * 20})`)
        

    sec_legend.append('rect')
        .attr('x', sec_MARGINS.LEFT + 50)
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", colorScale_secondChart)

    sec_legend.append('text')
        .attr('fill', 'white')
        .attr('x', sec_MARGINS.LEFT + 70)
        .attr('y', 11)
        .text(d => d)
    
//------------------------------------------------------------------------------------
// Note: every FADO type should be explaind with text.
// https://www.youtube.com/playlist?list=PLdJuTVexUXU3pShDMI9kbRJ8QjfWCLcQ1 (Interaction)
// https://www.youtube.com/watch?v=M3kbQnXeFnY
//------------------------------------------------------------------------------------
