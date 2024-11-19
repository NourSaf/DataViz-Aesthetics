import * as d3 from 'd3';

//you con define the tag in wich the ID is 
const app = d3.select('div#app');

let data = [];

for (let i = 0; i<10; i++){
	data.push({
		name:'name',
		score:10,
	})
} 
const svg = app
	.append('svg')
	.attr('viewBox', '0 0 500 400')
	.attr('width',600)

	