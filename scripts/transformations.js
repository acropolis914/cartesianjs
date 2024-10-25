export function rotateAroundOrigin(svg, xScale, yScale, point) {
	const angle = Math.atan2(
		point.attr("cy") - svg.attr("height") / 2,
		point.attr("cx") - svg.attr("width") / 2,
	);
	const rotatedPoint = {
		x:
			svg.attr("width") / 2 +
			Math.cos(angle) * (point.attr("cx") - svg.attr("width") / 2),
		y:
			svg.attr("height") / 2 +
			Math.sin(angle) * (point.attr("cy") - svg.attr("height") / 2),
	};
	drawLine(
		svg,
		xScale,
		yScale,
		rotatedPoint.x,
		rotatedPoint.y,
		point.attr("cx"),
		point.attr("cy"),
	);
}

export function scaleAroundOrigin(svg, xScale, yScale, point, scaleFactor) {
	const scaledPoint = {
		x:
			svg.attr("width") / 2 +
			scaleFactor * (point.attr("cx") - svg.attr("width") / 2),
		y:
			svg.attr("height") / 2 +
			scaleFactor * (point.attr("cy") - svg.attr("height") / 2),
	};
	drawLine(
		svg,
		xScale,
		yScale,
		scaledPoint.x,
		scaledPoint.y,
		point.attr("cx"),
		point.attr("cy"),
	);
}
