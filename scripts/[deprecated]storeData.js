import { svg, xScale, yScale, STORE_KEY } from "./main.js";
import { plotPoint } from "./points.js";
import { generateShortID } from "./utils.js";
import useCartesianStore from "./state.js";

export function getAllPoints() {
	const storedData = localStorage.getItem(STORE_KEY);
	return storedData ? JSON.parse(storedData) : [];
}

export function savePoint(point) {
	const points = getAllPoints();
	const existingPointIndex = points.findIndex(
		(p) => p.x === point.x && p.y === point.y,
	);

	if (existingPointIndex !== -1) {
		points[existingPointIndex] = point;
	} else {
		points.push(point);
	}

	localStorage.setItem(STORE_KEY, JSON.stringify(points));
	plotPoint(point);
}

export function deletePoint(point) {
	const id = point.id;
	const points = getAllPoints().filter((p) => p.id !== id);
	localStorage.setItem(STORE_KEY, JSON.stringify(points));
}

export function removeAllPoints() {
	const points = [];
	localStorage.setItem(STORE_KEY, JSON.stringify(points));
}

export function updatePoint(id, updatedPoint) {
	const points = getAllPoints().map((p) => (p.id === id ? updatedPoint : p));
	localStorage.setItem(STORE_KEY, JSON.stringify(points));
}
