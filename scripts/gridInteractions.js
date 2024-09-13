let g;
export function addGridInteractions(svg,width,height) {
    g = svg
    svg.call(d3.zoom()
    .extent([[0, 0], [width, height]])
    .scaleExtent([1, 8])
    .on("zoom", zoomed));
}


function zoomed({transform}) {
    g.attr("transform", d => `translate(${transform.apply(d)})`);
}