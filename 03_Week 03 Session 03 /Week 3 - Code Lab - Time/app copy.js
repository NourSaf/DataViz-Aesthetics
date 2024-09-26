import * as d3 from "d3";

const initialTime = Date.now();

const body = d3.select('body');

const clock = body.append('div').attr('id', 'clock');

function loop() {
    const date = new Date();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const delta = (Date.now() - initialTime);

    clock.html(`${hours}:${minutes}:${seconds} [Frame: ${delta}]`)

    window.requestAnimationFrame(loop);
}

loop();


const width  = 500;
const height = 500;

const myClock = body
  .append("svg")
  .attr("id", "clock")
  // cartesian coordinate plane
  .attr(
    "viewBox",
    `${width * 0.5 * -1} ${height * 0.5 * -1} ${width} ${height}`
  )
  .attr("width", width)
  .attr("height", height);


const mySec = myClock.append('g').attr('data-typ', 'seconds');
const defs = myClock.append("defs");

const gradient = defs.append("linearGradient")
    .attr("id", "grad1")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

gradient.append("stop")
    .attr("offset", "0%")
    .attr("style", "stop-color:red;stop-opacity:1");

gradient.append("stop")
    .attr("offset", "100%")
    .attr("style", "stop-color:orange;stop-opacity:1");

mySec
    .append('circle')
    .attr('cx', 10)
    .attr('cy', 10)
    .attr('r', 200)
    .attr('opacity', '1')
    .attr('fill', 'url(#grad1)');

function loop_mySec() {
    const date = new Date();
    const seconds = date.getSeconds();

    const degree = (seconds / 15) * 360;

    gradient
        .attr("x2", `${Math.cos(degree)}`)
        .attr("y2", `${Math.sin(degree)}`);

    window.requestAnimationFrame(loop_mySec);
}

loop_mySec();

const myMin = myClock.append('g').attr('data-typ', 'minutes');
const defsMin = myClock.append("defs");

const gradientMin = defsMin.append("linearGradient")
    .attr("id", "grad2")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

gradientMin.append("stop")
    .attr("offset", "0%")
    .attr("style", "stop-color:green;stop-opacity:1");

gradientMin.append("stop")
    .attr("offset", "100%")
    .attr("style", "stop-color:blue;stop-opacity:1");

myMin
    .append('circle')
    .attr('cx', 120)
    .attr('cy', 20)
    .attr('r', 100)
    .attr('opacity', '1')
    .attr('fill', 'url(#grad2)');

function loop_myMin() {
    const date = new Date();
    const minutes = date.getMinutes();

    const degree = (minutes / 60) * 360;

    gradientMin
    .attr("x2", `${Math.cos(degree)}`)
    .attr("y2", `${Math.sin(degree)}`);

    window.requestAnimationFrame(loop_myMin);
}

loop_myMin();
