import useCartesianStore, {gridSetup} from "./state.js";
import { initialRender } from "./render.js";
import { addInteractions } from "./addInteractions.js";
import { FIGURES_LIST } from "./constants.js";
import { executeInOrder } from "./utils.js";
import * as d3 from "d3";

import "core-js/stable";
import "regenerator-runtime/runtime";


// class CartesianPlane {
// 	constructor (parentElement, storageKey){
// 		this.parentElement = parentElement;
// 		this.storageKey = storageKey
// 		this.gridSetup();
// 		this.render();
// 	}
// 	gridSetup() {
// 		const svgContainer = document.getElementById("svg-container");
// 		const width = svgContainer.clientWidth;
// 		const height = svgContainer.clientHeight;
	
// 		const svg = d3
// 			.select("#svg-container")
// 			.append("svg")
// 			.attr("width", width)
// 			.attr("height", height);
// 		useCartesianStore.setState({
// 			svg,
// 		});
// 	}
// 	render(){
// 		gridSetup();
// 		initialRender();
// 		addInteractions();
// 	}
// }

function run() {
	// executeInOrder(
	// gridSetup,
	// initialRender,
	// addInteractions
	// )
	// gridSetup();
	initialRender();
	addInteractions();
	//handleResize();
	//addmanypoints();
	//drawSine();
}

document.addEventListener( 'DOMContentLoaded', () => run())
