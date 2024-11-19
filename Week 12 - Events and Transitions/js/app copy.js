import { randFirstName, randNumber } from '@ngneat/falso';
import * as d3 from 'd3';

// get reference to the app div
const app = d3.select('div#app');

const colorScale = d3.scaleLinear().domain([0, 100]).range(['#eee', '#00f']);

const buttonGroup = app.append('div').style('padding', '10px');

const addDataButton = buttonGroup.append('button').text('Add Random Datum');

const shuffleDataButton = buttonGroup.append('button').text('Random Order');

const sortDataButton = buttonGroup
	.append('button')
	.text('Sort By Largest Value');

// initialize dataset with some random entries at first
let dataset = new Array(5).fill(0).map(() => ({
	name: randFirstName(),
	value: randNumber({ min: 0, max: 100 }),
	id: window.crypto.randomUUID(),
}));

// add a random item to the dataset
const addItemToDataset = () => {
	dataset.push({
		name: randFirstName(),
		value: randNumber({ min: 0, max: 100 }),
		id: window.crypto.randomUUID(),
	});
	drawChart(dataset);
};

// shuffle the dataset
const shuffleDataset = () => {
	dataset.sort(() => (Math.random() > 0.5 ? 1 : -1));
	drawChart(dataset);
};

// remove an item from the dataset
const removeItemFromDataset = (id) => {
	dataset = dataset.filter((datum) => datum.id !== id);
};

// sort by value ascending
const sortByValueAscending = () => {
	dataset.sort((a, b) => b.value - a.value);
	drawChart(dataset);
};

// create an svg

const svg = app
	.append('div')
	.style('padding', '10px')
	.append('svg')
	.attr('width', 500)
	.attr('height', 500);

const TRANSITION_SPEED = 300;

const drawChart = (data) => {
	console.log(`drawing chart...`, data);
	const enter = (enter) => {
		const g = enter.append('g');
		g.append('rect');
		g.append('text');
		g.attr('transform', (d, i) => `translate(0, ${i * 50})`);
		g.attr('opacity', 0);

		g.transition().duration(TRANSITION_SPEED).attr('opacity', 1);
		return g;
	};

	const update = (update) => {
		d3.interrupt(update);
		return update
			.transition()
			.duration(TRANSITION_SPEED)
			.attr('opacity', 1)
			.attr('transform', (d, i) => `translate(0, ${i * 50})`);
	};

	const exit = (exit) => {
		d3.interrupt(update);
		return exit
			.transition()
			.duration(TRANSITION_SPEED)
			.attr('transform', (d, i) => `translate(200, ${i * 50})`)
			.style('opacity', 0)
			.remove();
	};

	svg
		.attr('viewBox', [0, 0, 500, dataset.length * 50])
		.attr('height', dataset.length * 50)
		.selectAll('g')
		.data(data, (d) => d.name)
		.join(enter, update, exit)
		.on('click', (event, d) => {
			// remove self from data array
			removeItemFromDataset(d.id);
			drawChart(dataset);
			console.log({ dataset });
		})
		.style('cursor', 'pointer')
		.call((g) => {
			g.select('rect')
				.attr('x', 2)
				.attr('y', 2)
				.attr('width', 46)
				.attr('height', 46)
				.attr('fill', (d) => colorScale(d.value));
			g.select('text')
				.attr('x', 60)
				.attr('y', 25)
				.attr('dominant-baseline', 'central')
				.text((d) => `${d.name} (${d.value})`);
		});
};

drawChart(dataset);

addDataButton.on('click', (event) => {
	event.preventDefault();

	addItemToDataset();
});

shuffleDataButton.on('click', (event) => {
	event.preventDefault();

	shuffleDataset();
});

sortDataButton.on('click', (event) => {
	event.preventDefault();

	sortByValueAscending();
});

app
	.append('div')
	.style('padding', '10px')
	.selectAll('button')
	.data(
		Object.entries({
			Red: 'hsla(0, 100%, 50%, 1)',
			Orange: 'hsla(30, 100%, 50%, 1)',
			Yellow: 'hsla(60, 100%, 50%, 1)',
			Green: 'hsla(120, 100%, 50%, 1)',
			Blue: 'hsla(240, 100%, 50%, 1)',
			Indigo: 'hsla(270, 100%, 50%, 1)',
			Violet: 'hsla(300, 100%, 50%, 1)',
		}),
	)
	.join('button')
	.style('display', 'inline-flex')
	.style('align-items', 'center')
	.style('gap', '4px')
	.call((g) =>
		g
			.append('span')
			.style('display', 'inline-block')
			.style('width', '20px')
			.style('height', '20px')
			.style('border-radius', '2px')
			.style('background-color', (d) => d[1]),
	)
	.call((g) => g.append('span').text((d) => d[0]))
	.on('click', (event, d) => {
		// change range of color scale
		colorScale.range(['#eee', d[1]]);
		drawChart(dataset);
	});
