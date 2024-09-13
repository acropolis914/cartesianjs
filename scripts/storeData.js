import {svg, xScale, yScale} from './main.js';
import { updatePoints } from './points.js';
const STORE_KEY = 'cartesian-plane-points';

export function getAllPoints() {
    const storedData = localStorage.getItem(STORE_KEY);
    return storedData ? JSON.parse(storedData) : [];
}

export function savePoint(point) {
    const points = getAllPoints();
    const existingPointIndex = points.findIndex(p => p.x === point.x && p.y === point.y);

    if (existingPointIndex !== -1) {
	points[existingPointIndex] = point;
    } else {
	points.push(point);
    }

    localStorage.setItem(STORE_KEY, JSON.stringify(points));
}

export function deletePoint(id) {
    const points = getAllPoints().filter(p => p.id !== id);
    localStorage.setItem(STORE_KEY, JSON.stringify(points));
}

export function removePoints(){
    let points=[];
    localStorage.setItem(STORE_KEY, JSON.stringify(points));
    updatePoints(svg, xScale, yScale);
}

export function updatePoint(id, updatedPoint) {
    const points = getAllPoints().map(p => p.id === id ? updatedPoint : p);
    localStorage.setItem(STORE_KEY, JSON.stringify(points));
}
