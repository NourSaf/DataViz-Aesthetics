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
////console.log("This is my data",data)


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
// //console.log(" This is filteredData_chartOne", filteredData_chartOne)

const ethnicity_gender = d3.rollup(filteredData_chartOne,
    (v) => v.length,
    (d) => d.complainant_ethnicity,
    (e) => e.complainant_gender
);
// //console.log("This is Ethnictiy/Gender Map: ", ethnicity_gender)

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
// //console.log("This is data procesed",chart_one_processed)

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
// //console.log("this is ChartOne Data Object structure", chartOneData)

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
// //console.log("This is chartOne_grouped data: ",chartOne_grouped)

const stacked_chartOne = d3.stack()
    .keys(chartOne_grouped[0][1].keys())
    .value((d, key) => d[1].get(key))(chartOne_grouped)
// //console.log('This is stacked_chartOne',stacked_chartOne)

//------------------------------------------------------------------------------------
// Setting up scales, xScale_chartOne, yScale_chartOne and colorScale_chartOne
//------------------------------------------------------------------------------------

const xScale_chartOne = d3.scaleLinear()
    .domain(d3.extent(stacked_chartOne.flat(2)))
    .range([MARGINS.LEFT, WIDTH - MARGINS.RIGHT])
// //console.log("Check xScale_chartOne is working -> ",xScale_chartOne.range())

const yScale_chartOne = d3.scaleBand()
    .domain(chartOneData.map(yValue_chartOne))
    .range([HEIGHT - MARGINS.BOTTOM, MARGINS.TOP])
    .padding(0.2)
// //console.log("Check yScale_chartOne is working -> ",yScale_chartOne.domain())


const colorScale_chartOne = d3.scaleOrdinal()
    .domain(stacked_chartOne.map(d => d.key))
    .range(["#F18E2C", "#E15759"]);
    
// //console.log("Check if ColorScale_chartOne is working", colorScale_chartOne.domain())

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

function onHover (d){
    return d[1] - d[0]
}

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
        .on('mouseover', function(_, d) {
            d3.select(this).attr('opacity', 0.4);
            //console.log(onHover(d))
        })
        .on('mouseout', function(event, d) {
            d3.select(this).attr('opacity', 1);
        });


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
//console.log("This is year type Map", year_type)

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

//console.log("This is second chart Data", secondChartData)

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
//console.log("This is secondChart_Group", secondChart_group)

//Stacked function 
//Here for the steam graph we need .offset and .order 
const stacked_secondChart = d3.stack()
    .offset(d3.stackOffsetWiggle)
    .order(d3.stackOrderInsideOut)
    .keys(secondChart_group[0][1].keys())
    .value((d, key) => d[1].get(key))(secondChart_group)
// //console.log("This is second Chart Stacked", stacked_secondChart)

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

const sec_chartContainer = d3.select('#chartTwo')
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
const fado_alligation = d3.rollup(data, 
    (v) => v.length,
    (d) => d.fado_type,
    (d) => d.allegation,
)
// console.log("This is FADO/sAllegation Map", fado_alligation)

//parent child chirarhy name and children
const tree_data = Array.from(fado_alligation, ([type, allegation]) => (
    {
        name: type,
        children: Array.from(allegation, ([name, value])=>(
            { 
                name: name,
                total:value,
            }
        ))
    }
));
// console.log("This is my bubbel chart object",tree_data)

//------------------------------------------------------------------------------------
// Creating a Treemap 
//------------------------------------------------------------------------------------

const treeH = 1200; 
const treeW = 1200;
const treeL = 100; 

const tree_container = d3.select('#chartThree')
    .append('svg')
    .attr('height', treeH)
    .attr('width', treeW)
    .attr('viewBox', [0, 0, treeH, treeW])

const tree_color = d3.scaleOrdinal(d3.schemeTableau10)

//------------------------------------------------------------------------------------
// setting the data up for a hierarchy chart use in this case treemap
//------------------------------------------------------------------------------------

const hierarchy = d3.hierarchy({children : tree_data})
    .sum(d => d.total)
    .sort((a,b) => b.value - a.value);
// //console.log("hierarchy",hierarchy)


const treemap = d3.treemap()
    .size([treeW, treeH - treeL])
    .paddingInner(1)
    (hierarchy)

//------------------------------------------------------------------------------------
// going to the depth of the treemap to have childeren and parents data seperatly 
//------------------------------------------------------------------------------------

const parentArray = treemap.descendants().filter(d => d.depth==1);
const childerenArray = treemap.descendants().filter(d => d.depth==2);

const matchParent = (type) => {
    const paAr = parentArray.findIndex(d => d.data.name == type);
    return paAr
}

//------------------------------------------------------------------------------------
// drawing the treemap 
//------------------------------------------------------------------------------------
const cells = tree_container.selectAll('.cells')
    .data(childerenArray)
    .enter()
    .append('rect')
    .attr('x', d => d.x0)
    .attr('y', d => d.y0)
    .attr('width', d => (d.x1 - d.x0))
    .attr('height', d => (d.y1 - d.y0))
    .style('stroke', '#111111')
    .style('fill', d => tree_color(matchParent(d.parent.data.name)));

tree_container.selectAll('text')
    .data(childerenArray)
    .enter()
    .append('text')
    .attr('x', d => (d.x0 + 20))
    .attr('y', d => (d.y0 + 25))
    .attr('text-anchor','left')
    .attr('fill', 'black')
    .text(d => d.data.name + " - " +  d.data.total)


//------------------------------------------------------------------------------------
// Adding a legend for the treemap 
// https://www.youtube.com/watch?v=60HBKI5VV_4 (treemap tutorial)
// https://www.youtube.com/watch?v=jfpV7OBptYE
//------------------------------------------------------------------------------------

const legend_tree = tree_container.append('g')
    .attr('class', 'tree-legend')
    .selectAll('g')
    .data(parentArray)
    .enter()
    .append('g')
    .attr('transform', (_, i) => `translate(0,${i * 20})`);

legend_tree.append('rect')
    .attr('x', treeW -19)
    .attr('width', 19)
    .attr('height', 19)
    .attr('fill', d => tree_color(parentArray.indexOf(d)));

legend_tree.append('text')
    .attr('x', treeW - 24)
    .attr('y', 9.5)
    .attr('dy', '0.32em')
    .attr('text-anchor', 'end')
    .text(d => d.data.name);


//------------------------------------------------------------------------------------
// Fourth Chart -> Bubbel chart -> prepare the data 
//------------------------------------------------------------------------------------

//hierarchy -> police rank -> total abuse -> each type of abuse -> count of each abuse 

function dataFilterCondition (d){
    return d.rank_incident !== "Deputy Inspector"  && d.rank_incident !== "Chiefs and other ranks" && d.rank_incident !=="Deputy Inspector" && d.rank_incident !== "Inspector";
}
const filteredDataBubbel = data.filter(dataFilterCondition)
const bubbelDataRollup = d3.rollup(filteredDataBubbel, 
    (v) => v.length,
    (d) => d.rank_incident,
    (c) => c.fado_type,
 )
// console.log("This is data", bubbelDataRollup)

const bubbelMap = Array.from(bubbelDataRollup, ([rank, types]) => ({
    rank:rank,
    children: Array.from(types, ([type, total]) => ({
        type:type,
        total:total
    }))
    
}))
console.log("this is Ranks", bubbelMap)

//––––––––––––––––––––––––––––––––––––––––––––––––––––––
// Setup chart's dimentions 
//––––––––––––––––––––––––––––––––––––––––––––––––––––––

const bubbelW = 800, bubbelH = 800;

const bubbel_container = d3.select('#chartFour')
    .append('svg')
    .attr('width', bubbelW)
    .attr('height', bubbelH)
    .attr('viewBox', [0, 0, bubbelH, bubbelW])

//––––––––––––––––––––––––––––––––––––––––––––––––––––––
// Setup color scale
//––––––––––––––––––––––––––––––––––––––––––––––––––––––

const bubbelColor = d3.scaleOrdinal(d3.schemeTableau10)

//––––––––––––––––––––––––––––––––––––––––––––––––––––––
// Setup hiererchy for the data and pack for the containment nesting 
//––––––––––––––––––––––––––––––––––––––––––––––––––––––

const bubbelHierarchy = d3.hierarchy({children : bubbelMap})
    .sum(d => d.total)
    .sort((a,b) => b.value - a.value)

console.log("this is bubbel hieraaryl", bubbelHierarchy)

const bubbelPack = data => d3.pack()
    .size([bubbelW, bubbelH])
    .padding(3)
    (d3.hierarchy(data)
        .sum(d => d.value)
        .sort((a,b) => b.value - a.value)
    );

const  root = bubbelPack(bubbelHierarchy)
console.log("this is pack", root)

const packed = d3.pack()
    .size([bubbelW, bubbelH])
    .padding(3)
    (bubbelHierarchy)
console.log("This is packed", packed)

const node = bubbel_container.selectAll("g")
    .data(packed.descendants())
    .enter().append("g")
    .attr("transform", d => `translate(${d.x},${d.y})`);

node.append("circle")
    .attr("r", d => d.r)
    .attr("fill", d => d.children ? bubbelColor(d.data.rank) : bubbelColor(d.data.type))
    // .attr("stroke", d => d.children );

node.append("text")
    .attr("dy", "0.3em")
    .attr("text-anchor", "middle")
    .text(d => d.children ? "" : d.data.type)
    .style("fill", "black");

//------------------------------------------------------------------------------------
// Adding a legend for the bubble chart
//------------------------------------------------------------------------------------
const uniqueTypes = Array.from(new Set(packed.descendants().filter(d => !d.children).map(d => d.data.type)));

const legend_bubble = bubbel_container.append('g')
    .attr('class', 'bubble-legend')
    .selectAll('g')
    .data(uniqueTypes)
    .enter()
    .append('g')
    .attr('transform', (_, i) => `translate(0,${i * 20})`);

legend_bubble.append('rect')
    .attr('x', 20)
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', d => bubbelColor(d));

legend_bubble.append('text')
    .attr('x', 60)
    .attr('y', 10)
    .attr('dy', '0.32em')
    .attr('text-anchor', 'start')
    .text(d => d)
    .attr('fill', 'white');

const legend_rank = bubbel_container.append('g')
    .attr('class', 'rank-legend')
    .selectAll('g')
    .data(bubbelMap)
    .enter()
    .append('g')
    .attr('transform', (_, i) => `translate(0, ${i * 20})`);

legend_rank.append('rect')
    .attr('x', 20)
    .attr('y', 100)
    .attr('width', 20)
    .attr('height', 20)
    .attr('fill', d => bubbelColor(d.rank));

legend_rank.append('text')
    .attr('x', 60)
    .attr('y', 110)
    .attr('dy', '0.32em')
    .attr('text-anchor', 'start')
    .text(d => d.rank)
    .attr('fill', 'white');




