import { getScaledRadius } from "./utils.js";

export function plotPoint(point) {
    const { svg, xScale, yScale, transformation } = useCartesianStore.getState();
    if (!svg || !xScale || !yScale) return;

    const pointRadius = getScaledRadius(5, transformation);
    const circle = svg
        .append("circle")
        .attr("cx", xScale(point.x))
        .attr("cy", yScale(point.y))
        .attr("r", pointRadius)
        .attr("transform", transformation)
        .attr("fill", "aliceblue")
        .attr("stroke", "black")
        .attr("stroke-width", 1 / transformation.k)
        .attr("class", "point figure")
        .attr("id", point.id)
        .attr("alt", `(${point.x}, ${point.y})`);

    addPointInteraction(circle, pointRadius);
}

export function removePoint(point) {
    const { svg } = useCartesianStore.getState();
    if (point.id) {
        svg.select(`[id="${point.id}"]`).remove();
    }
}

function addPointInteraction(circle, baseRadius) {
    circle.on("click", (event) => {
        event.preventDefault();
        circle
            .transition()
            .duration(300)
            .attr("r", baseRadius * 2)
            .style("color", "green")
            .style("filter", "brightness(150%)");
            
        setTimeout(() => {
            circle.transition().duration(1000).attr("r", baseRadius);
        }, 1000);
    });
}
