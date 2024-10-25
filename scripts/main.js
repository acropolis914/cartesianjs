import useCartesianStore from "./state.js";
import { initialRender } from "./render.js";
import { drawSine } from "./shapes.js";
import { addInteractions } from "./addInteractions.js";
import { handleResize } from "./handleResize.js";
import * as d3 from "d3";

import "core-js/stable";
import "regenerator-runtime/runtime";

export const STORE_KEY = "cartesian-plane-points";
export let svg;
export const FIGURES_LIST = "figures-list";

// class CartesianPlane {
// 	constructor (svg,figuresList){
// 		this.svg = svg;
// 		this.figuresList = figuresList;
// 	}
// // put here the run and setup methods

// }

function run() {
	gridSetup();
	initialRender();
	addInteractions();
	//handleResize();
	//addmanypoints();
	//drawSine();
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
	useCartesianStore.setState({
		svg,
	});
}

run();
