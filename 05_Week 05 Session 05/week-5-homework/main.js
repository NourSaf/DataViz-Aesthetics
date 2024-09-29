import "./style.css";
import * as d3 from "d3";

const RESOURCE_URL = 'https://data.cityofnewyork.us/resource/tg4x-b46p.json';

//async funciton to fetch the data from API link
const dataLoad = async () => {
  const data = await d3.json(RESOURCE_URL);
  console.log("✺–––▷  Permit Types Count",data)
  return data
};

//main Funciton accessing the data -> console log and creates dynamic HTML elemnts.
dataLoad().then((data) => {
const app = d3
  .select('#app')

  // permit type ount –—> using grouping rollup method 
  const eventTypeCount = d3.rollup(
    data, 
    (v) => v.length,
    (d) => d.category,
  );
  console.log("✺–––▷  Permit Types Count",eventTypeCount)

  //creating a div container for the elements 
  const mainDiv = app
      .append('div')
      .attr('class','mainHeader')
      .text('Event Type Count')
    
    //creates a h2 for each data property and value. Using ${} to control displying data in a nicer way
     mainDiv
      .selectAll('h2')
      .data(eventTypeCount)
      .enter()
      .append('h2')
      .attr('class','h2text')
      .text( (d) => `${d[0]}: ${d[1]}` )


  //Zipcode with hights permits
  //first used rollup to count the permits in each unique zipcode
  const zipCode = d3.rollup(data, 
    (v) => v.length,
    (d) => d.zipcode_s,
  );

  //entering the creeated array with greatest to determin the highest count 
  //using [,c] to ignor the zipcode and count the count of each zipcode and get highst instead of getting the highst value of zipcode itself
  const maxCount = d3.greatest(
    zipCode, 
    ([,c]) => c
  )
  console.log("✺–––▷  Zipcode with highst count",maxCount)


  //create a header for the zipcode
  const zipCodeDiv = app
      .append('div')
      .attr('class','mainHeader')
      .text('Highest Zipcode Count')
  
    //creates a h2 for the zipcode and its count 
    //using [maxCount] to treat the array as two indexs 0 for the zipcocde and 1 for the count
    zipCodeDiv
      .selectAll('h2')
      .data([maxCount])
      .enter()
      .append('h2')
      .attr('class','h2text')
      .text( (d) => `${d[0]}: ${d[1]}`)

  //finding the borough with the highst count 
  //rollup and group by borough
  const boroughCount = d3.rollup(
    data, 
    (v) => v.length,
    (d) => d.borough,
  );

  //finding the highst value
  //using [,a][,b] to have a comparision and have a differnt approach as before 
  const boroughMax = d3.greatest(
    boroughCount,
    ([,a],[,b]) => a - b,
    );
    console.log("✺–––▷  Borough with highst count" , boroughMax)

    //the process here is exacly as the div and data binding as before 
    const boroughCountDiv = app
      .append('div')
      .attr('class','mainHeader')
      .text('Borough with the most permits')

      boroughCountDiv
        .selectAll('h2')
        .data([boroughMax])
        .enter()
        .append('h2')
        .attr('class','h2text')
        .text( (d) => `${d[0]}: ${d[1]}` )


  //creating a daysOfWeek array to map the days indexs from numbers to strings with acctual names 
  const daysOfWeek = [
    "Sunday","Monday", "Tuesday", "Wednesday", "Thursday", "Friday", 
    "Saturday"
    ];

  //grouping by days of the week using daysofWeek then getting a date and then geting only the day  
  const dayAndBorough = d3.rollup(data, 
    (v) => v.length,
    (d) => daysOfWeek[new Date(d['startdatetime']).getDay()],
    (d) => d.borough,
  );
  console.log("✺–––▷ Group by Day and Borough",dayAndBorough)
  
  //uses the same data binding and appending as before
  const dayAndBoroughDiv = app
  .append('div')
  .attr('class','mainHeader')
  .text('Days of the week and boroughs')

  //using forEach to access the keys and values and the keys and values of boroughs as it's a nested array
  //creats a h2 element for each day 
  dayAndBorough.forEach((b,d) => {
    const dayDiv = dayAndBoroughDiv
      .append('h2')
      .attr('class', 'h2text')
      .text(d);

    //creates a h3 element for each borough and its count 
    dayDiv
      .selectAll('h3')
      .data(b)
      .enter()
      .append('h3')
      .attr('class', 'h3text')
      .text((d) => `${d[0]}: ${d[1]}`);
  });

  //grouping by day to get the days 
  //using modulo operator to determine if the day is a weekend or a weekday
  //0 and 6 are sunday and saturdy both are weekends 
  //if the modulo result is 0 then it's a weekend 
  //0 % 6 = 0 and 6 % 6 = 0
  //if the modulo or reminder reslut is not 0 then the day is a weekday 
  // Monday 1 -> 1 % 6 = 1  
  const weekDayEnd = d3.rollup(
    data, 
    (v) => v.length,
    (d) => { 
      let day = new Date (d['startdatetime']).getDay() ; 
      let weekDay = day % 6 !== 0; 
      if (weekDay){
        return "Weekday"
      } else {
        return "Weekend"
      }
    }
  );
  console.log("✺–––▷ Shows permits in weekends and weekdays",weekDayEnd)

  //follows the same logic as the before 
  const weekDayEndDiv = app
      .append('div')
      .attr('class','mainHeader')
      .text('Permits in Weekends and Weekdays')

      weekDayEndDiv
      .selectAll('h2')
      .data(weekDayEnd)
      .enter()
      .append('h2')
      .attr('class','h2text')
      .text( (d) => `${d[0]} ${d[1]}`)
  

  //grouping using rollup, here using getHours
  const hour = d3.rollup(
    data, 
    (v) => v.length,
    (d) => { 
      let hours = new Date (d['startdatetime']).getHours(); return hours;
    }
  );
  console.log("✺–––▷ Group by Day and Borough", hour)


  //follows the same logic untlized before 
  const hoursDiv = app
    .append('div')
    .attr('class','mainHeader')
    .text('Permits per hour')

  hoursDiv
    .selectAll('h2')
    .data(hour)
    .enter()
    .append('h2')
    .attr('class','h2text')
    .text( 
      (d) => (`${d[0]} hr: ${d[1]}`)
    )

})

