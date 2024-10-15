import * as d3 from "d3";
import * as d3Zoom from "d3-zoom";
import useCartesianStore from "./state.js";
import { removeFigure } from "./state.js";
import {getAllPoints} from "./storeData.js";
import { plotPoint } from "./points.js";
import { executeInOrder } from "./utils.js";
import { svg,xScale, yScale } from "./main.js";
import { loadData } from "./state.js";


let state = useCartesianStore.getState();

export function initialRender() {
	executeInOrder(
		drawAxes,
		drawGridLines,
		//setupZoomBehavior,
		// renderOldPoints,
		loadData,
		populatePointsList
	);
}


export function drawAxes() {
	svg.selectAll("g").remove();
	svg.selectAll("text.origin").remove();

	// Get dimensions of the SVG
	const height = svg.attr("height");
	const width = svg.attr("width");

	// Draw X-axis
	let xTicks =
		Math.floor(xScale.domain()[1]) - Math.floor(xScale.domain()[0]) + 1;
	const xAxis = d3.axisBottom(xScale).ticks(xTicks / 2);

	svg.append("g")
		.attr("transform", `translate(0,${height / 2})`)
		.call(xAxis);

	// Draw Y-axis
	let yTicks =
		Math.floor(yScale.domain()[1]) - Math.floor(yScale.domain()[0]) + 1;
	const yAxis = d3.axisRight(yScale).ticks(yTicks / 2);
	svg.append("g")
		.attr("transform", `translate(${width / 2},0)`)
		.call(yAxis);

	// Add origin
	svg.append("text")
		.attr("class", "origin")
		.attr("x", svg.attr("width") / 2)
		.attr("y", svg.attr("height") / 2)
		.attr("text-anchor", "middle")
		.text("(0,0)")
		.attr("fill", "white");
}

export function drawGridLines() {
	const existingGridLines = svg.selectAll(".grid-line");

	if (existingGridLines.empty()) {
		const gridLines = svg
			.append("g")
			.selectAll(".grid-line")
			.data(xScale.ticks());

		gridLines
			.enter()
			.append("line")
			.attr("class", "grid-line")
			.attr("stroke", "lightgray")
			.attr("stroke-width", 1)
			.attr("stroke-dasharray", "4 4")
			.attr("opacity", 0.2)
			.merge(gridLines)
			.attr("x1", (d) => xScale(d))
			.attr("y1", yScale.range()[0])
			.attr("x2", (d) => xScale(d))
			.attr("y2", yScale.range()[1]);

		// Remove exit nodes
		gridLines.exit().remove();

		// Create vertical grid lines
		const gridLinesY = svg
			.append("g")
			.selectAll(".grid-line-y")
			.data(yScale.ticks());

		gridLinesY
			.enter()
			.append("line")
			.attr("class", "grid-line-y")
			.attr("stroke", "lightgray")
			.attr("stroke-width", 1)
			.attr("stroke-dasharray", "4 4")
			.attr("opacity", 0.2)
			.merge(gridLinesY)
			.attr("x1", xScale.range()[0])
			.attr("y1", (d) => yScale(d))
			.attr("x2", xScale.range()[1])
			.attr("y2", (d) => yScale(d));

		gridLinesY.exit().remove();
	} else {
		// Update existing grid lines
		existingGridLines
			.attr("x1", (d) => xScale(d))
			.attr("y1", yScale.range()[0])
			.attr("x2", (d) => xScale(d))
			.attr("y2", yScale.range()[1]);

		// Update vertical grid lines
		existingGridLines
			.filter(".grid-line-y")
			.attr("x1", xScale.range()[0])
			.attr("y1", (d) => yScale(d))
			.attr("x2", xScale.range()[1])
			.attr("y2", (d) => yScale(d));
	}
}

export function setupZoomBehavior() {
	const zoom = d3Zoom
		.zoom()
		.scaleExtent([0.5, 10])
		.on("zoom", (event) => {
			const { transform } = event;
			svg.selectAll("g").attr("transform", transform);
			svg.selectAll("line").attr("stroke-width", 1 / transform.k);
			svg.selectAll("circle").attr("r", 3 / transform.k);
			svg.selectAll("text").attr("font-size", 12 / transform.k);
		});

	svg.call(zoom); // Attach zoom behavior to the SVG
}

export function renderOldPoints() {
	let storedPoints = getAllPoints();
	storedPoints.forEach((point) => {
		plotPoint(point);
	});
}
export function populatePointsList() {
	const pointsUl = document.getElementById("points-ul");
	pointsUl.innerHTML = ""; // Clear existing content

	let storedFigures = useCartesianStore.getState().figures;
	storedFigures.forEach((figure) => {
		const li = document.createElement("li");
		li.textContent = `${figure.constructor.name} ${figure.x.toFixed(1)}, ${figure.y.toFixed(1)}`;
		li.id = figure.id;
		li.addEventListener("click", () => {
			const id = figure.id;
			console.log(figure);
			if (id) {
				svg.select(`[id="${id}"]`).remove();
				removeFigure(figure);
				li.remove();
			}

		});
		pointsUl.appendChild(li);
	});
}
