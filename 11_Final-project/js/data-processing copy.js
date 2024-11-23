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
console.log("This is Ethnictiy/Age ---->", ethnicity_gender)
 
//Array.from -> converts to array from an intrable
//goal to have an object I can use for the chart
const data_object =  Array.from(ethnicity_gender,([ethnicity,gender]) => (
        {
        ethnicity: ethnicity, 
        //converting the elemnts in the d3 rollup array of arrays map to object to easly work with 
        ...Object.fromEntries(gender)
        }
    )
)
console.log("This is chart's one object",data_object)

//see documenation to create a stacked bar chart
//https://observablehq.com/@d3/stacked-bar-chart/2













//second chart
//second chart https://d3js.org/d3-shape/stack#stackOffsetWiggle
//steam graph that shows 10 years from 2010 to 2020 and compliant type
//Steamgraph documentation https://observablehq.com/@d3/streamgraph/2
//Stacking variations https://d3js.org/d3-shape/stack#stackOffsetWiggle

// +d ensures to treat the year as number
const years = data.filter((d) => +d.year_received >= 2009 && +d.year_received < 2020).sort((a,b) => a.year_received - b.year_received) 
console.log("this is year 2020",years)

const year_policeRankIncident = d3.rollup(
    years,
    (v) => v.length,
    (d) => d.year_received,
    (e) => e.fado_type,
)
console.log("years-type rollup",year_policeRankIncident);

//convert the map to an object
const year_rank_object = Array.from(year_policeRankIncident, ([year,type])=>(
        {
            year:year,
            ...Object.fromEntries(type)
        }
    )
)
console.log("this is my year-rank object",year_rank_object)

//third chart
//fado_type count and allegation for more understanding what each officer has done. 
// hierarchy https://d3js.org/d3-hierarchy
//d3 pack bubbel chart 

const fado_alligation = d3.rollup(data, 
    (v) => v.length,
    (d) => d.fado_type,
    (d) => d.allegation,
)
console.log("This is FADO/sAllegation Map", fado_alligation)

//parent child chirarhy name and children
const bubbelChartData = Array.from(fado_alligation, ([type, allegation]) => (
    {
        name: type,
        children: Array.from(allegation, ([name, value])=>(
            {
                name: name,
                value:value,
            }
        ))
    }
));
console.log("This is my bubbel chart object",bubbelChartData)



//Fourth Chart 
//Scatterplot data preparation for year_received and year_closed

//filter 10 years from 2009 to 2019 

// const years_filter = 
const scatter_data = d3.rollup(data,
    (v) => v.length,
    (d) => +d.year_received,
    (d) => +d.year_closed
);

const scatter_data_array = Array.from(scatter_data, ([year_received, year_closed]) => ({
    year: year_received,
    // year_closed: year_closed
    ...Object.fromEntries(year_closed)
}));

console.log("Scatterplot data", scatter_data_array);



// for the time started and time closed x axes -> time closed and y axes -> time opened


/*
Functions to use in this assignment
d3.extent() -> use in scales https://snyk.io/advisor/npm-package/d3/functions/d3.extent
https://observablehq.com/@mbostock/phases-of-the-moon
*/

