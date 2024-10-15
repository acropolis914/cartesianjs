import * as d3 from "d3";
import { svg, xScale, yScale } from "./main.js";

export function drawLine(svg, xScale, yScale, x1, y1, x2, y2) {
    svg.append("line")
        .attr("x1", xScale(x1))
        .attr("y1", yScale(y1))
        .attr("x2", xScale(x2))
        .attr("y2", yScale(y2));
}

export function drawCircleOutline(x, y, radius) {
    svg.append("circle")
        .attr("cx", xScale(x))
        .attr("cy", yScale(y))
        .attr("r", xScale(radius) - xScale(0))  // Set radius of circle
        .style("stroke", "white")  // Set stroke color to black
        .style("stroke-width", "2px")  // Set stroke width to 2px
        .style("fill", "none");  // Remove fill color
}

export function drawRectangle(svg, xScale, yScale, x1, y1, x2, y2) {
    svg.append("rect")
        .attr("x", xScale(x1))
        .attr("y", yScale(y1))
        .attr("width", xScale(x2) - xScale(x1))
        .attr("height", yScale(y2) - yScale(y1))
        .attr("fill", "green");
}

export function drawShape(shapeType, x1, y1, x2, y2) {
    switch (shapeType.toLowerCase()) {
        case "line":
            drawLine(svg, xScale, yScale, x1, y1, x2, y2);
            break;
        case "circle":
            drawCircle(svg, xScale, yScale, x1, y1, 20); // Fixed radius for circle
            break;
        case "rectangle":
            drawRectangle(svg, xScale, yScale, x1, y1, x2, y2);
            break;
        default:
            console.log("Invalid shape type");
    }
}

function drawCircle(svg, xScale, yScale, x1, y1, radius) {
    svg.append("circle")
        .attr("cx", xScale(x1))
        .attr("cy", yScale(y1))
        .attr("r", xScale(radius) - xScale(0))
        .attr("fill", "blue");
}


export function drawSine(svg) {
    const sineData = d3.range(-10,10, 0.1).map(x => ({ x, y: Math.sin(x)*5 }));
    const lineGenerator = d3.line()
        // @ts-ignore
        .x(d => xScale(d.x))
        // @ts-ignore
        .y(d => yScale(d.y));
    svg.append("path")
        .datum(sineData)
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", "yellow")
        .attr("stroke-width", 2);
}

// export function drawCosine() {
//     const sineData = d3.range(-10, 3 * Math.PI, 0.1).map(x => ({ x, y: Math.cos(x)*5 }));
//     const lineGenerator = d3.line()
//         .x(d => xScale(d.x))
//         .y(d => yScale(d.y));
//     svg.append("path")
//         .datum(sineData)
//         .attr("d", lineGenerator)
//         .attr("fill", "none")
//         .attr("stroke", "powderblue")
//         .attr("stroke-width", 2);
// }


