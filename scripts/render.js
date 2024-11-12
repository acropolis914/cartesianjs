import * as d3 from "d3";
import * as d3Zoom from "d3-zoom";

import { removeFigure } from "./dataManager.js";

let k
let xAxis;
let yAxis;
let gridLinesX;
let gridLinesY;
let transformation;
let xTicks;
let yTicks;

export function initialRender(root, store) {
	const svg = gridSetup(root);
	const { xScale, yScale, height, width, k } = setScales(root);
	drawAxes(svg, xScale, yScale, height, width);
	drawGridLines(svg, xScale, yScale);
	setupZoomBehavior(svg, root, store, xScale, yScale, height, width);
	populateList(svg, root, store);


	// svg.on("click", (event) => {
	// 	const [x, y] = d3.pointer(event);
	// 	console.log("Clicked at", x, y);
	// 	console.log(transformation);
	// });
	store.setState({ svg: svg, xScale: xScale, yScale: yScale});
}



function gridSetup(root) {
	const width = root.querySelector("#svg-container").offsetWidth;
	const height = root.querySelector("#svg-container").offsetHeight;

	const svg = d3
		.select(root)
		.select("#svg-container")
		.append("svg")
		.attr("width", width)
		.attr("height", height);
	return svg;
}

function setScales(root) {
	const svg = d3.select(root).select("#svg-container").select("svg");
	const height = Number(svg.attr("height"));
	const width = Number(svg.attr("width"));
	const k = Number(height / width);


	const yScale = d3.scaleLinear().domain([-6, 6]).range([height, 0]).nice();
	const xScale = d3
	.scaleLinear()
	.domain([-6 / k, 6 / k])
	.range([0, width])

	yTicks = yScale.ticks().length;
	xTicks = yScale.ticks().length / k;
	xScale.ticks(xTicks);

	return { xScale, yScale, height, width, k };
}

function drawAxes(svg, xScale, yScale, height, width) {
	svg.selectAll("text.origin").remove();

	// const yTicks =
	// Math.floor(yScale.domain()[1]) - Math.floor(yScale.domain()[0]) + 1;

	// const xTicks =
	// 	Math.floor(xScale.domain()[1]) - Math.floor(xScale.domain()[0]) + 1;


	xAxis = d3.axisBottom(xScale).ticks(xTicks/2);

	svg
		.append("g")
		.attr("class", "x-axis")
		.attr("transform", `translate(0,${height / 2})`)
		.call(xAxis);


	yAxis = d3.axisRight(yScale).ticks(yTicks/2);
	svg
		.append("g")
		.attr("class", "y-axis")
		.attr("transform", `translate(${width / 2},0)`)
		.call(yAxis);
}

function drawGridLines(svg, xScale, yScale) {
    // Remove all existing grid line groups
    svg.selectAll("g.grid-lines").remove();
    
    const xGridValues = xScale.ticks(xTicks);
    const yGridValues = yScale.ticks(yTicks);
    
    // Create a single group for all grid lines
    const gridGroup = svg.append("g")
        .attr("class", "grid-lines");
    
    // Draw X grid lines
    gridGroup.selectAll(".grid-line.x")
        .data(xGridValues)
        .join("line")
        .attr("class", "grid-line x")
        .attr("stroke", "lightgrey")
        .attr("stroke-width", 1)
        .attr("opacity", (d) => {
            return typeof d === 'number' && d % 1 === 0 ? 0.25 : 0.2;
        })
        .attr("x1", (d) => xScale(d))
        .attr("y1", yScale.range()[0])
        .attr("x2", (d) => xScale(d))
        .attr("y2", yScale.range()[1]);
    
    // Draw Y grid lines
    gridGroup.selectAll(".grid-line.y")
        .data(yGridValues)
        .join("line")
        .attr("class", "grid-line y")
        .attr("stroke", "lightgrey")
        .attr("stroke-width", 1)
        .attr("opacity", 0.2)
        .attr("x1", xScale.range()[0])
        .attr("y1", (d) => yScale(d))
        .attr("x2", xScale.range()[1])
        .attr("y2", (d) => yScale(d));
}

export function updateZoomable(root, store, zoomable) {
	const svg = store.getState().svg;
	const { xScale, yScale, height, width } = setScales(root);
	if (zoomable) {
		console.log("Zoom enabled");
		setupZoomBehavior(svg, root, store, xScale, yScale, height, width);
	} else {
		console.log("Zoom disabled");
		svg.on(".zoom", null);
	}
}

export function setupZoomBehavior( svg, root, store, xScale, yScale, height, width, ) {
	const svg_element = d3.select(root).select("#svg-container").select("svg");
	const zoom = d3Zoom
		.zoom()
		.scaleExtent([0, 100])
		.on("zoom", (event) => {
			const { transform } = event;
			transformation = transform;
			store.setState({ transformation: transform });
			const zx = transform.rescaleX(xScale).interpolate(d3.interpolateRound);
			const zy = transform.rescaleY(yScale).interpolate(d3.interpolateRound);
			xScale.domain = zx.domain;
			yScale.domain = zy.domain;

			const transformX = (height * transform.k) / 2 + transform.y;
			const transformY = (width * transform.k) / 2 + transform.x;

// TODO - Add a code to change the axis position and direction when it is out of the view
			if (transformX < 0) {
				svg_element
					.selectAll(".x-axis")
					.attr("transform", "translate(0,0)")
					.call(xAxis.scale(zx));
			} else {
				svg_element
					.selectAll(".x-axis")
					.attr("transform", `translate(0,${transformX})`)
					.call(xAxis.scale(zx));
			}


			if (transformY < 0) {
				svg_element
					.selectAll(".y-axis")
					.attr("transform", "translate(0,0)")
					.call(yAxis.scale(zy));
			} else {
			svg_element
				.selectAll(".y-axis")
				.attr("transform", `translate(${transformY},0)`)
				.call(yAxis.scale(zy));
			}

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

export function populateList(svg, root, store) {
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
			handleFigureRemoval(svg, store, figure, li),
		);
		li.appendChild(exitButton);
		figuresList.appendChild(li);
	}
}

export function updateList(root, store) {
	const svg = store.getState().svg;
	const figuresList = root.querySelector(".figures-list");
	const existingItems = Array.from(figuresList.querySelectorAll("li"));
	const storedFigures = store.getState().figures;

	const newFigures = storedFigures.filter((fig) => {
		return !existingItems.some((item) => item.id === fig.id);
	});

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
			handleFigureRemoval(svg, store, figure, li),
		);
		li.appendChild(exitButton);
		figuresList.appendChild(li);
	}
}

function handleFigureRemoval(svg, store, figure, listItem) {
	const { id } = figure;
	if (!id) throw new Error("Invalid figure ID");

	const figureSelected = svg.select(`.figure[id="${id}"]`);
	if (figureSelected.empty()) {
		console.error("No figure found with ID", id);
	}

	figureSelected.remove();
	removeFigure(store, figure);
	listItem.remove();
}

function getFigureLabel(figure) {
	switch (figure.type) {
		case "point":
			return `(${figure.x.toFixed(2)}, ${figure.y.toFixed(2)})`;
		case "line": {
			const termSymbol = figure.b >= 0 ? "+" : "-";
			return `y = ${figure.m.toFixed(2)}x ${termSymbol} ${figure.b
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
