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