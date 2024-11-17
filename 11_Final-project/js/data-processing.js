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


//second chart