import { drawAxes } from "./render.js";
import { drawGridLines } from "./render.js";
import useCartesianStore from "./state.js";


let isResizing = false;


export function handleResize() {
    window.addEventListener('resize', resize);
}

function resize() {
    if (isResizing) {return;}
    isResizing = true;
    requestAnimationFrame(() => {
        const svgContainer = document.getElementById('svg-container');
        const width = svgContainer.clientWidth;
        const height = svgContainer.clientHeight;

        // Update SVG dimensions
        let svg = useCartesianStore.getState().svg;
        let xScale = useCartesianStore.getState().xScale;
        let yScale = useCartesianStore.getState().yScale
        svg.attr("width", width).attr("height", height);

        // Update scales
        //change tthis part to update the state instead of the scales
        useCartesianStore.setState({ xScale: xScale.range([0, width]) });
        useCartesianStore.setState({ yScale: yScale.range([height, 0]) });
        // xScale.range([0, width]);
        // yScale.range([height, 0]);

        // Redraw everything
        drawAxes();
        drawGridLines();

        isResizing = false;
    });
}
