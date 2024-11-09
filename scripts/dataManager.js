import { Point, Line, Circle, Parabola } from "./types.js";
import { plotPoint } from "./points.js";
import { drawLine, drawCircleOutline } from "./shapes.js";
import { CARTESIAN_STORE } from "./constants.js";

const STORAGE_KEY = CARTESIAN_STORE;

const drawers = {
	point: plotPoint,
	line: drawLine,
	circle: drawCircleOutline,
};

function deserializeFigure(fig) {
	switch (fig.type) {
		case "point":
			return new Point(fig.x, fig.y, fig.id);
		case "line":
			return new Line(fig.m, fig.b, fig.id);
		case "circle":
			return new Circle(fig.h, fig.k, fig.radius, fig.id);
		case "parabola":
			return new Parabola(fig.a, fig.b, fig.c, fig.id);
		default:
			console.error("Unknown figure type:", fig.type);
			return null;
	}
}

export function loadAndPlotData() {
	const storedData = localStorage.getItem(STORAGE_KEY);
	if (!storedData) {
		console.log("No stored data found");
		return;
	}

	const { figures } = JSON.parse(storedData);
	const deserializedFigures = figures
		.map((fig) => {
			const figure = deserializeFigure(fig);
			if (figure && drawers[figure.type]) {
				drawers[figure.type](figure);
			}
			return figure;
		})
		.filter(Boolean);
	return deserializedFigures;
}

export function addFigure( store, figure) {
	const { figures } = store.getState();
	if (drawers[figure.type]) {
		drawers[figure.type](figure);
	}

	const updatedFigures = [...figures, figure];
	store.setState({ figures: updatedFigures });
	saveFigures();
}

export function saveFigures(store) {
	const { figures } = store.getState();
	localStorage.setItem(STORAGE_KEY, JSON.stringify({ figures }));
}

export function removeFigure(store, figure) {
	const { figures } = store.getState();
	const updatedFigures = figures.filter((fig) => fig.id !== figure.id);

	store.setState({ figures: updatedFigures });
	saveFigures();
}

export function removeAllFigures(svg, store) {
	store.setState({ figures: [] });
	saveFigures();
}
