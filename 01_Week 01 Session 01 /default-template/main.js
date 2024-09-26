import './style.css'

import * as d3 from 'd3';


// console.log(d3);

const app = d3.select("#app");

app
.append("h1")
.text("Hello, First Day")
.style("color","red");

app
.append('p')
.text("This is a paragraph")
;