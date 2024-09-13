import { drawAxes } from "./axis.js";
import { drawGridLines } from "./grid.js";
import { svg, xScale, yScale } from "./main.js";
import { updatePoints } from "./points.js";

let isResizing = false;
export function handleResize() {
    if (!isResizing) {
        isResizing = true;
        requestAnimationFrame(() => {
            const svgContainer = document.getElementById('svg-container');
            const width = svgContainer.clientWidth;
            const height = svgContainer.clientHeight;

            // Update SVG dimensions
            svg.attr("width", width).attr("height", height);

            // Update scales
            xScale.range([0, width]);
            yScale.range([height, 0]);

            // Redraw everything
            drawAxes(svg, xScale, yScale);
            drawGridLines(svg, xScale, yScale);
            updatePoints(svg, xScale, yScale);

            isResizing = false;
        });
    }
}
