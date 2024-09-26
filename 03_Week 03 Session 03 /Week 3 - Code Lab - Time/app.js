import * as d3 from "d3";

const myCanvas = d3.select('#canvas');

const width = 600; 
const height = 600;

const myClock = 
    myCanvas
        .append('svg')
        .attr('id','myClock')
        .attr('viewbox',`${width / 2 * -1} ${height / 2 * -1} ${width} ${width}`)
        .attr('width',`${width}`)
        .attr('height',`${height}`);


//clock's background        
const background = 
    myClock
        .append('rect') 
        .attr('width', `${width}`)
        .attr('height', `${height}`)
        .attr('fill', 'black');


//ARC seconds
const innerRadiusSec = 250;
const outerRadiusSec = innerRadiusSec + 10;
const secColor = 'rgb(227, 242, 253)';
const mySec =
    myClock
        .append('path')
        .attr('transform', `translate(${width/2},${height/2})`)
        .attr('fill',`${secColor}`);

//ARC Minutes
const innerRadiusMin = 190;
const outerRadiusMin = innerRadiusMin + 60;        
const minColor = 'rgb(82, 255, 184)';
const myMin =
    myClock
        .append('path')
        .attr('transform',`translate(${width/2},${height/2})`)
        .attr('fill',`${minColor}`);

//ARC Hours
const innerRadiusHour = 100;
const outerRadiusHour =  190; 
const hoursColor = "rgb(215, 38, 61)";
const myhour =
    myClock
        .append('path')
        .attr('transform',`translate(${width/2},${height/2})`)
        .attr('fill',`${hoursColor}`);



function getMyTime (){
    const date = new Date ();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const milliseconds = date.getMilliseconds();
    const totalSeconds = seconds + (milliseconds / 1000)
    
    mySec.attr('d', d3.arc () ({
        innerRadius: innerRadiusSec,
        outerRadius: outerRadiusSec,
        startAngle :0, 
        endAngle : ((Math.PI * 2) / 60 ) * totalSeconds 
    }));

    myMin.attr('d', d3.arc () ({
        innerRadius: innerRadiusMin,
        outerRadius: outerRadiusMin,
        startAngle :0, 
        endAngle : ((Math.PI * 2) / 60 ) * minutes 
    }));

    myhour.attr('d', d3.arc () ({
        innerRadius: innerRadiusHour,
        outerRadius: outerRadiusHour,
        startAngle :0, 
        endAngle : ((Math.PI * 2) / 24 ) * hours 
    }));

 

    window.requestAnimationFrame(getMyTime);
};

getMyTime();