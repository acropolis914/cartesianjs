import { savePoint, deletePoint, updatePoint } from './storeData.js';
import { getAllPoints } from './storeData.js';

export function addPoint(svg, xScale, yScale, point) {
    plotPoint(svg, xScale, yScale, point);
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
    
    // Add interaction listeners
    // circle.on('click', (event) => {
    //     event.preventDefault(); // Prevent default behavior
    //     removePoint(svg, xScale, yScale, circle);
    // });
}

export function removePoint(svg, xScale, yScale, pointElement) {
    const id = pointElement.attr('id');
    if (id) {
        deletePoint(id);
        pointElement.remove();
    }
}

export function updatePoints(svg, xScale, yScale) {
    svg.selectAll('.point').remove();
    svg.selectAll('circle').remove();
    const storedPoints = getAllPoints();
    storedPoints.forEach(point => plotPoint(svg, xScale, yScale, point));
}
