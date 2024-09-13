export function initializeGraph(width, height) {
    // Create SVG element
    const svg = d3.select('#svg-container').append("svg")
        .attr("width", width)
        .attr("height", height);

    


    // Set up scales
    const k =width/height;
    console.log(k);
    const xScale = d3.scaleLinear()
        .domain([-10 *k, 10*k])
        .range([0, width])
    const yScale = d3.scaleLinear()
        .domain([-10, 10])
        .range([height, 0]);
    
    return { svg, xScale, yScale };
}

