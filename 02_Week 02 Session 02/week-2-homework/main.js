import "./style.css";
import * as d3 from "d3";

// _______________________________________________________________
// Sketch 1
const sketch01 = d3
    .select('#sketch-1')
    .append('svg')
    .attr('viewBox', '0 0 100 100')
    .style('width', '100%')
    .style('height', '100%')
    ;

sketch01
    .append('g')
    .attr('transform', "translate(50 50)")
    .append('rect')
    .attr('width', 65)
    .attr('height', 34)
    .attr('fill', 'rgb(43,42,48)')
    .attr('x', -32.5)
    .attr('y', 18.4);

sketch01
    .append('g')
    .attr('transform', "translate(50 50)")
    .append('rect')
    .attr('width', 65)
    .attr('height', 60)
    .attr('fill', 'rgb(61,62,90)')
    .attr('x', -32.5)
    .attr('y', -50);

var angel01 = [22, 55];
var angel02 = [32.5, 11];
var angel03 = [42, 55];
sketch01
    .append('polygon')
    .attr('points', [angel01,angel02,angel03])
    .attr('fill', 'rgb(227,227,227)')

var angel01 = [6.5, 4.5];
var angel02 = [26, 4.5];
var angel03 = [16.5, -39];
sketch01
    .append('g')
    .attr('transform', "translate(50 50)")
    .append('polygon')
    .attr('points', [angel01,angel02,angel03])
    .attr('fill', 'rgb(227,227,227)')

for (let i = 0; i<9;i++) {
    sketch01
        .append('rect')
        .attr('width', 4.2)
        .attr('height', 4.2)
        .attr('fill', 'rgb(227,227,227)')
        .attr('x', (100/2)-2.5)
        .attr('y', i * 6.6 );
}

sketch01
    .append('rect')
    .attr('width', 4.2)
    .attr('height', 4.2)
    .attr('fill', 'rgb(61,62,90)')
    .attr('x', (100/2)-2.5)
    .attr('y', 61.8);

sketch01
    .append('rect')
    .attr('width', 0.5)
    .attr('height', 100)
    .attr('fill', 'black')
    .attr('x', 82)
    .attr('y', 0);

for (let i = 0; i<5;i++) {
        sketch01
            .append('rect')
            .attr('width', 4.2)
            .attr('height', 4.2)
            .attr('fill', 'rgb(227,227,227)')
            .attr('x', (100/2)-2.5)
            .attr('y', i * 6.6 + 70);
}




/* Sketch 2 
______________________________________________________________________*/ 
const sketch02 = d3
    .select('#sketch-2')
    .append('svg')
    .attr('viewBox', '0 0 100 100')
    .style('width', '100%')
    .style('height', '100%')
    .append('g')
    .attr('transform', "translate(50 50)");

//rects left side
sketch02
    .append('rect')
    .attr('width', 30.5)
    .attr('height', 20)
    .attr('fill', 'rgb(183,192,216)')
    .attr('x', -34.3)
    .attr('y', -50);


sketch02
    .append('rect')
    .attr('width', 30.5)
    .attr('height', 50)
    .attr('fill', 'rgb(67,85,116)')
    .attr('x', -34.3)
    .attr('y', -28);

sketch02
    .append('rect')
    .attr('width', 30.5)
    .attr('height', 30)
    .attr('fill', 'rgb(155,166,179)')
    .attr('x', -34.3)
    .attr('y', +21);

//right side 
sketch02
    .append('rect')
    .attr('width', 39.5)
    .attr('height', 10)
    .attr('fill', 'rgb(173,81,56)')
    .attr('x', -5.3)
    .attr('y', -50);

sketch02
    .append('rect')
    .attr('width', 39.5)
    .attr('height', 52)
    .attr('fill', 'rgb(151,161,172)')
    .attr('x', -5.3)
    .attr('y', -39.5);

sketch02
    .append('rect')
    .attr('width', 39.5)
    .attr('height', 25.7)
    .attr('fill', 'rgb(188,196,214)')
    .attr('x', -5.3)
    .attr('y', 12.1);

sketch02
    .append('rect')
    .attr('width', 39.5)
    .attr('height', 15)
    .attr('fill', 'rgb(175,167,96)')
    .attr('x', -5.3)
    .attr('y', 37.5);

sketch02
    .append('rect')
    .attr('width', 25)
    .attr('height', 15)
    .attr('fill', 'rgb(30,30,30)')
    .attr('x', -5.3)
    .attr('y', 37.5);

   
//black lines   
//vartical 
sketch02
    .append('rect')
    .attr('width', 2)
    .attr('height', 100)
    .attr('fill', 'black')
    .attr('x', -5.5)
    .attr('y', -50);

sketch02
    .append('rect')
    .attr('width', 2)
    .attr('height', 72.4)
    .attr('fill', 'black')
    .attr('x', -32.5)
    .attr('y', -30);

sketch02
    .append('rect')
    .attr('width', 2)
    .attr('height', 72.4)
    .attr('fill', 'black')
    .attr('x', 19)
    .attr('y', 38);


//horizontal
sketch02
    .append('rect')
    .attr('width', 30.5)
    .attr('height', 2)
    .attr('fill', 'black')
    .attr('x', -34.3)
    .attr('y', -36);

sketch02
    .append('rect')
    .attr('width', 39.5)
    .attr('height', 2)
    .attr('fill', 'black')
    .attr('x', -5.3)
    .attr('y', -41);

sketch02
    .append('rect')
    .attr('width', 30.5)
    .attr('height', 2)
    .attr('fill', 'black')
    .attr('x', -34.3)
    .attr('y', -30);


sketch02
    .append('rect')
    .attr('width', 63)
    .attr('height', 2)
    .attr('fill', 'black')
    .attr('x', -32)
    .attr('y', 11);

sketch02
    .append('rect')
    .attr('width', 30.5)
    .attr('height', 2)
    .attr('fill', 'black')
    .attr('x', -34.3)
    .attr('y', 21);

sketch02
    .append('rect')
    .attr('width', 36.9)
    .attr('height', 2)
    .attr('fill', 'black')
    .attr('x', -3.8)
    .attr('y', 36.7);

sketch02
    .append('rect')
    .attr('width', 30.5)
    .attr('height', 2)
    .attr('fill', 'black')
    .attr('x', -34.3)
    .attr('y', 41);







// ____________________________________________________________
// Sketch 3
const sketch03 = d3
    .select('#sketch-3')
    .append('svg')
    .attr('viewBox', '0 0 100 100')
    .style('width', '100%')
    .style('height', '100%')
    .append('g')
    .attr('transform','translate(50,50)')
    ;

sketch03
    .append('rect')
    .attr('width', 100)
    .attr('height', 76)
    .attr('fill', 'rgb(139,155,168)')

    .attr('x', -50)
    .attr('y', -38);
            
//three circels to vartical to the left
for (let i =0; i<3;i++) {
    sketch03
        .append('circle')
        .attr('fill', "rgb(214,214,208)")
        .attr('cy', i * 8. +10)
        .attr('cx', -37)
        .attr('r',4);

}

var arcValues = [-37,10]
sketch03
    .append('g')
    .attr('transform',"translate(" + arcValues[0] + "," +  arcValues[1]  + ")")
    .append("path")
    .attr(
        "d", d3.arc()
        .innerRadius( 0 )
        .outerRadius( 4 )
        .startAngle( 0 )     
        .endAngle( Math.PI * 2 )
        
    )
    .attr('fill','rgb(214,214,208)');

var arcValues = [-37,10]
sketch03
    .append('g')
    .attr('transform',"translate(" + arcValues[0] + "," +  arcValues[1]  + ")")
    .append("path")
    .attr("d", d3.arc()
    .innerRadius( 0 )
    .outerRadius( 4 )
    .startAngle( 0 )     // It's in radian, so Pi = 3.14 = bottom.
    .endAngle( 6.28/2 ))
    .attr('fill','rgb(52,52,52)');

    
var arcValues = [-37,18]

sketch03
    .append('g')
    .attr('transform',"translate(" + arcValues[0] + "," +  arcValues[1]  + ")")
    .append("path")
    .attr("d", d3.arc()
    .innerRadius( 0 )
    .outerRadius( 4 )
    .startAngle( 0 )     // It's in radian, so Pi = 3.14 = bottom.
    .endAngle( 6.28/2 ))
    .attr('fill','rgb(52,52,52)');

var arcValues = [-37,26]

sketch03
    .append('g')
    .attr('transform',"translate(" + arcValues[0] + "," +  arcValues[1]  + ")")
    .append("path")
    .attr("d", d3.arc()
    .innerRadius( 0 )
    .outerRadius( 4 )
    .startAngle( 0 )     // It's in radian, so Pi = 3.14 = bottom.
    .endAngle( 6.28/2 ))
    .attr('fill','rgb(52,52,52)');


 //______________   

//three circels horizontal to the right
for (let i =0; i<3;i++) {
        sketch03
            .append('circle')
            .attr('fill', 'rgb(115,118,124)')
            .attr('cy', 27)
            .attr('cx', i * 8 +15)
            .attr('r',4);

}
    
var arcValues = [15,27]
sketch03
    .append('g')
    .attr('transform',"translate(" + arcValues[0] + "," +  arcValues[1]  + ")")
    .append("path")
    .attr("d", d3.arc()
    .innerRadius( 0 )
    .outerRadius( 4 )
    .startAngle( 3.14/2 )     // It's in radian, so Pi = 3.14 = bottom.
    .endAngle( 3.14 * 1.5 ))
    .attr('fill','rgb(181,67,62)');

    
var arcValues = [23,27]
sketch03
    .append('g')
    .attr('transform',"translate(" + arcValues[0] + "," +  arcValues[1]  + ")")
    .append("path")
    .attr("d", d3.arc()
    .innerRadius( 0 )
    .outerRadius( 4 )
    .startAngle( 3.14/2 )     // It's in radian, so Pi = 3.14 = bottom.
    .endAngle( 3.14 * 1.5 ))
    .attr('fill','rgb(181,67,62)');

var arcValues = [31,27]
sketch03
    .append('g')
    .attr('transform',"translate(" + arcValues[0] + "," +  arcValues[1]  + ")")
    .append("path")
    .attr("d", d3.arc()
    .innerRadius( 0 )
    .outerRadius( 4 )
    .startAngle( 3.14/2 )     // It's in radian, so Pi = 3.14 = bottom.
    .endAngle( 3.14 * 1.5 ))
    .attr('fill','rgb(181,67,62)');

//____________________

//first circel top left 
var arcValues = [-29,-25]
sketch03
    .append('g')
    .attr('transform',"translate(" + arcValues[0] + "," +  arcValues[1]  + ")")
    .append("path")
    .attr("d", d3.arc()
    .innerRadius( 0 )
    .outerRadius( 9 )
    .startAngle(0 )     // It's in radian, so Pi = 3.14 = bottom.
    .endAngle( Math.PI * 2))
    .attr('fill','rgb(48,48,48)');

//second circel about middel right 
var arcValues = [30,-10]
sketch03
    .append('g')
    .attr('transform',"translate(" + arcValues[0] + "," +  arcValues[1]  + ")")
    .append("path")
    .attr("d", d3.arc()
    .innerRadius( 0 )
    .outerRadius( 9 )
    .startAngle(0 )     // It's in radian, so Pi = 3.14 = bottom.
    .endAngle( Math.PI * 2))
    .attr('fill','rgb(224,221,214)');

            //right side –– up –– all gray
            //vertical –– left side of the circel 
            //horizontal –– right side of the circel 
            sketch03
            .append('rect')
            .attr('width', 11.3)
            .attr('height', 4.3)
            .attr('fill', 'rgb(221,220,214)')
            .attr('x',-3.5)
            .attr('y', -21.6);
                
            sketch03
                .append('rect')
                .attr('width', 4.5)
                .attr('height',10)
                .attr('fill', 'rgb(221,220,214)')
                .attr('x', -4.2)
                .attr('y', -30.6);
                

            
            sketch03
                .append('rect')
                .attr('width', 11.6)
                .attr('height',4.3)
                .attr('fill', 'rgb(46,46,46)')
                .attr('x', 15.5)
                .attr('y', -22.8)
                ;
            sketch03
                .append('rect')
                .attr('width', 4.3)
                .attr('height', 10)
                .attr('fill', 'rgb(226,225,219)')
                .attr('x', 23)
                .attr('y', -28.5);
    


            var arcValues = [10.5,-23]
            sketch03
                .append('g')
                .attr('transform',"translate(" + arcValues[0] + "," +  arcValues[1]  + ")")
                .append("path")
                .attr("d", d3.arc()
                .innerRadius( 0 )
                .outerRadius( 9 )
                .startAngle( 0  ) 
                .endAngle( Math.PI *2 ))
                .attr('fill','rgb(51,51,51)');



//circel up right without right hand 
//vertical line
sketch03
    .append('rect')
    .attr('width', 5.7)
    .attr('height', 10)
    .attr('fill', 'rgb(223,223,217)')
    .attr('x', -31)
    .attr('y', -25);

//horizontal line
sketch03
    .append('rect')
    .attr('width', 11.7)
    .attr('height',5.7)
    .attr('fill', 'rgb(223,223,217)')
    .attr('x', -28)
    .attr('y', -18)
    ;

var arcValues = [-10,-15]
sketch03
    .append('g')
    .attr('transform',"translate(" + arcValues[0] + "," +  arcValues[1]  + ")")
    .append("path")
    .attr("d", d3.arc()
    .innerRadius( 0 )
    .outerRadius( 9 )
    .startAngle(0 )     // It's in radian, so Pi = 3.14 = bottom.
    .endAngle( Math.PI * 2))
    .attr('fill','rgb(223,223,217)');
    



//right side –– up –– gray transparent
//vertical –– left side of the circel 
sketch03
    .append('rect')
    .attr('width', 4.3)
    .attr('height', 7.9)
    .attr('fill', 'rgb(118,121,127)')
    .attr('opacity','0.5')
    .attr('x', -4.8)
    .attr('y', -12);
    

//horizontal –– left side of the circel 
sketch03 
    .append('rect')
    .attr('width', 9)
    .attr('height',4.3)
    .attr('fill', 'rgb(118,121,127)')
    .attr('x', -4.8)
    .attr('y', -7.4)
    ;
sketch03
    .append('rect')
    .attr('width', 7)
    .attr('height',4.3)
    .attr('fill', 'rgb(118,121,127)')
    .attr('opacity','0.5')
    .attr('x', 19)
    .attr('y', -7.7)
    ;

var arcValues = [11,-4]
sketch03
    .append('g')
    .attr('transform',"translate(" + arcValues[0] + "," +  arcValues[1]  + ")")
    .append("path")
    .attr("d", d3.arc()
    .innerRadius( 0 )
    .outerRadius( 9 )
    .startAngle( 0 ) 
    .endAngle( Math.PI*2 ))
    .attr('fill','rgb(118,121,127)');
    



//horizontal –– right side of the circel 
sketch03
    .append('rect')
    .attr('width', 4.5)
    .attr('height', 5.9)
    .attr('fill', 'rgb(118,121,127)')
    .attr('opacity','0.5')
    .attr('x', 21.5)
    .attr('y', -13.6);
                



                



                //form - left up
                //vertical line
            

                //horizontal line
                sketch03
                    .append('rect')
                    .attr('width', 11.7)
                    .attr('height',5.7)
                    .attr('fill', 'rgb(188,177,171)')
                    .attr('x', -23)
                    .attr('y', -8.7)
                    ;


                var arcValues = [-29,-8]
                sketch03
                    .append('g')
                    .attr('transform',"translate(" + arcValues[0] + "," +  arcValues[1]  + ")")
                    .append("path")
                    .attr("d", d3.arc()
                    .innerRadius( 0 )
                    .outerRadius( 9 )
                    .startAngle(0 )     // It's in radian, so Pi = 3.14 = bottom.
                    .endAngle( Math.PI * 2))
                    .attr('fill','rgb(47,47,47)');


                //left side pink
                //vertical  
                sketch03
                    .append('rect')
                    .attr('width', 5.7)
                    .attr('height', 15)
                    .attr('fill', 'rgb(183,176,165)')
                    .attr('x', -42)
                    .attr('y', -25);
                    

                //horizontal 
                sketch03
                    .append('rect')
                    .attr('width', 11)
                    .attr('height',5.7)
                    .attr('fill', 'rgb(183,176,165)')
                    .attr('x', -42)
                    .attr('y', -13.9)
                    ;



                //vertical line
                sketch03
                    .append('rect')
                    .attr('width', 5.7)
                    .attr('height', 10)
                    .attr('fill', 'rgb(49,49,49)')
                    .attr('x', -17)
                    .attr('y', -18);





//left side –– down –– half blue
//vertical –– left side of the circel 
sketch03
    .append('rect')
    .attr('width', 4.3)
    .attr('height', 10.4)
    .attr('fill', 'rgb(216,215,209)')
    .attr('x', -27.5)
    .attr('y', 16);
    

//horizontal –– left side of the circel 
sketch03
    .append('rect')
    .attr('width', 12.4)
    .attr('height',4.3)
    .attr('fill', 'rgb(216,215,209)')
    .attr('x', -27.5)
    .attr('y', 22.2)
    ;

var arcValues = [-8,22]
sketch03
    .append('g')
    .attr('transform',"translate(" + arcValues[0] + "," +  arcValues[1]  + ")")
    .append("path")
    .attr("d", d3.arc()
    .innerRadius( 0 )
    .outerRadius( 9 )
    .startAngle( Math.PI + (3.14* 0.5) ) 
    .endAngle( Math.PI*2.5 ))
    .attr('fill','rgb(55,63,134)');
    

var arcValues = [-8,22]
sketch03
    .append('g')
    .attr('transform',"translate(" + arcValues[0] + "," +  arcValues[1]  + ")")
    .append("path")
    .attr("d", d3.arc()
    .innerRadius( 0 )
    .outerRadius( 9 )
    .startAngle( Math.PI + 1.55 ) 
    .endAngle( Math.PI/2) )
    .attr('fill','rgb(223,222,216)');
    


//horizontal –– right side of the circel 
sketch03
    .append('rect')
    .attr('width', 11.3)
    .attr('height',4.3)
    .attr('fill', 'rgb(54,63,139)')
    .attr('x', -2.5)
    .attr('y', 17.7);
    
sketch03
    .append('rect')
    .attr('width', 5.35)
    .attr('height',4.35)
    .attr('fill', 'rgb(223,222,216)')
    .attr('x', 3.5)
    .attr('y', 17.7);
    
//vertical –– right side of the circel 
sketch03
    .append('rect')
    .attr('width', 4.3)
    .attr('height', 10)
    .attr('fill', 'rgb(223,222,216)')
    .attr('x', 4.5)
    .attr('y', 12);


            //left side –– down –– half blue
            //vertical –– left side of the circel 
            sketch03
                .append('rect')
                .attr('width', 4.3)
                .attr('height', 7.9)
                .attr('fill', 'rgb(223,222,216)')
                .attr('x', -27.5)
                .attr('y', 1.5);
                

            //horizontal –– left side of the circel 
            sketch03
                .append('rect')
                .attr('width', 12.4)
                .attr('height',4.3)
                .attr('fill', 'rgb(223,222,216)')
                .attr('x', -27.5)
                .attr('y', 6.1)
                ;

            var arcValues = [-8,6]
            sketch03
                .append('g')
                .attr('transform',"translate(" + arcValues[0] + "," +  arcValues[1]  + ")")
                .append("path")
                .attr("d", d3.arc()
                .innerRadius( 0 )
                .outerRadius( 9 )
                .startAngle( Math.PI + (3.14* 0.5) ) 
                .endAngle( Math.PI*2.5 ))
                .attr('fill','rgb(56,64,133)');
                

            var arcValues = [-8,6]
            sketch03
                .append('g')
                .attr('transform',"translate(" + arcValues[0] + "," +  arcValues[1]  + ")")
                .append("path")
                .attr("d", d3.arc()
                .innerRadius( 0 )
                .outerRadius( 9 )
                .startAngle( Math.PI + 1.55 ) 
                .endAngle( Math.PI/2) )
                .attr('fill','rgb(223,222,216)');
                


            //horizontal –– right side of the circel 
            sketch03
                .append('rect')
                .attr('width', 11.3)
                .attr('height', 4.3)
                .attr('fill', 'rgb(56,64,133)')
                .attr('x', -2.5)
                .attr('y', 1.6);
                
            sketch03
                .append('rect')
                .attr('width', 5.35)
                .attr('height',4.35)
                .attr('fill', 'rgb(223,222,216)')
                .attr('x', 3.5)
                .attr('y', 1.6);
                
            //vertical –– right side of the circel 
            sketch03
                .append('rect')
                .attr('width', 4.3)
                .attr('height', 10)
                .attr('fill', 'rgb(223,222,216)')
                .attr('x', 4.5)
                .attr('y', -4);
                

//right side –– down –– half blue
//vertical –– left side of the circel 
sketch03
    .append('rect')
    .attr('width', 4.3)
    .attr('height', 7.9)
    .attr('fill', 'rgb(229,226,219)')
    .attr('x', 12)
    .attr('y', -0.5);
    

//horizontal –– left side of the circel 
sketch03
    .append('rect')
    .attr('width', 7)
    .attr('height',4.3)
    .attr('fill', 'rgb(229,226,219)')
    .attr('x', 12)
    .attr('y', 6.1)
    ;
sketch03
    .append('rect')
    .attr('width', 7)
    .attr('height',4.3)
    .attr('fill', 'rgb(180,71,64)')
    .attr('x', 18)
    .attr('y', 6.1)
    ;

var arcValues = [30,10.5]
sketch03
    .append('g')
    .attr('transform',"translate(" + arcValues[0] + "," +  arcValues[1]  + ")")
    .append("path")
    .attr("d", d3.arc()
    .innerRadius( 0 )
    .outerRadius( 9 )
    .startAngle( 0 ) 
    .endAngle( Math.PI*2 ))
    .attr('fill','rgb(180,71,64)');
    



//horizontal –– right side of the circel 
sketch03
    .append('rect')
    .attr('width', 9.3)
    .attr('height', 4.3)
    .attr('fill', 'rgb(229,226,219)')
    .attr('x', 35.5)
    .attr('y', 10);
    
sketch03
    .append('rect')
    .attr('width', 4.5)
    .attr('height',10)
    .attr('fill', 'rgb(229,226,219)')
    .attr('x', 40.3)
    .attr('y', 1.6);