import * as d3 from "d3";
import * as d3Zoom from "d3-zoom";
import useCartesianStore from "./state.js";
import { removeFigure } from "./state.js";
import { executeInOrder } from "./utils.js";
import { svg } from "./main.js";
import { loadData } from "./state.js";

export let xScale, yScale;

export function initialRender() {
	executeInOrder(
		setScales,
		drawAxes,
		drawGridLines,
		setupZoomBehavior,
		// renderOldPoints,
		loadData,
		populateList
	);
}

let height;
let width;
let xAxis;
let yAxis;
let gridLinesX;
let gridLinesY;
let gGrid;
let k;

export function setScales() {
	height = svg.attr("height");
	width = svg.attr("width");
	k = height / width;
	xScale = d3
		.scaleLinear()
		.domain([-10 / k, 10 / k])
		.range([0, width]);
	yScale = d3.scaleLinear().domain([-10, 10]).range([height, 0]);

	gGrid = svg.append("g");
}

export function drawAxes() {
	svg.selectAll("text.origin").remove();

	// Draw X-axis
	const xTicks =
		Math.floor(xScale.domain()[1]) - Math.floor(xScale.domain()[0]) + 1;

	xAxis = d3.axisBottom(xScale).ticks(xTicks / 2);
	svg.append("g")
		.attr("class", "x-axis")
		.attr("transform", `translate(0,${height / 2})`)
		.call(xAxis);

	// Draw Y-axis
	const yTicks =
		Math.floor(yScale.domain()[1]) - Math.floor(yScale.domain()[0]) + 1;

	yAxis = d3.axisRight(yScale).ticks(yTicks / 2);
	svg.append("g")
		.attr("class", "y-axis")
		.attr("transform", `translate(${width / 2},0)`)
		.call(yAxis);
}

export function drawGridLines() {
	const existingGridLines = svg.selectAll(".grid-line");
	if (!existingGridLines.empty()) {
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

		return;
	}

	// Create horizontal grid lines
	gridLinesX = svg.append("g").selectAll(".grid-line-x").data(xScale.ticks());

	gridLinesX
		.enter()
		.append("line")
		.attr("class", "grid-line x")
		.attr("stroke", "lightgray")
		.attr("stroke-width", 1)
		.attr("stroke-dasharray", "4 4")
		.attr("opacity", 0.2)
		.attr("x1", (d) => xScale(d))
		.attr("y1", yScale.range()[0])
		.attr("x2", (d) => xScale(d))
		.attr("y2", yScale.range()[1]);

	gridLinesX.exit().remove();

	// Create vertical grid lines
	gridLinesY = svg.append("g").selectAll(".grid-line y").data(yScale.ticks());

	gridLinesY
		.enter()
		.append("line")
		.attr("class", "grid-line y")
		.attr("stroke", "lightgray")
		.attr("stroke-width", 1)
		.attr("stroke-dasharray", "4 4")
		.attr("opacity", 0.2)
		.attr("x1", xScale.range()[0])
		.attr("y1", (d) => yScale(d))
		.attr("x2", xScale.range()[1])
		.attr("y2", (d) => yScale(d));

	gridLinesY.exit().remove();
}

export function setupZoomBehavior() {
	const zoom = d3Zoom
		.zoom()
		.scaleExtent([0.5, 10])
		.on("zoom", (event) => {
			const { transform } = event;
			console.log("transform", transform);
			const zx = transform
				.rescaleX(xScale)
				.interpolate(d3.interpolateRound); // Rescale x-axis
			const zy = transform
				.rescaleY(yScale)
				.interpolate(d3.interpolateRound);

			// gridLinesX.call(xAxis, zx); // Update the x-axis with the rescaled x
			// gridLinesY.call(yAxis, zy); // Update the y-axis with the rescaled y

			svg.selectAll(".x-axis")
				.attr("transform", `translate(0,${height / 2 + transform.y})`)
				.call(xAxis.scale(zx));

			svg.selectAll(".y-axis")
				.attr("transform", `translate(${width / 2 + transform.x},0)`)
				.call(yAxis.scale(zy));

			svg.selectAll(".grid-line.x")
				.attr("x1", (d) => zx(d))
				.attr("x2", (d) => zx(d));

			svg.selectAll(".grid-line.y")
				.attr("y1", (d) => zy(d))
				.attr("y2", (d) => zy(d));

			svg.selectAll(".point")
				.attr("transform", transform)
				.attr("r", 5 / transform.k)
				.attr("stroke-width", 1 / transform.k);
		});

	svg.call(zoom).call(zoom.transform, d3.zoomIdentity);
}

export function populateList() {
	const pointsUl = document.getElementById("points-ul");
	pointsUl.innerHTML = "";

	const storedFigures = useCartesianStore.getState().figures;

	storedFigures.forEach((figure) => {
		const li = document.createElement("li");
		li.id = figure.id;
		li.addEventListener("click", () => handleFigureRemoval(figure, li));
		li.textContent = getFigureLabel(figure);
		pointsUl.appendChild(li);
	});
}

function handleFigureRemoval(figure, listItem) {
	const { id } = figure;
	if (!id) throw new Error("Invalid figure ID");

	const figureSelected = svg.select(`.figure[id="${id}"]`);
	if (figureSelected.empty()) {
		console.error("No figure found with ID", id);
		return;
	}

	figureSelected.remove();
	removeFigure(figure);
	listItem.remove();
}

function getFigureLabel(figure) {
	switch (figure.type) {
		case "point":
			return `${figure.constructor.name} ${figure.x.toFixed(
				1
			)}, ${figure.y.toFixed(1)}`;
		case "line":
			return `${figure.constructor.name} ${figure.x1.toFixed(
				1
			)}, ${figure.y1.toFixed(1)}, ${figure.x2.toFixed(
				1
			)}, ${figure.y2.toFixed(1)}`;
		case "circle":
			return `${figure.constructor.name} ${figure.h}, ${figure.k}, ${figure.radius}`;
		case "parabola":
			return `${figure.constructor.name}`;
		default:
			console.error("Invalid figure type");
			return "";
	}
}
