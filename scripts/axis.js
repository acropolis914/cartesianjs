export function drawAxes(svg, xScale, yScale) {
    //rEmove existing axes
    svg.selectAll('g').remove();
    svg.selectAll('text.origin').remove();

    // Get dimensions of the SVG
    const height = svg.attr('height');
    const width = svg.attr('width');


    
    // Draw X-axis
    let k = width/height;
    let xTicks= ( Math.floor(xScale.domain()[1])- Math.floor(xScale.domain()[0])+ 1);
    const xAxis = d3.axisBottom(xScale).ticks(xTicks/2 );

    svg.append("g")
        .attr("transform", `translate(0,${height / 2})`)
        .call(xAxis);

    // Draw Y-axis  
    let yTicks= ( Math.floor(yScale.domain()[1])- Math.floor(yScale.domain()[0])+ 1);
    const yAxis = d3.axisRight(yScale).ticks(yTicks/2 );
    svg.append("g")
        .attr("transform", `translate(${width / 2},0)`)
        .call(yAxis);



    // Add origin
    svg.append("text")
        .attr("class", "origin")
        .attr("x", svg.attr('width') / 2)
        .attr("y", svg.attr('height') / 2)
        .attr("text-anchor", "middle")
        .text("(0,0)")
        .attr("fill", "white");
}

