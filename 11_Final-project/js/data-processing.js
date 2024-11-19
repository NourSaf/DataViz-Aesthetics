import * as d3 from "d3";

const data = await d3.csv('/data/data.csv')
console.log(data)

//first chart is stacked barchart each bar should show ethnicity general counts and euch gender stacked within.
//sum ethnicity to have a max value for each ethnicity. //the total height of each bar.
const sum_by_ethnicity = d3.rollup(data,
    (v) => v.length,
    (d) => d.complainant_ethnicity
);
console.log("Ethnicity sum",sum_by_ethnicity)

//echnicity and age to ages accross each ethnicity 
const ethnicity_age = d3.rollup(data,
    (v) => v.length,
    (d) => d.complainant_ethnicity,
    (e) => e.complainant_gender,
);
console.log("This is Ethnictiy/Age ---->", ethnicity_age)
 
//Array.from -> converts to array from an intrable
//goal to have an object I can use for the chart
const data_object =  Array.from(ethnicity_age,([ethnicity,gender]) => (
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










/*
Functions to use in this assignment
d3.extent() -> use in scales https://snyk.io/advisor/npm-package/d3/functions/d3.extent
*/

