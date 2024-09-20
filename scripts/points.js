import { savePoint, deletePoint, updatePoint } from './storeData.js';
import { getAllPoints } from './storeData.js';
import { addListInteractions } from './addInteractions.js';

export function addPoint(svg, xScale, yScale, point) {
    savePoint(point);
}


export function plotPoint(svg, xScale, yScale, point) {
    const circle = svg.append("circle")
        .attr("cx", xScale(point.x))
        .attr("cy", yScale(point.y))
        .attr("r", 3)
        .attr("fill", "aliceblue")
        .attr("stroke", "black")
        .attr("class", "point")
        .attr("id", point.id);

        circle.on('click', (event) => {
            event.preventDefault(); // Prevent default behavior
            
            // Enlarge the circle
            circle.transition()
                .duration(500)
                .attr("r", 10)
                .style("color", "green")
                .style("filter", "brightness(150%)"); // Increase radius to 10px
            
            // Return to original size after 1 second
            setTimeout(() => {
                circle.transition()
                    .duration(1000)
                    .attr("r", 3); // Return to original radius
            }, 1000);
        });
    }
    


export function removePoint(svg, xScale, yScale, point) {
    const id = point.id;
    if (id) {
        svg.select(`[id="${id}"]`).remove();
    }
}

export function updatePoints(svg, xScale, yScale) {
    svg.selectAll('.point').remove();
    svg.selectAll('circle').remove();
    const storedPoints = getAllPoints();
    storedPoints.forEach(point => plotPoint(svg, xScale, yScale, point));
}
