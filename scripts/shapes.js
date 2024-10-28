// import * as d3 from "d3";
// import useCartesianStore from "./state.js";

// const state = useCartesianStore;
// const {svg, xScale,yScale } = state.getState();
// const {transformation} = state.getState();

// export function drawLine(line) {
// 	const m = line.m;
// 	const b = line.b;
// 	svg
// 		.append("line")
// 		.attr("x1", xScale(-10000))
// 		.attr("y1", yScale(m * -10000 + b))
// 		.attr("x2", xScale(10000))
// 		.attr("y2", yScale(m * 10000 + b))
// 		.attr("id", line.id)
// 		.attr("class", "line figure")
// 		.attr("transform", transformation)
// 		.attr("class", "line figure")
// 		.style("stroke", "white")
// 		.style("stroke-width", 2 / transformation.k);
// }

// export function drawCircleOutline(circle) {
// 	svg
// 		.append("circle")
// 		.attr("cx", xScale(circle.h))
// 		.attr("cy", yScale(circle.k))
// 		.attr("r", xScale(circle.radius) - xScale(0)) // Set radius of circle
// 		.attr("id", circle.id) // Set id of circle
// 		.attr("class", "circle figure")
// 		.attr("transform", transformation)
// 		.style("stroke", "white") // Set stroke color to black
// 		.style("stroke-width", 2 / transformation.k) // Set stroke width to 2px
// 		.style("fill", "none"); // Remove fill color
// }

// export function drawRectangle(x1, y1, x2, y2) {
// 	svg
// 		.append("rect")
// 		.attr("x", xScale(x1))
// 		.attr("y", yScale(y1))
// 		.attr("width", xScale(x2) - xScale(x1))
// 		.attr("height", yScale(y2) - yScale(y1))
// 		.attr("fill", "green");
// }

// function drawCircle(svg, xScale, yScale, x1, y1, radius) {
// 	svg
// 		.append("circle")
// 		.attr("cx", xScale(x1))
// 		.attr("cy", yScale(y1))
// 		.attr("r", xScale(radius) - xScale(0))
// 		.attr("fill", "blue");
// }

// export function drawSine() {
// 	const sineData = d3
// 		.range(-10, 10, 0.1)
// 		.map((x) => ({ x, y: Math.sin(x) * 5 }));
// 	const lineGenerator = d3
// 		.line()
// 		// @ts-ignore
// 		.x((d) => xScale(d.x))
// 		// @ts-ignore
// 		.y((d) => yScale(d.y));
// 	svg
// 		.append("path")
// 		.datum(sineData)
// 		.attr("d", lineGenerator)
// 		.attr("transform", transformation)
// 		.attr("class", "line figure")
// 		.attr("fill", "none")
// 		.attr("stroke", "yellow")
// 		.attr("stroke-width", 2);
// }

// // export function drawCosine() {
// //     const sineData = d3.range(-10, 3 * Math.PI, 0.1).map(x => ({ x, y: Math.cos(x)*5 }));
// //     const lineGenerator = d3.line()
// //         .x(d => xScale(d.x))
// //         .y(d => yScale(d.y));
// //     svg.append("path")
// //         .datum(sineData)
// //         .attr("d", lineGenerator)
// //         .attr("fill", "none")
// //         .attr("stroke", "powderblue")
// //         .attr("stroke-width", 2);
// // }


import useCartesianStore from "./state.js";
import * as d3 from "d3";
import { getStrokeWidth } from "./utils.js";

export function drawLine(line) {
    const { svg, xScale, yScale, transformation } = useCartesianStore.getState();
    if (!svg || !xScale || !yScale) return;

    svg
        .append("line")
        .attr("x1", xScale(-10000))
        .attr("y1", yScale(line.m * -10000 + line.b))
        .attr("x2", xScale(10000))
        .attr("y2", yScale(line.m * 10000 + line.b))
        .attr("id", line.id)
        .attr("class", "line figure")
        .attr("transform", transformation)
        .style("stroke", "white")
        .style("stroke-width", getStrokeWidth(2, transformation));
}

export function drawCircleOutline(circle) {
    const { svg, xScale, yScale, transformation } = useCartesianStore.getState();
    if (!svg || !xScale || !yScale) return;

    svg
        .append("circle")
        .attr("cx", xScale(circle.h))
        .attr("cy", yScale(circle.k))
        .attr("r", xScale(circle.radius) - xScale(0))
        .attr("id", circle.id)
        .attr("class", "circle figure")
        .attr("transform", transformation)
        .style("stroke", "white")
        .style("stroke-width", getStrokeWidth(2, transformation))
        .style("fill", "none");
}

export function drawSine() {
    const { svg, xScale, yScale, transformation } = useCartesianStore.getState();
    if (!svg || !xScale || !yScale) return;

    const sineData = d3.range(-10, 10, 0.1)
        .map((x) => ({ x, y: Math.sin(x) * 5 }));

    const lineGenerator = d3.line()
        .x(([x, y]) => xScale(x))
        .y(([x, y]) => yScale(y));

    svg
        .append("path")
        .datum(sineData)
        .attr("d", lineGenerator)
        .attr("transform", transformation)
        .attr("class", "line figure")
        .attr("fill", "none")
        .attr("stroke", "yellow")
        .attr("stroke-width", getStrokeWidth(2, transformation));
}