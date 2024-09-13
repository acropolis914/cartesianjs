
export function drawGridLines(svg, xScale, yScale) {
    const existingGridLines = svg.selectAll('.grid-line');

    if (existingGridLines.empty()) {
        console.log('Drawing grid lines');
        const gridLines = svg.append('g').selectAll('.grid-line').data(xScale.ticks());
        
        gridLines.enter()
            .append('line')
            .attr('class', 'grid-line')
            .attr('stroke', 'lightgray')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '4 4')
            .attr('opacity', 0.2)
            .merge(gridLines)
            .attr('x1', d => xScale(d))
            .attr('y1', yScale.range()[0])
            .attr('x2', d => xScale(d))
            .attr('y2', yScale.range()[1]);

        // Remove exit nodes
        gridLines.exit().remove();

        // Create vertical grid lines
        const gridLinesY = svg.append('g').selectAll('.grid-line-y').data(yScale.ticks());

        gridLinesY.enter()
            .append('line')
            .attr('class', 'grid-line-y')
            .attr('stroke', 'lightgray')
            .attr('stroke-width', 1)
            .attr('stroke-dasharray', '4 4')
            .attr('opacity', 0.2)
            .merge(gridLinesY)
            .attr('x1', xScale.range()[0])
            .attr('y1', d => yScale(d))
            .attr('x2', xScale.range()[1])
            .attr('y2', d => yScale(d));

        gridLinesY.exit().remove();
    } else {
        // Update existing grid lines
        existingGridLines.attr('x1', d => xScale(d))
                        .attr('y1', yScale.range()[0])
                        .attr('x2', d => xScale(d))
                        .attr('y2', yScale.range()[1]);

        // Update vertical grid lines
        existingGridLines.filter('.grid-line-y').attr('x1', xScale.range()[0])
                                    .attr('y1', d => yScale(d))
                                    .attr('x2', xScale.range()[1])
                                    .attr('y2', d => yScale(d));
    }
}
