export function drawLine(svg, xScale, yScale, x1, y1, x2, y2) {
    svg.append("line")
        .attr("x1", xScale(x1))
        .attr("y1", yScale(y1))
        .attr("x2", xScale(x2))
        .attr("y2", yScale(y2));
}

export function drawCircleOutline(svg, xScale, yScale, x, y, radius) {
    svg.append("circle")
        .attr("cx", xScale(x))
        .attr("cy", yScale(y))
        .attr("r", radius)
        .style("stroke", "black")  // Set stroke color to black
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
