import * as d3 from "d3";
import { RiTa as ri } from "rita";
import Sentiment from "sentiment";

import { partsOfSpeech } from "./partsOfSpeech.js";

const sentiment = new Sentiment();

const fetchData = async () => {
  const text = await d3.text("sotu/Trump_2020.txt");
  const tokens = ri.tokenize(text);
  return d3.rollup(tokens,
    (v, ...args) => {
      console.log("those are all the words",v)
      const word = v[0]
      console.log('this is my word',word)
      const score = sentiment.analyze(v.join(" ")).score
      console.log("this is my score",score)
      const posType = ri.pos(word, { simple: false })[0];
      const posdetails = partsOfSpeech[posType]
      console.log("this is my posDetials",posdetails)
      
      return {
        occurrences: v.length,
        sentiment: score,
        partOfSpeech: posdetails,
      };
    },
    (d) => {
       const lowercase=d.toLowerCase()
       console.log("this is lowerCase",lowercase)
       return lowercase
    }
  );
};

const data = await fetchData();

console.log("This is my data",data)


const app = d3.select('#app');