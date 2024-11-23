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

console.log("this is male Values", chartOne_dataObject)






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

// const series = d3.stack()
//     .keys(d3.union(...chart_one_processed.map(d => Object.keys(d).filter(key => key !== 'ethnicity' && key !== ""))))
//     .value(([, D], key) => D[key] || 0); // get value for each series key and stack
//     (d3.index(chart_one_processed, d => d.ethnicity, d => Object.keys(d)));



const series = d3.stack()
    .keys(d3.union(chartOne_dataObject.map(d => d.gender)))
    .value((d, key) => d[key] || 0) // get value for each series key and stack
    (d3.group(chartOne_dataObject, d => d.ethnicity));
    
