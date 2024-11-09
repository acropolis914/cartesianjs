import * as d3 from "d3";
import * as d3Zoom from "d3-zoom";

import { removeFigure } from "./dataManager.js";
import { loadAndPlotData } from "./dataManager.js";
// import { handleResize } from "./handleResize.js";
// import { FIGURES_LIST } from "./constants.js";

let documentRoot;
let svg;
let xScale;
let yScale;

let height;
let width;
let xAxis;
let yAxis;
let gridLinesX;
let gridLinesY;
let k;

export function initialRender(root, store) {
	gridSetup(root);
	setScales();
	drawAxes();
	drawGridLines(svg, xScale, yScale);
	setupZoomBehavior(root);
	populateList(root, store);
	return [svg, xScale, yScale];
}

export function getSVG() {
	return svg;
}

export function getScales() {
	return { xScale, yScale };
}

function gridSetup(root) {
	const width = root.querySelector("#svg-container").offsetWidth;
	const height = root.querySelector("#svg-container").offsetHeight;

	svg = d3
		.select(root)
		.select("#svg-container")
		.append("svg")
		.attr("width", width)
		.attr("height", height);
}

function setScales() {
	height = svg.attr("height");
	width = svg.attr("width");
	k = height / width;

	xScale = d3
		.scaleLinear()
		.domain([-10 / k, 10 / k])
		.range([0, width]);
	yScale = d3.scaleLinear().domain([-10, 10]).range([height, 0]);
}

function drawAxes() {
	svg.selectAll("text.origin").remove();

	const xTicks =
		Math.floor(xScale.domain()[1]) - Math.floor(xScale.domain()[0]) + 1;

	xAxis = d3.axisBottom(xScale).ticks(xTicks / 2);

	svg.append("g")
		.attr("class", "x-axis")
		.attr("transform", `translate(0,${height / 2})`)
		.call(xAxis);

	const yTicks =
		Math.floor(yScale.domain()[1]) - Math.floor(yScale.domain()[0]) + 1;

	yAxis = d3.axisRight(yScale).ticks(yTicks / 2);
	svg.append("g")
		.attr("class", "y-axis")
		.attr("transform", `translate(${width / 2},0)`)
		.call(yAxis);
}

function drawGridLines(svg, xScale, yScale) {
	svg.selectAll(".grid-line").remove();

	gridLinesX = svg.append("g").selectAll(".grid-line.x").data(xScale.ticks());
	gridLinesX
		.enter()
		.append("line")
		.attr("class", "grid-line x")
		.attr("stroke", "lightgrey")
		.attr("stroke-width", 1)
		// .attr("stroke-dasharray", "4 4")
		.attr("opacity", 0.2)
		.attr("x1", (d) => xScale(d))
		.attr("y1", yScale.range()[0])
		.attr("x2", (d) => xScale(d))
		.attr("y2", yScale.range()[1]);
	gridLinesX.exit().remove();

	gridLinesY = svg.append("g").selectAll(".grid-line.y").data(yScale.ticks());
	gridLinesY
		.enter()
		.append("line")
		.attr("class", "grid-line y")
		.attr("stroke", "lightgrey")
		.attr("stroke-width", 1)
		// .attr("stroke-dasharray", "4 4")
		.attr("opacity", 0.2)
		.attr("x1", xScale.range()[0])
		.attr("y1", (d) => yScale(d))
		.attr("x2", xScale.range()[1])
		.attr("y2", (d) => yScale(d));
	gridLinesY.exit().remove();
}

function setupZoomBehavior(root) {
	const svg_element = d3.select(root).select("#svg-container").select("svg");
	const zoom = d3Zoom
		.zoom()
		.scaleExtent([0, 100])
		.on("zoom", (event) => {
			const { transform } = event;
			const zx = transform
				.rescaleX(xScale)
				.interpolate(d3.interpolateRound);
			const zy = transform
				.rescaleY(yScale)
				.interpolate(d3.interpolateRound);
			xScale.domain = zx.domain;
			yScale.domain = zy.domain;

			const transformX = (height * transform.k) / 2 + transform.y;
			const transformY = (width * transform.k) / 2 + transform.x;
			svg_element
				.selectAll(".x-axis")
				.attr("transform", `translate(0,${transformX})`)
				.call(xAxis.scale(zx));

			svg_element
				.selectAll(".y-axis")
				.attr("transform", `translate(${transformY},0)`)
				.call(yAxis.scale(zy));

			svg_element
				.selectAll(".grid-line.x")
				.attr("x1", (d) => zx(d))
				.attr("x2", (d) => zx(d));

			svg_element
				.selectAll(".grid-line.y")
				.attr("y1", (d) => zy(d))
				.attr("y2", (d) => zy(d));

			svg_element
				.selectAll(".point.figure")
				.attr("transform", transform)
				.attr("r", 5 / transform.k)
				.attr("stroke-width", 1 / transform.k);

			svg_element
				.selectAll(".line.figure")
				.attr("transform", transform)
				.style("stroke-width", 2 / transform.k);

			svg_element
				.selectAll(".circle.figure")
				.attr("transform", transform)
				.style("stroke-width", 2 / transform.k);

			svg_element.selectAll(".figure").attr("transform", transform);

			drawGridLines(svg_element, zx, zy);
		});

	svg.call(zoom).call(zoom.transform, d3.zoomIdentity);
}

export function populateList(root, store) {
	const figuresList = root.querySelector(".figures-list");
	figuresList.innerHTML = "";

	const storedFigures = store.getState().figures;

	if (!storedFigures) {
		console.log("No stored figures found");
		return;
	}

	for (const figure of storedFigures) {
		const li = document.createElement("li");
		li.id = figure.id;
		li.addEventListener("click", () => li.classList.toggle("active"));
		li.textContent = getFigureLabel(figure);

		const exitButton = document.createElement("button");
		const exitIcon = document.createElement("i");
		exitIcon.className = "fas fa-times";
		exitButton.appendChild(exitIcon);
		exitButton.addEventListener("click", () =>
			handleFigureRemoval(figure, li)
		);
		li.appendChild(exitButton);
		figuresList.appendChild(li);
	}
}

export function updateList(root, store) {
	const figuresList = root.querySelector(".figures-list");
	const existingItems = figuresList.querySelector("li");
	const storedFigures = store.getState().figures;

	const newFigures = storedFigures.filter(
		(fig) => !Array.from(existingItems).some((item) => item.id === fig.id)
	);

	for (const figure of newFigures) {
		const li = document.createElement("li");
		li.id = figure.id;
		li.addEventListener("click", () => li.classList.toggle("active"));
		li.textContent = getFigureLabel(figure);

		const exitButton = document.createElement("button");
		const exitIcon = document.createElement("i");
		exitIcon.className = "fas fa-times";
		exitButton.appendChild(exitIcon);
		exitButton.addEventListener("click", () =>
			handleFigureRemoval(figure, li)
		);
		li.appendChild(exitButton);
		figuresList.appendChild(li);
	}
}

function handleFigureRemoval(figure, listItem) {
	const { id } = figure;
	if (!id) throw new Error("Invalid figure ID");

	const figureSelected = svg.select(`.figure[id="${id}"]`);
	if (figureSelected.empty()) {
		console.error("No figure found with ID", id);
	}

	figureSelected.remove();
	removeFigure(figure);
	listItem.remove();
}

function getFigureLabel(figure) {
	switch (figure.type) {
		case "point":
			return `(${figure.x.toFixed(1)}, ${figure.y.toFixed(1)})`;
		case "line": {
			const termSymbol = figure.b >= 0 ? "+" : "-";
			return `y = ${figure.m.toFixed(1)}x ${termSymbol} ${figure.b
				.toFixed(1)
				.replace("-", "")}`;
		}
		case "circle":
			return `${figure.constructor.name} ${figure.h}, ${figure.k}, ${figure.radius}`;
		case "parabola":
			return `${figure.constructor.name}`;
		default:
			console.error("Invalid figure type");
			return "";
	}
}
