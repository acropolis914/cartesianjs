import useCartesianStore from "./state.js";
import { initialRender } from "./render.js";
import { drawSine } from "./shapes.js";
import { addInteractions } from "./addInteractions.js";
import { handleResize } from "./handleResize.js";
import * as d3 from "d3";

export let STORE_KEY = "cartesian-plane-points";
export let svg, xScale, yScale;

function run() {
	gridSetup();
	initialRender();
	addInteractions();
	handleResize();
	//addmanypoints();
	// drawSine(svg);
}

export function gridSetup() {
	const svgContainer = document.getElementById("svg-container");
	const width = svgContainer.clientWidth;
	const height = svgContainer.clientHeight;

	svg = d3
		.select("#svg-container")
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	let RATIO_WH = width / height;
	xScale = d3
		.scaleLinear()
		.domain([-10 * RATIO_WH, 10 * RATIO_WH])
		.range([0, width]);
	yScale = d3.scaleLinear().domain([-10, 10]).range([height, 0]);
	useCartesianStore.setState({
		svg,
		xScale,
		yScale,
	});
}

run();

// function addmanypoints() {
//     for (let i=0; i <10; i++){
//         const x = Math.random() * (xScale.domain()[1] - xScale.domain()[0]) + xScale.domain()[0];
//         const y = Math.random() * (yScale.domain()[1] - yScale.domain()[0]) + yScale.domain()[0];
//         const point = { x, y };
//         addPoint(svg, xScale, yScale, point);
//     }
// }
