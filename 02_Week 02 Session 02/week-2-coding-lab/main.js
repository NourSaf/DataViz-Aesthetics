//we first npm install 
//then we ran npm run dev run host (this to run in it through vite app)
import "./style.css";
import * as d3 from "d3"; 

const body = d3.select("body").style("padding", "30px");

const title = body
  .append("h1")
  .style("font-size", "16px")
  .text("Week 2 - Code Lab - Drawing Shapes");

const svg = body
  .append("svg")
  .attr("viewBox", "0 0 600 400")
  .attr("width", 600)
  .attr("height", 400)
  .style("background", "white")
  .style("box-shadow", "0px 1px 2px #DDDDDD");

//we can also solve this with nasted for loop 
for (let i=0; i<400; i++){
  svg.append('circle')
  //mod % 20 to stop at 20 circels and start again  
    .attr('cx', i * 20 + 10)
    .attr('cy',Math.floor(i/20)*20+10)
    .attr('fill','white')
    .attr('stroke','black')
    .attr('r','10');
}