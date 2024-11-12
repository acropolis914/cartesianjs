import { Point, Line, Circle, Parabola } from "./types.js";
import { plotPoint } from "./points.js";
import { drawLine, drawCircleOutline } from "./shapes.js";
import { updateList } from "./render.js";


const drawers = {
	point: plotPoint,
	line: drawLine,
	circle: drawCircleOutline,
};


export function loadAndPlotData(root, store) {
	const { storageKey } = store.getState();
	const storedData = localStorage.getItem(storageKey);
	if (!storedData) {
		console.log("No stored data found");
		return;
	}

	const { figures } = JSON.parse(storedData);
	const deserializedFigures = figures
		.map((fig) => {
			const figure = deserializeFigure(fig);
			switch (figure.type) {
				case "point":
					plotPoint(store,figure);
					break;
				case "line":
					drawLine(store,figure);
					break;
				case "circle":
					drawCircleOutline(store,figure);
					break;
				default:
					console.error("Unknown figure type:", figure.type);
					return
			}
			return figure;
		})
		.filter(Boolean);
	store.setState({figures: deserializedFigures});
	updateList(root, store);
}

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

export function addFigure(store, figure) {
	const figures= store.getState().figures;
	if (drawers[figure.type]) {
		drawers[figure.type](store,figure);
	}

	const updatedFigures = [...figures, figure];
	store.setState({ figures: updatedFigures });
	saveFigures(store);
}

export function saveFigures(store) {
	const figures = store.getState().figures;
	localStorage.setItem(store.getState().storageKey, JSON.stringify({ figures }));
}

export function removeFigure(store, figure) {
	const figures = store.getState().figures;
	const updatedFigures = figures.filter((fig) => fig.id !== figure.id);

	store.setState({ figures: updatedFigures });
	saveFigures(store);
}

export function removeAllFigures(store) {
	store.setState({ figures: [] });
	saveFigures(store);
}
