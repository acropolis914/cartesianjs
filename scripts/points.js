// import useCartesianStore from "./state.js";
// import { xScale, yScale } from "./render.js";
// import { Point } from "./types.js";

// const state = useCartesianStore;
// const {svg} = state.getState();
// const {transformation} = state.getState();



// export function plotPoint(point) {
// 	const pointRadius = 5 / transformation.k;
// 	const circle = svg
// 		.append("circle")
// 		.attr("cx", xScale(point.x))
// 		.attr("cy", yScale(point.y))
// 		.attr("r", pointRadius)
// 		.attr("transform", transformation)
// 		.attr("fill", "aliceblue")
// 		.attr("stroke", "black")
// 		.attr("stroke-width", 1 / transformation.k)
// 		.attr("class", "point figure")
// 		.attr("id", point.id)
// 		.attr("alt", `(${point.x}, ${point.y})`);

// 	// Add click event to circle
// 	const currentRadius = circle.attr("r");
// 	circle.on("click", (event) => {
// 		event.preventDefault(); // Prevent default behavior
// 		// Enlarge the circle
// 		circle
// 			.transition()
// 			.duration(300)
// 			.attr("r", currentRadius * 2)
// 			.style("color", "green")
// 			.style("filter", "brightness(150%)");
// 		// Return to original size after 1 second
// 		setTimeout(() => {
// 			circle.transition().duration(1000).attr("r", currentRadius); // Return to original radius
// 		}, 1000);
// 	});
// }

// export function removePoint(point) {
// 	const id = point.id;
// 	if (id) {
// 		svg.select(`[id="${id}"]`).remove();
// 	}
// }

// // export function updatePoints() {
// //     svg.selectAll('.point').remove();
// //     // svg.selectAll('circle').remove();
// //     const storedPoints = getAllPoints();
// //     storedPoints.forEach(point => plotPoint(point));
// // }

import useCartesianStore from "./state.js";
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
